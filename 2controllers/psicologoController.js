const Psicologo = require('../1models/Psicologo');

async function listar(req,res){
    try{
        const psicologos = await Psicologo.findAll();
        res.json(psicologos);
    }catch(erro) {
        res.status(500).json({ erro: erro.message });
    }

}

async function buscar(req,res){
    try{
        const psicologo = await Psicologo.findByPk(req.params.id);
        if (!psicologo) {
            return res.status(404).json({ erro: 'Psicólogo não encontrado!'});
        }
        res.json(psicologo);
    } catch (erro) {
        res.status(500).json({erro:erro.message});
    }
}

async function inserir(req,res){
    try {
        const {
            nome_psicologo,
            crp_psicologo,
            contato_psicologo,
            diploma_psicologo,
            genero_psicologo,
            data_nascimento_psicologo,
            especialidade_psicologo,
            foto_psicologo,
            descricao_psicologo
        } = req.body;
        const psicologo = await Psicologo.create({
            nome_psicologo,
            crp_psicologo,
            contato_psicologo,
            diploma_psicologo: diploma_psicologo || [],
            genero_psicologo,
            data_nascimento_psicologo,
            especialidade_psicologo,
            foto_psicologo,
            descricao_psicologo
        });
        res.status(201).json(psicologo);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
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
            contato_psicologo,
            diploma_psicologo,
            genero_psicologo,
            data_nascimento_psicologo,
            especialidade_psicologo,
            foto_psicologo,
            descricao_psicologo
        } = req.body;
        await psicologo.update({
            nome_psicologo,
            crp_psicologo,
            contato_psicologo,
            diploma_psicologo,
            genero_psicologo,
            data_nascimento_psicologo,
            especialidade_psicologo,
            foto_psicologo,
            descricao_psicologo
        });
        res.json(psicologo);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req,res){
    try{
        const psicologo = await Psicologo.findByPk(req.params.id);
        if (!psicologo) {
            return res.status(404).json({ erro: 'Psicólogo não encontrado!' });
        }
        await psicologo.destroy();
        res.json({ mensagem: 'Psicólogo removido com sucesso!'});
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = {
    listar,
    buscar,
    inserir,
    atualizar,
    excluir
};