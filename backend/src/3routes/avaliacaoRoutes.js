const express = require('express');
const router = express.Router();
const controller = require('../2controllers/avaliacaoController');
const { exigirLogin, exigirPerfil } = require('../middlewares/autenticacao');

router.get('/', exigirLogin, exigirPerfil('Administrador'), controller.listar);
router.get('/:id', controller.buscar);
router.post('/', exigirLogin, exigirPerfil('Cliente'), controller.inserir);
router.put('/:id', exigirLogin, exigirPerfil('Administrador'), controller.atualizar);
router.delete('/:id', exigirLogin, exigirPerfil('Administrador'), controller.excluir);

module.exports = router;