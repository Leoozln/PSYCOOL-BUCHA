const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Usuario } = require('../1models');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let usuario = await Usuario.findOne({ where: { google_id: profile.id } });
      if (!usuario) {
        usuario = await Usuario.findOne({ where: { email_usuario: profile.emails[0].value } });
        if (usuario) {
          usuario.google_id = profile.id;
          usuario.google_access_token = accessToken;
          usuario.google_refresh_token = refreshToken;
          await usuario.save();
        }
      }

      if (!usuario) {
        return done(null, false, { message: 'Conta não cadastrada no PsyCool.' });
      }

      if (!usuario.ativo) {
        return done(null, false, { message: 'Sua conta está desativada.' });
      }

      return done(null, usuario);
    } catch (erro) {
      return done(erro, null);
    }
  }
));

passport.serializeUser((usuario, done) => {
  done(null, usuario.id_usuario);
});

passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await Usuario.findByPk(id);
    done(null, usuario);
  } catch (erro) {
    done(erro, null);
  }
});

module.exports = passport;