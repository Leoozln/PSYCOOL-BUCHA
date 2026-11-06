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

module.exports = crud;
