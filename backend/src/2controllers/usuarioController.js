const { Usuario } = require('../1models');
const tratarErroSequelize = require('../utils/tratarErroSequelize');

async function listar(req, res){
    try{
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    }catch(erro){
        tratarErroSequelize(erro, res);
    }
}

async function buscar(req, res){
    try{
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        res.json(usuario);
    }catch(erro){
        tratarErroSequelize(erro, res);
    }
}

async function inserir(req, res) {
    try {
        const {
            tipo_usuario,
            email_usuario,
            google_id,
            ativo
        } = req.body;
        if (!google_id) {
            return res.status(400).json({ erro: 'O Login no Gmail é obrigatório'})
        }
        const usuarionovo = await Usuario.create({
            tipo_usuario,
            email_usuario,
            google_id,
            ativo
        });
        res.status(201).json(usuarionovo);
    } catch (erro) {
        tratarErroSequelize(erro, res);
    }
}

async function atualizar(req, res){
    try{
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        const {
            tipo_usuario,
            email_usuario,
            google_id,
            ativo
        } = req.body;
        await usuario.update({
            tipo_usuario,
            email_usuario,
            google_id,
            ativo
        });
        res.json(usuario);
    }catch(erro){
        tratarErroSequelize(erro, res);
    }
}

async function excluir(req, res){
    try{
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        await usuario.destroy();
        res.json({ mensagem: "Usuario removido com sucesso."});
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