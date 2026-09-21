const anotacoes = require('../1models/anotacoes');

async function listar(req, res) {
    try {
        const registros = await anotacoes.findAll();
        res.json(registros);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function buscar(req, res) {
    try {
        const item = await anotacoes.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Anotação não encontrada.' });
        res.json(item);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req, res) {
    try {
        const nova = await anotacoes.create({
            id_consulta_anotacao: req.body.id_consulta_anotacao,
            anotacao_cliente: req.body.anotacao_cliente,
            anotacao_psicologo: req.body.anotacao_psicologo
        });
        res.status(201).json(nova);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const item = await anotacoes.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Anotação não encontrada.' });

        await item.update({
            id_consulta_anotacao: req.body.id_consulta_anotacao,
            anotacao_cliente: req.body.anotacao_cliente,
            anotacao_psicologo: req.body.anotacao_psicologo
        });

        res.json(item);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const item = await anotacoes.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Anotação não encontrada.' });
        await item.destroy();
        res.json({ mensagem: "Anotação removida." });
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