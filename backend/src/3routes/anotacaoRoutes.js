const express = require('express');
const router = express.Router();
const controller = require('../2controllers/anotacaoController');
const { exigirLogin, exigirPerfil, exigirPsicologoAprovado } = require('../middlewares/autenticacao');

router.get('/', exigirLogin, exigirPerfil('Administrador'), controller.listar);
router.get('/:id', exigirLogin, exigirPerfil('Administrador', 'Psicologo'), exigirPsicologoAprovado, controller.buscar);
router.post('/', exigirLogin, exigirPerfil('Psicologo'), exigirPsicologoAprovado, controller.inserir);
router.put('/:id', exigirLogin, exigirPerfil('Psicologo'), exigirPsicologoAprovado, controller.atualizar);
router.delete('/:id', exigirLogin, exigirPerfil('Administrador'), controller.excluir);

module.exports = router;