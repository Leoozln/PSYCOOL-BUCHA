const { Avaliacao } = require('../1models');

async function listar(req, res) {
    try {
        const avaliacoes = await Avaliacao.findAll();
        res.json(avaliacoes);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function buscar(req, res) {
    try {
        const avaliacao = await Avaliacao.findByPk(req.params.id);
        if (!avaliacao) return res.status(404).json({ erro: 'Avaliação não encontrada.' });
        res.json(avaliacao);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req, res) {
    try {
        const avaliacaonova = await Avaliacao.create({
            avaliacao_psicologo: req.body.avaliacao_psicologo,
            estrela_avaliacao: req.body.estrela_avaliacao,
            texto_avaliacao: req.body.texto_avaliacao,
            avaliacao_consulta: req.body.avaliacao_consulta
        });
        res.status(201).json(avaliacaonova);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const avaliacao = await Avaliacao.findByPk(req.params.id);
        if (!avaliacao) return res.status(404).json({ erro: 'Avaliação não encontrada.' });

        await avaliacao.update({
            avaliacao_psicologo: req.body.avaliacao_psicologo,
            estrela_avaliacao: req.body.estrela_avaliacao,
            texto_avaliacao: req.body.texto_avaliacao,
            avaliacao_consulta: req.body.avaliacao_consulta
        });

        res.json(avaliacao);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const avaliacao = await Avaliacao.findByPk(req.params.id);
        if (!avaliacao) return res.status(404).json({ erro: 'Avaliação não encontrada.' });
        await avaliacao.destroy();
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