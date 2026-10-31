// Traduz erros do Sequelize/PostgreSQL em respostas HTTP padronizadas: { erro, mensagem }.
// Usado por todos os controllers, para o formato de erro da API ficar igual em todas as rotas.

// Campos únicos conhecidos: nome da coluna -> código curto e nome amigável para a mensagem.
// Campo que não estiver aqui cai na resposta genérica de dado duplicado.
const CAMPOS_UNICOS = {
    crp_psicologo: { codigo: 'crp', rotulo: 'CRP' },
    email_usuario: { codigo: 'email', rotulo: 'e-mail' },
    contato_psicologo: { codigo: 'telefone', rotulo: 'telefone' },
    contato_cliente: { codigo: 'telefone', rotulo: 'telefone' },
    contato_empresa: { codigo: 'telefone', rotulo: 'telefone' },
    cpf_cliente: { codigo: 'cpf', rotulo: 'CPF' },
    cnpj_empresa: { codigo: 'cnpj', rotulo: 'CNPJ' },
    convenio_empresa: { codigo: 'convenio', rotulo: 'convênio' },
    link_consulta: { codigo: 'link', rotulo: 'link da consulta' }
};

// Códigos de erro do PostgreSQL que significam "dado enviado fora do aceito".
// 23502 campo obrigatório vazio, 23514 restrição CHECK, 22001 texto longo demais, 22P02 formato inválido,
// 22003 número fora da faixa do campo (confirmado em teste com preço gigante na agenda).
const CODIGOS_DADO_INVALIDO = ['23502', '23514', '22001', '22P02', '22003'];

// A trigger verificacao_conflito_agenda (banco) lança RAISE EXCEPTION (código P0001) quando o psicólogo
// já tem consulta no horário. Só esta mensagem conhecida é traduzida; outras exceções do banco ficam como 500.
const CODIGO_EXCECAO_BANCO = 'P0001';
const MENSAGEM_CONFLITO_AGENDA = 'Conflito de agenda';

// Registra o erro completo no console (a resposta ao cliente é resumida de propósito).
function registrarErro(erro) {
    console.error({
        nome: erro.name,
        mensagem: erro.message,
        codigoBanco: erro.parent ? erro.parent.code : undefined,
        restricao: erro.parent ? erro.parent.constraint : undefined,
        detalhes: erro.errors ? erro.errors.map(e => ({ campo: e.path, mensagem: e.message })) : undefined
    });
}

function tratarErroSequelize(erro, res) {
    registrarErro(erro);

    // Dado duplicado (CRP, e-mail, CPF...). Precisa vir antes do ValidationError,
    // porque o UniqueConstraintError é um tipo de ValidationError.
    if (erro.name === 'SequelizeUniqueConstraintError') {
        const campo = (erro.errors && erro.errors[0] && erro.errors[0].path) || Object.keys(erro.fields || {})[0];
        const conhecido = CAMPOS_UNICOS[campo];
        return res.status(409).json({
            erro: `${conhecido ? conhecido.codigo : campo || 'registro'}_duplicado`,
            mensagem: conhecido ? `Este ${conhecido.rotulo} já está cadastrado.` : 'Já existe um registro com estes dados.'
        });
    }

    // Chave estrangeira: o registro referenciado não existe (inserção) ou ainda é usado (exclusão).
    if (erro.name === 'SequelizeForeignKeyConstraintError') {
        const detalhe = (erro.parent && erro.parent.detail) || '';
        if (detalhe.includes('is still referenced')) {
            return res.status(409).json({
                erro: 'registro_em_uso',
                mensagem: 'Este registro está vinculado a outros dados e não pode ser removido.'
            });
        }
        return res.status(400).json({
            erro: 'referencia_invalida',
            mensagem: 'O registro relacionado informado não existe.'
        });
    }

    // Validação feita pelo Sequelize (is, isIn, allowNull...). Devolve só os nomes dos campos.
    if (erro.name === 'SequelizeValidationError') {
        return res.status(400).json({
            erro: 'dados_invalidos',
            mensagem: 'Dados inválidos.',
            campos: (erro.errors || []).map(e => e.path).filter(Boolean)
        });
    }

    // Conflito de horário na agenda, barrado pela trigger do banco. Precisa vir antes do bloco abaixo
    // só por clareza: o código P0001 não está em CODIGOS_DADO_INVALIDO.
    if (
        erro.name === 'SequelizeDatabaseError' &&
        erro.parent &&
        erro.parent.code === CODIGO_EXCECAO_BANCO &&
        String(erro.parent.message || '').startsWith(MENSAGEM_CONFLITO_AGENDA)
    ) {
        return res.status(409).json({
            erro: 'agenda_conflito',
            mensagem: 'O psicólogo já tem uma consulta neste horário.'
        });
    }

    // Restrição do próprio banco (CHECK, NOT NULL, formato). Chega como SequelizeDatabaseError.
    if (erro.name === 'SequelizeDatabaseError' && erro.parent && CODIGOS_DADO_INVALIDO.includes(erro.parent.code)) {
        return res.status(400).json({
            erro: 'dados_invalidos',
            mensagem: 'Dados inválidos.'
        });
    }

    return res.status(500).json({
        erro: 'erro_interno',
        mensagem: 'Erro interno do servidor.'
    });
}

module.exports = tratarErroSequelize;
