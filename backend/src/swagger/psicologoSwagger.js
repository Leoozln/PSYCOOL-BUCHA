const { campo, lista, erros, gerarCrud, respostasDeErro, resposta401, resposta403 } = require('./comum');

const dadosDoPsicologo = {
    nome_psicologo: campo('string', 'Teste Automatizado Alfa', 'Só letras e espaços, mínimo de 4 caracteres'),
    crp_psicologo: campo('string', '99/99991', 'Formato 00/00000 ou 00/000000. Único'),
    cpf_psicologo: campo('string', '987.654.321-00', 'Formato 000.000.000-00. Único. Obrigatório: não aceita nulo nem vazio'),
    contato_psicologo: campo('string', '11999990001', 'DDD + número, 11 dígitos. Único'),
    diploma_psicologo: lista(['Psicologia - Universidade Teste'], 'Opcional'),
    genero_psicologo: campo('string', 'OUTRO', 'Gênero do psicólogo', {
        enum: ['MASCULINO', 'FEMININO', 'OUTRO', 'PREFIRO NÃO INFORMAR']
    }),
    data_nascimento_psicologo: campo('string', '1990-01-15', 'Idade mínima de 21 anos', { format: 'date' }),
    especialidade_psicologo: lista(['Teste'], 'Pelo menos uma especialidade'),
    foto_psicologo: campo('string', 'https://exemplo.teste/foto.png', 'Opcional'),
    descricao_psicologo: campo('string', 'Cadastro de teste', 'Opcional'),
    abordagem_psicologo: campo('string', 'TCC', 'Opcional. Abordagem exibida no perfil e na busca. Até 100 caracteres')
};

// Só o POST cria o usuário junto; o PUT altera apenas os dados do psicólogo.
const propriedadesCadastro = {
    ...dadosDoPsicologo,
    email_usuario: campo('string', 'teste.scrum270.psicologo@exemplo.teste', 'E-mail do usuário. Único'),
    senha_usuario: campo('string', 'SenhaTeste#270', 'Senha em texto puro: o banco aplica o hash')
};

const crud = gerarCrud({
    tag: 'psicologo',
    rota: '/psicologo',
    genero: 'm',
    singular: 'psicólogo',
    plural: 'psicólogos',
    naoEncontrado: 'Psicólogo não encontrado!',
    mensagemRemovido: 'Psicólogo removido!',

    propriedades: propriedadesCadastro,
    obrigatorios: [
        'nome_psicologo', 'crp_psicologo', 'cpf_psicologo', 'contato_psicologo', 'genero_psicologo',
        'data_nascimento_psicologo', 'especialidade_psicologo', 'email_usuario', 'senha_usuario'
    ],
    propriedadesAlterar: dadosDoPsicologo,

    descricaoCriar:
        'Cria o **usuário** e o **psicólogo** juntos, na mesma transação: se um falhar, nenhum é gravado.\n\n' +
        '⚠️ O banco é compartilhado. Use dados de teste e apague depois (veja o DELETE).',
    descricaoExcluir:
        'Remove só o psicólogo. O **usuário** correspondente continua no banco: ' +
        'apague-o depois em `DELETE /usuario/{id}` (primeiro o psicólogo, depois o usuário).',

    errosCriar: [
        erros.duplicado('crp', 'CRP'),
        erros.duplicado('cpf', 'CPF'),
        erros.duplicado('email', 'e-mail'),
        erros.duplicado('telefone', 'telefone'),
        erros.dadosInvalidos('CRP fora do formato', ['crp_psicologo']),
        erros.dadosInvalidos('CPF ausente, nulo ou fora do formato 000.000.000-00', ['cpf_psicologo']),
        erros.dadosInvalidos('Campo obrigatório ausente', ['nome_psicologo']),
        {
            status: 400,
            resumo: 'E-mail ou senha ausente (formato antigo, sem "mensagem")',
            corpo: { erro: 'Email e senha do usuário são obrigatórios!' }
        }
    ],
    errosAlterar: [
        erros.duplicado('crp', 'CRP'),
        erros.duplicado('cpf', 'CPF'),
        erros.duplicado('telefone', 'telefone'),
        erros.dadosInvalidos('CRP fora do formato', ['crp_psicologo']),
        erros.dadosInvalidos('CPF nulo ou fora do formato 000.000.000-00', ['cpf_psicologo'])
    ],
    errosExcluir: [
        erros.registroEmUso('Psicólogo com agenda, consulta ou avaliação ligadas')
    ]
});

