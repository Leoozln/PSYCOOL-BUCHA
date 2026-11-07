const { Op } = require('sequelize');
const { Usuario, Psicologo, Consulta, Cliente, Agenda } = require('../1models');
const sequelize = require('../config/database');
const tratarErroSequelize = require('../utils/tratarErroSequelize');

const inclusaoUsuario = {
    model: Usuario,
    attributes: ['email_usuario']
};
 
async function listar(req,res){
    try{
        const psicologos = await Psicologo.findAll({ include: [inclusaoUsuario] });
        res.json(psicologos);
    }catch(erro) {
        tratarErroSequelize(erro, res);
    }
}
 
async function buscar(req,res){
    try{
        const psicologo = await Psicologo.findByPk(req.params.id, { include: [inclusaoUsuario] });
        if (!psicologo) {
            return res.status(404).json({ erro: 'Psicólogo não encontrado!'});
        }
        res.json(psicologo);
    }catch(erro) {
        tratarErroSequelize(erro, res);
    }
}

// TODO: fluxo legado (exige senha e não passa pela sessão do Google nem pelo aceite do termo).
// Remover junto com a rota POST /psicologo quando a SCRUM-204 migrar o front para cadastrarPsicologo.
async function inserir(req,res){
    try {
        const {
            nome_psicologo,
            crp_psicologo,
            cpf_psicologo,
            contato_psicologo,
            diploma_psicologo,
            genero_psicologo,
            data_nascimento_psicologo,
            especialidade_psicologo,
            foto_psicologo,
            descricao_psicologo,
            abordagem_psicologo,
            email_usuario,
            google_id
        } = req.body;
        if (!email_usuario || !google_id) {
            return res.status(400).json({ erro: 'O Login no Gmail é obrigatório!' });
        }
        const resultado = await sequelize.transaction(async (t) => {
            const usuarionovo = await Usuario.create({
                tipo_usuario: 'Psicologo',
                email_usuario,
                google_id,
                ativo: true
            }, { transaction: t });
            const psicologonovo = await Psicologo.create({
                id_psicologo: usuarionovo.id_usuario,
                nome_psicologo,
                crp_psicologo,
                cpf_psicologo,
                contato_psicologo,
                diploma_psicologo: diploma_psicologo || [],
                genero_psicologo,
                data_nascimento_psicologo,
                especialidade_psicologo,
                foto_psicologo,
                descricao_psicologo,
                abordagem_psicologo
            }, { transaction: t });
            return await Psicologo.findByPk(psicologonovo.id_psicologo, {
                include: [inclusaoUsuario],
                transaction: t
            });
        });
        res.status(201).json(resultado);
    }catch(erro) {
        tratarErroSequelize(erro, res);
    }
}
 
// POST /cadastro/psicologo
// Cadastro do psicólogo com login pelo Google: não recebe senha, e o e-mail NUNCA vem do corpo,
// vem do cadastro pendente guardado na sessão. (Diferente do inserir, que é o CRUD antigo com senha.)
async function cadastrarPsicologo(req,res){
    try{
        const pendente = req.session.cadastroPendente;
        if (!pendente) {
            return res.status(401).json({
                erro: 'login_google_necessario',
                mensagem: 'Faça o login com o Google antes de se cadastrar.'
            });
        }

        // No Express 5, req.body fica undefined quando o corpo não é JSON.
        const corpo = req.body || {};

        // Comparação estrita de propósito: só o booleano true vale ("true", 1 e "sim" são recusados).
        // Só valida o aceite, não grava em nenhuma tabela.
        if (corpo.aceite_termo !== true) {
            return res.status(400).json({
                erro: 'termo_nao_aceito',
                mensagem: 'É necessário aceitar o termo de adesão.'
            });
        }

        const {
            nome_psicologo,
            cpf_psicologo,
            data_nascimento_psicologo,
            contato_psicologo,
            crp_psicologo,
            especialidade_psicologo,
            diploma_psicologo,
            genero_psicologo,
            abordagem_psicologo,
            descricao_psicologo
        } = corpo;

        const psicologo = await sequelize.transaction(async (t) => {
            const usuarionovo = await Usuario.create({
                tipo_usuario: 'Psicologo',
                email_usuario: pendente.email,
                google_id: pendente.google_id,
                ativo: true
            }, { transaction: t });
            const psicologonovo = await Psicologo.create({
                id_psicologo: usuarionovo.id_usuario,
                nome_psicologo,
                crp_psicologo,
                cpf_psicologo,
                contato_psicologo,
                diploma_psicologo: diploma_psicologo || [],
                genero_psicologo,
                data_nascimento_psicologo,
                especialidade_psicologo,
                descricao_psicologo,
                abordagem_psicologo,
                status_validacao: 'PENDENTE'
            }, { transaction: t });
            return await Psicologo.findByPk(psicologonovo.id_psicologo, {
                include: [inclusaoUsuario],
                transaction: t
            });
        });

        // O logout limpa req.user e regenera a sessão (o passport 0.7 descarta o cadastroPendente junto).
        // Só apagar o cadastroPendente deixaria req.user = { cadastroPendente: true } e o /auth/me daria 500.
        // O psicólogo já está gravado, então se o logout falhar só registramos o erro e respondemos 201 do mesmo jeito.
        req.logout((erroLogout) => {
            if (erroLogout) {
                console.error('Falha ao encerrar a sessão após o cadastro do psicólogo:', erroLogout);
            }
            res.status(201).json(psicologo);
        });
    }catch(erro) {
        tratarErroSequelize(erro, res);
    }
}

