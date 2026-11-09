const express = require('express');
const router = express.Router();
const controller = require('../2controllers/agendaController');
const { exigirLogin, exigirPerfil } = require('../middlewares/autenticacao');

router.get('/', exigirLogin, exigirPerfil('Administrador'), controller.listar);
// Criar lógica para psicólogo e cliente verificar a agenda
router.get('/:id', exigirLogin, exigirPerfil('Administrador'), controller.buscar);
router.post('/', exigirLogin, exigirPerfil('Administrador', 'Psicologo'), controller.inserir);
router.put('/:id', exigirLogin, exigirPerfil('Administrador', 'Psicologo'), controller.atualizar);
router.delete('/:id', exigirLogin, exigirPerfil('Administrador'), controller.excluir);

module.exports = router;