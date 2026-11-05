const { Usuario, Psicologo } = require('../1models');
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
            senha_usuario
        } = req.body;
        if (!email_usuario || !senha_usuario) {
            return res.status(400).json({ erro: 'Email e senha do usuário são obrigatórios!' });
        }
        const resultado = await sequelize.transaction(async (t) => {
            const usuarionovo = await Usuario.create({
                tipo_usuario: 'Psicologo',
                email_usuario,
                senha_usuario,
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
        } = req.body;

        // Esqueleto: validações (passo 4) e gravação (passo 6) entram nos próximos passos.
        res.status(501).json({ erro: 'nao_implementado', mensagem: 'Cadastro do psicólogo em construção.' });
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

module.exports = {
    listar,
    buscar,
    inserir,
    cadastrarPsicologo,
    atualizar,
    excluir
};