const itemMinhaConsulta = {
    type: 'object',
    properties: {
        id_consulta: campo('integer', 12, 'ID da consulta'),
        data_hora: campo('string', '2026-11-10T14:00:00.000Z', 'Data e hora da consulta (consulta.data_hora_consulta)', { format: 'date-time' }),
        nome_paciente: campo('string', 'Paciente Teste', 'Nome do paciente (cliente.nome_cliente)'),
        status: campo('string', 'AGENDADO', 'Status da agenda. Por enquanto só vêm consultas AGENDADO'),
        link: campo('string', 'https://meet.google.com/abc-defg-hij', 'Link da sala (consulta.link_consulta)')
    }
};

crud.paths['/psicologo/me/consultas'] = {
    get: {
        tags: ['psicologo'],
        summary: 'Lista as próximas consultas do psicólogo logado',
        description:
            'Devolve as consultas futuras (data e hora a partir de agora) do psicólogo logado, ' +
            'só as que têm agenda **AGENDADO**, da mais próxima para a mais distante.\n\n' +
            'Exige login com perfil **Psicologo**.\n\n' +
            '⚠️ **TEMPORÁRIO (até a SCRUM-192):** enquanto o login não estiver na main, ligue ' +
            '`SIMULAR_LOGIN=true` no `.env` e informe o id do usuário no header `x-usuario-teste`.',
        parameters: [{
            name: 'x-usuario-teste',
            in: 'header',
            required: false,
            schema: { type: 'integer' },
            description: 'TEMPORÁRIO: id_usuario a simular como logado. Só funciona com SIMULAR_LOGIN=true no .env'
        }],
        responses: {
            200: {
                description: 'Lista retornada com sucesso (pode vir vazia)',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: itemMinhaConsulta }
                    }
                }
            },
            401: resposta401(),
            403: resposta403(),
            ...respostasDeErro([])
        }
    }
};

// Cadastro com login pelo Google: sem senha, e-mail e google_id vêm da sessão (não do corpo) e sem foto.
const { foto_psicologo, ...dadosDoCadastro } = dadosDoPsicologo;

const propriedadesCadastroGoogle = {
    ...dadosDoCadastro,
    aceite_termo: campo(
        'boolean',
        true,
        'Booleano `true` (sem aspas). A string "true", o número 1 e qualquer outro valor são recusados com 400 `termo_nao_aceito`'
    )
};

crud.paths['/cadastro/psicologo'] = {
    post: {
        tags: ['cadastro'],
        summary: 'Cadastra o psicólogo logado com o Google',
        description:
            'Cria o **usuário** (tipo Psicologo) e o **psicólogo** juntos, na mesma transação, com `status_validacao: PENDENTE` ' +
            '(aguarda a aprovação do administrador).\n\n' +
            'Exige o login com o Google antes: abra `http://localhost:3000/auth/google` com uma conta que ainda não está no banco. ' +
            'O **e-mail** e o **google_id** vêm da sessão, nunca do corpo. O cookie da sessão vai sozinho porque o Swagger roda ' +
            'na mesma porta da API (o Thunder Client não envia o cookie do navegador).\n\n' +
            '`aceite_termo` precisa ser o **booleano `true`**, sem aspas: a string `"true"` também é recusada (400). ' +
            'O aceite só é validado, não é gravado em tabela.\n\n' +
            'No sucesso a sessão é encerrada (logout): o próximo login com o Google já encontra o psicólogo no banco. ' +
            'Se der erro (400, 409), a sessão continua com o cadastro pendente e dá para tentar de novo.\n\n' +
            '⚠️ O banco é compartilhado. Use dados de teste e apague depois: `DELETE /psicologo/{id}` e depois `DELETE /usuario/{id}`.',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: propriedadesCadastroGoogle,
                        required: [
                            'nome_psicologo', 'crp_psicologo', 'cpf_psicologo', 'contato_psicologo', 'genero_psicologo',
                            'data_nascimento_psicologo', 'especialidade_psicologo', 'aceite_termo'
                        ]
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Psicólogo cadastrado com status PENDENTE. A sessão do Google é encerrada.',
                content: {
                    'application/json': {
                        example: {
                            id_psicologo: 25,
                            nome_psicologo: 'Teste Automatizado Alfa',
                            crp_psicologo: '99/99991',
                            status_validacao: 'PENDENTE',
                            usuario: { email_usuario: 'seu.email@gmail.com' }
                        }
                    }
                }
            },
            ...respostasDeErro([
                erros.termoNaoAceito(),
                erros.dadosInvalidos('Campo fora do formato (CRP, CPF, telefone, idade...)', ['crp_psicologo']),
                erros.loginGoogleNecessario(),
                erros.duplicado('crp', 'CRP'),
                erros.duplicado('cpf', 'CPF'),
                erros.duplicado('telefone', 'telefone'),
                erros.duplicado('email', 'e-mail')
            ])
        }
    }
};

module.exports = crud;
