const express = require('express');
const router = express.Router();
const controller = require('../2controllers/usuarioController');
const { exigirLogin, exigirPerfil } = require('../middlewares/autenticacao');

router.get('/', exigirLogin, exigirPerfil('Administrador'), controller.listar);
router.get('/:id', exigirLogin, (req, res, next) => {
    if (req.user.tipo_usuario !== 'Administrador' && req.user.id_usuario !== parseInt(req.params.id)) {
        return res.status(403).json({ erro: 'Acesso negado.' });
    }
    next();
}, controller.buscar);

router.post('/',controller.inserir);

router.put('/:id', exigirLogin, (req, res, next) => {
    if (req.user.tipo_usuario !== 'Administrador' && req.user.id_usuario !== parseInt(req.params.id)) {
        return res.status(403).json({ erro: 'Acesso negado.' });
    }
    next();
}, controller.atualizar);

router.delete('/:id', exigirLogin, exigirPerfil('Administrador'), controller.excluir);

module.exports = router;