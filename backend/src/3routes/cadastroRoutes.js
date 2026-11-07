const express = require('express');

const router = express.Router();

const controller = require('../2controllers/psicologoController');

router.post('/psicologo',controller.cadastrarPsicologo);

module.exports = router;
