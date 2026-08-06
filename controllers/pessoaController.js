const Pessoa = require('../models/pessoaModel');

async function listar(req, res) {
    try {
        const pessoas = await Pessoa.listar();
        res.json(pessoas);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function buscar(req, res) {
    try {
        const pessoa = await Pessoa.buscarPorId(req.params.id);

        if (!pessoa) {
            return res.status(404).json({ mensagem: 'Pessoa não encontrada' });
        }

        res.json(pessoa);

    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req, res) {
    try {
        const { pes_nome } = req.body;

        const pessoa = await Pessoa.inserir(pes_nome);
 
        res.status(201).json(pessoa);

    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {

    try {

        const { pes_nome } = req.body;

        const pessoa = await Pessoa.atualizar(
            req.params.id,
            pes_nome
        );

        res.json(pessoa);

    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }

}

async function excluir(req, res) {

    try {

        await Pessoa.excluir(req.params.id);

        res.json({
            mensagem: 'Pessoa excluída com sucesso'
        });

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
