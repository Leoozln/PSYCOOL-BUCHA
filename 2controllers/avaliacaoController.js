const avaliacao = require('../1models/avaliacao');

async function listar(req, res) {
    try {
        const registros = await avaliacao.findAll();
        res.json(registros);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function buscar(req, res) {
    try {
        const item = await avaliacao.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Avaliação não encontrada.' });
        res.json(item);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req, res) {
    try {
        const nova = await avaliacao.create({
            avaliacao_psicologo: req.body.avaliacao_psicologo,
            estrela_avaliacao: req.body.estrela_avaliacao,
            texto_avaliacao: req.body.texto_avaliacao,
            avaliacao_consulta: req.body.avaliacao_consulta
        });
        res.status(201).json(nova);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const item = await avaliacao.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Avaliação não encontrada.' });

        await item.update({
            avaliacao_psicologo: req.body.avaliacao_psicologo,
            estrela_avaliacao: req.body.estrela_avaliacao,
            texto_avaliacao: req.body.texto_avaliacao,
            avaliacao_consulta: req.body.avaliacao_consulta
        });

        res.json(item);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const item = await avaliacao.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Avaliação não encontrada.' });
        await item.destroy();
        res.json({ mensagem: "Avaliação removida." });
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