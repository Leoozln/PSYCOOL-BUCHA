const express = require('express');
const passport = require('passport');
const router = express.Router();
const { Psicologo, Cliente, Empresa } = require('../1models');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  // keepSessionInfo: o passport 0.7 troca a sessão no login (anti session fixation) e descartaria
  // o req.session.cadastroPendente gravado em config/passport.js.
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login?error=falha_google',
    keepSessionInfo: true
  }),
  (req, res) => {
    if (req.user && req.user.cadastroPendente) {
      return res.redirect('http://localhost:5173/cadastro/psicologo');
    }
    res.redirect('http://localhost:5173/');
  }
);

router.get('/me', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }
  
  const user = req.user;

  if (user && user.cadastroPendente) {
    return res.status(200).json({
      cadastroPendente: true,
      email: req.session.cadastroPendente.email,
      nome: req.session.cadastroPendente.nome
    });
  }

  let nome = null;
  let status_validacao = null;

  try {
    if (user.tipo_usuario === 'Psicologo') {
      const perfil = await Psicologo.findByPk(user.id_usuario);
      if (perfil) {
        nome = perfil.nome_psicologo;
        status_validacao = perfil.status_validacao;
      }
    } else if (user.tipo_usuario === 'Cliente') {
      const perfil = await Cliente.findByPk(user.id_usuario);
      if (perfil) {
        nome = perfil.nome_cliente;
      }
    } else if (user.tipo_usuario === 'Empresa') {
      const perfil = await Empresa.findByPk(user.id_usuario);
      if (perfil) {
        nome = perfil.nome_empresa;
      }
    } else if (user.tipo_usuario === 'Administrador') {
      nome = "Administrador";
    }

    return res.status(200).json({
      id_usuario: user.id_usuario,
      email_usuario: user.email_usuario,
      tipo_usuario: user.tipo_usuario,
      nome: nome,
      status_validacao: status_validacao
    });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao buscar dados do perfil' });
  }
});

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.json({ mensagem: 'Logout realizado com sucesso' });
    });
  });
});

module.exports = router;