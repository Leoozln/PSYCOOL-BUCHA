const { Empresa } = require('../1models');

async function listar(req, res) {
    try {
        const empresas = await Empresa.findAll();
        res.json(empresas);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function buscar(req, res) {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada.' });
        res.json(empresa);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function inserir(req, res) {
    try {
        const empresanova = await Empresa.create({
            id_empresa: req.body.id_empresa, 
            nome_empresa: req.body.nome_empresa,
            cnpj_empresa: req.body.cnpj_empresa,
            contato_empresa: req.body.contato_empresa,
            convenio_empresa: req.body.convenio_empresa,
            nome_fantasia: req.body.nome_fantasia,
            cep_empresa: req.body.cep_empresa,
            logo_empresa: req.body.logo_empresa,
            descricao_empresa: req.body.descricao_empresa
        });
        res.status(201).json(empresanova);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada.' });

        await empresa.update({
            nome_empresa: req.body.nome_empresa,
            cnpj_empresa: req.body.cnpj_empresa,
            contato_empresa: req.body.contato_empresa,
            convenio_empresa: req.body.convenio_empresa,
            nome_fantasia: req.body.nome_fantasia,
            cep_empresa: req.body.cep_empresa,
            logo_empresa: req.body.logo_empresa,
            descricao_empresa: req.body.descricao_empresa
        });

        res.json(empresa);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function excluir(req, res) {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada.' });
        await empresa.destroy();
        res.json({ mensagem: "Empresa removida." });
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