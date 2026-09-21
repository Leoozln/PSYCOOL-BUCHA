const pagamento = require('../1models/pagamento');

async function listar(req, res) {
    try {
        const registros = await pagamento.findAll();
        res.json(registros);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function buscar(req, res) {
    try {
        const item = await pagamento.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Pagamento não encontrado.' });
        res.json(item);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req, res) {
    try {
        const novo = await pagamento.create({
            id_agenda_pagamento: req.body.id_agenda_pagamento,
            preco_final: req.body.preco_final,
            forma_pagamento: req.body.forma_pagamento,
            situacao_pagamento: req.body.situacao_pagamento
        });
        res.status(201).json(novo);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const item = await pagamento.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Pagamento não encontrado.' });

        await item.update({
            id_agenda_pagamento: req.body.id_agenda_pagamento,
            preco_final: req.body.preco_final,
            forma_pagamento: req.body.forma_pagamento,
            situacao_pagamento: req.body.situacao_pagamento
        });

        res.json(item);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const item = await pagamento.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Pagamento não encontrado.' });
        await item.destroy();
        res.json({ mensagem: "Pagamento removido." });
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