const { campo, erros, gerarCrud } = require('./comum');

const dadosDaConsulta = {
    id_consulta_agendada: campo('integer', 999999, 'ID de uma agenda existente. Exemplo fictício: troque pelo id real'),
    id_psicologo_responsavel: campo('integer', 999999, 'ID de um psicólogo existente. Exemplo fictício: troque pelo id real'),
    id_cliente_consultado: campo('integer', 999999, 'ID de um cliente existente. Exemplo fictício: troque pelo id real'),
    link_consulta: campo('string', 'https://meet.google.com/abc-defg-hij', 'Link do Google Meet. Único'),
    data_hora_consulta: campo('string', '2035-06-10T14:00:00', 'Não pode ser no passado', { format: 'date-time' })
};

module.exports = gerarCrud({
    tag: 'consulta',
    rota: '/consulta',
    genero: 'f',
    singular: 'consulta',
    plural: 'consultas',
    naoEncontrado: 'Consulta não encontrada!',
    mensagemRemovido: 'Consulta removida!',

    propriedades: dadosDaConsulta,
    obrigatorios: ['link_consulta', 'data_hora_consulta'],

    descricaoCriar:
        'O link precisa começar com `https://meet.google.com/`. Agenda, psicólogo e cliente informados ' +
        'precisam existir.\n\n' +
        '⚠️ O banco é compartilhado. Use dados de teste e apague depois (veja o DELETE).',
    descricaoExcluir:
        'Hoje nenhuma tabela tem chave estrangeira para `consulta`: anotações e avaliações ligadas ' +
        'a ela **não** bloqueiam a exclusão.',

    errosCriar: [
        erros.duplicado('link', 'link da consulta'),
        erros.referenciaInvalida('Agenda, psicólogo ou cliente inexistente'),
        erros.dadosInvalidos('Link que não é do Google Meet', ['link_consulta'])
    ],
    errosAlterar: [
        erros.duplicado('link', 'link da consulta'),
        erros.referenciaInvalida('Agenda, psicólogo ou cliente inexistente'),
        erros.dadosInvalidos('Link que não é do Google Meet', ['link_consulta'])
    ]
});
