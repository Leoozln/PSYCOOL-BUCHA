const consulta = require('../1models/consulta');

async function listar(req, res) {
    try {
        const registros = await consulta.findAll();
        res.json(registros);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function buscar(req, res) {
    try {
        const item = await consulta.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Consulta não encontrada.' });
        res.json(item);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req, res) {
    try {
        const nova = await consulta.create({
            id_consulta_agendada: req.body.id_consulta_agendada,
            id_psicologo_responsavel: req.body.id_psicologo_responsavel,
            id_cliente_consultado: req.body.id_cliente_consultado,
            link_consulta: req.body.link_consulta,
            data_hora_consulta: req.body.data_hora_consulta
        });
        res.status(201).json(nova);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const item = await consulta.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Consulta não encontrada.' });

        await item.update({
            id_consulta_agendada: req.body.id_consulta_agendada,
            id_psicologo_responsavel: req.body.id_psicologo_responsavel,
            id_cliente_consultado: req.body.id_cliente_consultado,
            link_consulta: req.body.link_consulta,
            data_hora_consulta: req.body.data_hora_consulta
        });

        res.json(item);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const item = await consulta.findByPk(req.params.id);
        if (!item) return res.status(404).json({ erro: 'Consulta não encontrada.' });
        await item.destroy();
        res.json({ mensagem: "Consulta removida." });
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
