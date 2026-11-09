const express = require('express');
const router = express.Router();
const controller = require('../2controllers/empresaController');
const { exigirLogin, exigirPerfil } = require('../middlewares/autenticacao');

router.get('/', exigirLogin, exigirPerfil('Administrador'), controller.listar);
router.get('/:id', exigirLogin, controller.buscar);
router.post('/', controller.inserir);
router.put('/:id', exigirLogin, controller.atualizar);
router.delete('/:id', exigirLogin, exigirPerfil('Administrador'), controller.excluir);

module.exports = router;