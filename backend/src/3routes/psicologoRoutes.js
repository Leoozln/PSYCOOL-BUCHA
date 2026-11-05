const express = require('express');

const router = express.Router();

const controller = require('../2controllers/psicologoController');

// TEMPORÁRIO (até a SCRUM-192): trocar pelo middleware definitivo de login.
const { exigirLogin, exigirPerfil } = require('../middlewares/autenticacaoTemporaria');

router.get('/',controller.listar);

// Precisa vir antes de /:id.
router.get('/me/consultas', exigirLogin, exigirPerfil('Psicologo'), controller.listarMinhasConsultas);

router.get('/:id',controller.buscar);

router.post('/',controller.inserir);

router.put('/:id',controller.atualizar);

router.delete('/:id',controller.excluir);

module.exports = router;