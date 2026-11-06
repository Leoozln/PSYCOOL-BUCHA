// TEMPORÁRIO: estes middlewares serão substituídos pelos da SCRUM-192 quando o login com Passport
// entrar na main. Seguem o mesmo formato do Passport: o usuário logado fica em req.user
// (instância de Usuario, com id_usuario e tipo_usuario).
//
// simularUsuario só age com SIMULAR_LOGIN=true no .env e lê o id do usuário do header x-usuario-teste.
// Nunca deixe SIMULAR_LOGIN ligado fora do ambiente de desenvolvimento.

const { Usuario } = require('../1models');
const tratarErroSequelize = require('../utils/tratarErroSequelize');

async function simularUsuario(req, res, next) {
    if (process.env.SIMULAR_LOGIN !== 'true') {
        return next();
    }

    const idUsuario = req.get('x-usuario-teste');
    if (!idUsuario) {
        return next();
    }

    try {
        // Só as colunas que existem tanto no model da main quanto no banco já migrado para o login Google
        // (o banco não tem mais senha_usuario).
        const usuario = await Usuario.findByPk(idUsuario, {
            attributes: ['id_usuario', 'tipo_usuario', 'email_usuario', 'ativo']
        });
        if (usuario) {
            req.user = usuario;
        }
        next();
    } catch (erro) {
        tratarErroSequelize(erro, res);
    }
}

function exigirLogin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ erro: 'Login necessário.' });
    }
    next();
}

function exigirPerfil(tipo) {
    return (req, res, next) => {
        if (req.user.tipo_usuario !== tipo) {
            return res.status(403).json({ erro: 'Acesso não permitido para este perfil.' });
        }
        next();
    };
}

module.exports = {
    simularUsuario,
    exigirLogin,
    exigirPerfil
};
