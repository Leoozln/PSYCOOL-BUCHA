const { Psicologo } = require('../1models');

function exigirLogin(req, res, next) {
    if (!req.isAuthenticated()) {
        console.error(`[ACESSO NEGADO - 401] Rota: ${req.originalUrl} | IP: ${req.ip}`);
        return res.status(401).json({ erro: 'Faça login para acessar este recurso.' });
    }
    next();
}

function exigirPerfil(...perfis) {
    return (req, res, next) => {
        const usuario = req.user;
        
        if (!perfis.includes(usuario.tipo_usuario)) {
            console.error(`[ACESSO NEGADO - 403] Usuário: ${usuario.email_usuario} | Perfil: ${usuario.tipo_usuario} | Rota: ${req.originalUrl}`);
            return res.status(403).json({ erro: 'Você não tem permissão para acessar este recurso.' });
        }
        next();
    };
}

async function exigirPsicologoAprovado(req, res, next) {
    const usuario = req.user;

    if (usuario.tipo_usuario !== 'Psicologo') {
        return res.status(403).json({ erro: 'Acesso restrito a psicólogos.' });
    }

    try {
        const psicologo = await Psicologo.findByPk(usuario.id_usuario);
        
        if (!psicologo || psicologo.status_validacao !== 'APROVADO') {
            console.error(`[ACESSO NEGADO - 403] Psicólogo não aprovado. ID: ${usuario.id_usuario} | Rota: ${req.originalUrl}`);
            return res.status(403).json({ 
                erro: 'Seu cadastro ainda não foi aprovado. Acesso restrito até a aprovação.',
                status: psicologo ? psicologo.status_validacao : 'PENDENTE'
            });
        }
        next();
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao verificar status do psicólogo.' });
    }
}

module.exports = { exigirLogin, exigirPerfil, exigirPsicologoAprovado };