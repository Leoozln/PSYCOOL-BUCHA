const express = require('express');
const router = express.Router();
const controller = require('../2controllers/consultaController');
const { exigirLogin, exigirPerfil } = require('../middlewares/autenticacao');

router.get('/', exigirLogin, exigirPerfil('Administrador'), controller.listar);
// Buscar por ID: Admin ou o próprio Psicologo/Cliente (lógica a ser refinada no controller)
router.get('/:id', exigirLogin, controller.buscar);
router.post('/', exigirLogin, exigirPerfil('Administrador', 'Psicologo'), controller.inserir);
router.put('/:id', exigirLogin, exigirPerfil('Administrador', 'Psicologo'), controller.atualizar);
router.delete('/:id', exigirLogin, exigirPerfil('Administrador'), controller.excluir);

module.exports = router;