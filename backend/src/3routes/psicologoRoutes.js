const express = require('express');
const router = express.Router();
const controller = require('../2controllers/psicologoController');
const { exigirLogin, exigirPerfil } = require('../middlewares/autenticacao');

router.get('/', exigirLogin, exigirPerfil('Administrador'), controller.listar);
router.get('/me/consultas', exigirLogin, exigirPerfil('Psicologo'), controller.listarMinhasConsultas);
router.get('/:id', exigirLogin, controller.buscar);
router.post('/', controller.inserir);
router.put('/:id', exigirLogin, exigirPerfil('Administrador', 'Psicologo'), controller.atualizar);
router.delete('/:id', exigirLogin, exigirPerfil('Administrador'), controller.excluir);

module.exports = router;