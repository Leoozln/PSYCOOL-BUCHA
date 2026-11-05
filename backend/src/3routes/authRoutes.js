const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=nao_cadastrado' }),
  (req, res) => {
    res.redirect('http://localhost:5173/');
  }
);

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ erro: 'Não autenticado' });
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