async function atualizar(req,res){
    try{
        const psicologo = await Psicologo.findByPk(req.params.id);
        if(!psicologo) {
            return res.status(404).json({ erro: 'Psicólogo não encontrado!'});
        }
        const {
            nome_psicologo,
            crp_psicologo,
            cpf_psicologo,
            contato_psicologo,
            diploma_psicologo,
            genero_psicologo,
            data_nascimento_psicologo,
            especialidade_psicologo,
            foto_psicologo,
            descricao_psicologo,
            abordagem_psicologo
        } = req.body;
        await psicologo.update({
            nome_psicologo,
            crp_psicologo,
            cpf_psicologo,
            contato_psicologo,
            diploma_psicologo,
            genero_psicologo,
            data_nascimento_psicologo,
            especialidade_psicologo,
            foto_psicologo,
            descricao_psicologo,
            abordagem_psicologo
        });
        res.json(psicologo);
    } catch(erro) {
        tratarErroSequelize(erro, res);
    }
}

 
async function excluir(req,res){
    try{
        const psicologo = await Psicologo.findByPk(req.params.id);
        if (!psicologo) {
            return res.status(404).json({ erro: 'Psicólogo não encontrado!' });
        }
        await psicologo.destroy();
        res.json({ mensagem: 'Psicólogo removido!'});
    } catch(erro) {
        tratarErroSequelize(erro, res);
    }
}

// Consultas futuras do psicólogo logado (req.user), da mais próxima para a mais distante.
// Só entram as consultas cuja agenda está AGENDADO.
async function listarMinhasConsultas(req, res) {
    try {
        const consultas = await Consulta.findAll({
            attributes: ['id_consulta', 'data_hora_consulta', 'link_consulta'],
            where: {
                id_psicologo_responsavel: req.user.id_usuario,
                data_hora_consulta: { [Op.gte]: new Date() }
            },
            include: [
                {
                    model: Cliente,
                    attributes: ['nome_cliente']
                },
                {
                    model: Agenda,
                    attributes: ['status_agenda'],
                    where: { status_agenda: 'AGENDADO' },
                    required: true
                }
            ],
            order: [['data_hora_consulta', 'ASC']]
        });

        res.json(consultas.map((consulta) => ({
            id_consulta: consulta.id_consulta,
            data_hora: consulta.data_hora_consulta,
            nome_paciente: consulta.Cliente ? consulta.Cliente.nome_cliente : null,
            status: consulta.Agenda.status_agenda,
            link: consulta.link_consulta
        })));
    } catch (erro) {
        tratarErroSequelize(erro, res);
    }
}

module.exports = {
    listar,
    buscar,
    inserir,
    cadastrarPsicologo,
    atualizar,
    excluir,
    listarMinhasConsultas
};