const { Avaliacao } = require('../1models');
const tratarErroSequelize = require('../utils/tratarErroSequelize');

async function listar(req, res) {
    try {
        const avaliacoes = await Avaliacao.findAll();
        res.json(avaliacoes);
    } catch (erro) {
        tratarErroSequelize(erro, res);
    }
}

async function buscar(req, res) {
    try {
        const avaliacao = await Avaliacao.findByPk(req.params.id);
        if (!avaliacao) {
             return res.status(404).json({ erro: 'Avaliação não encontrada!' });
        }
        res.json(avaliacao);
    } catch (erro) {
        tratarErroSequelize(erro, res);
    }
}

async function inserir(req, res) {
    try {
        const {
            avaliacao_psicologo,
            estrela_avaliacao,
            texto_avaliacao,
            avaliacao_consulta
        } = req.body;
        const avaliacaonova = await Avaliacao.create({
            avaliacao_psicologo,
            estrela_avaliacao,
            texto_avaliacao,
            avaliacao_consulta
        });
        res.status(201).json(avaliacaonova);
    } catch (erro) {
        tratarErroSequelize(erro, res);
    }
}

async function atualizar(req, res) {
    try {
        const avaliacao = await Avaliacao.findByPk(req.params.id);
        if (!avaliacao) {
            return res.status(404).json({ erro: 'Avaliação não encontrada!' });
        } const {
            avaliacao_psicologo,
            estrela_avaliacao,
            texto_avaliacao,
            avaliacao_consulta
        } = req.body;
        await avaliacao.update({
            avaliacao_psicologo,
            estrela_avaliacao,
            texto_avaliacao,
            avaliacao_consulta
        });
        res.json(avaliacao);
    } catch (erro) {
        tratarErroSequelize(erro, res);
    }
}

async function excluir(req, res) {
    try {
        const avaliacao = await Avaliacao.findByPk(req.params.id);
        if (!avaliacao) {
            return res.status(404).json({ erro: 'Avaliação não encontrada!' });
        }
        await avaliacao.destroy();
        res.json({ mensagem: "Avaliação removida!" });
    } catch (erro) {
        tratarErroSequelize(erro, res);
    }
}

module.exports = {
    listar,
    buscar,
    inserir,
    atualizar,
    excluir
};