const express = require('express');

const router = express.Router();

const controller = require('../2controllers/clienteController');

const { exigirLogin, exigirPerfil } = require('../middlewares/autenticacao');

router.get('/', exigirLogin, exigirPerfil('Administrador'), controller.listar);

router.get('/:id_cliente', exigirLogin, (req, res, next) => {
    if (req.user.tipo_usuario !== 'Administrador' && req.user.id_usuario !== parseInt(req.params.id_cliente)) {
        return res.status(403).json({ erro: 'Você só pode acessar o seu próprio perfil.' });
    }
    next();
}, controller.buscar);

router.post('/',controller.inserir);

router.put('/:id_cliente', exigirLogin, (req, res, next) => {
    if (req.user.tipo_usuario !== 'Administrador' && req.user.id_usuario !== parseInt(req.params.id_cliente)) {
        return res.status(403).json({ erro: 'Você só pode atualizar o seu próprio perfil.' });
    }
    next();
}, controller.atualizar);

router.delete('/:id_cliente', exigirLogin, exigirPerfil('Administrador'), controller.excluir);

module.exports = router;