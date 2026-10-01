const { Usuario } = require('../1models');

async function listar(req, res){
    try{
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    }catch(erro){
        res.status(500).json({erro: erro.message});
    }
}

async function buscar(req, res){
    try{
        const usuarios = await Usuario.findByPk(req.params.id);
        res.json(usuarios);
    }catch(erro){
        res.status(500).json({erro: erro.message});
    }
}

async function inserir(req, res) {
    try {
        const usuarionovo = await Usuario.create({
            tipo_usuario: req.body.tipo_usuario,
            email_usuario: req.body.email_usuario,
            senha_usuario: req.body.senha_usuario,
            ativo: req.body.ativo
        });
        res.status(201).json(usuarionovo);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res){
    try{
        const usuario = await Usuario.findByPk(req.params.id);
        await usuario.update({
            tipo_usuario: req.body.tipo_usuario,
            email_usuario: req.body.email_usuario,
            senha_usuario: req.body.senha_usuario,
            ativo: req.body.ativo
        });
        res.json(usuario);

    }catch(erro){
        res.status(500).json({erro: erro.message});
    }
}

async function excluir(req, res){
    try{
        const usuario = await Usuario.findByPk(req.params.id);
        await usuario.destroy();
        res.json({
            mensagem: "Usuario removido com sucesso."
        });
    }catch(erro){
        res.status(500).json({erro: erro.message});
    }
}

module.exports = {
    listar,
    buscar,
    inserir,
    atualizar,
    excluir
};