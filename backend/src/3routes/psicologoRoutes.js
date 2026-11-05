const express = require('express');

const router = express.Router();

const controller = require('../2controllers/psicologoController');

router.get('/',controller.listar);

router.get('/:id',controller.buscar);

// TODO: rota legada (cadastro com senha). Remover quando a SCRUM-204 migrar o front para POST /cadastro/psicologo.
router.post('/',controller.inserir);

router.put('/:id',controller.atualizar);

router.delete('/:id',controller.excluir);

module.exports = router;