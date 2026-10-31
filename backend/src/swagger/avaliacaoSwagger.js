const { campo, lista, erros, gerarCrud } = require('./comum');

const dadosDaAvaliacao = {
    avaliacao_psicologo: campo('integer', 999999, 'ID de um psicólogo existente. Exemplo fictício: troque pelo id real. Atenção: a avaliação muda a média do psicólogo'),
    estrela_avaliacao: campo('string', '5', 'Nota de 0 a 5, enviada como texto', {
        enum: ['0', '1', '2', '3', '4', '5']
    }),
    texto_avaliacao: lista(['Ótimo atendimento'], 'Lista de textos da avaliação'),
    avaliacao_consulta: campo('integer', 999999, 'ID da consulta avaliada. Hoje não há chave estrangeira: o banco aceita id inexistente. Exemplo fictício: troque pelo id real')
};

module.exports = gerarCrud({
    tag: 'avaliacao',
    rota: '/avaliacao',
    genero: 'f',
    singular: 'avaliação',
    plural: 'avaliações',
    naoEncontrado: 'Avaliação não encontrada!',
    mensagemRemovido: 'Avaliação removida!',

    propriedades: dadosDaAvaliacao,
    obrigatorios: ['avaliacao_psicologo', 'estrela_avaliacao', 'texto_avaliacao'],

    descricaoCriar:
        'O psicólogo precisa existir. A ligação com a consulta (`avaliacao_consulta`) não tem chave ' +
        'estrangeira, então um id inexistente é aceito.\n\n' +
        '⚠️ O banco é compartilhado. Use dados de teste e apague depois (veja o DELETE).',

    errosCriar: [
        erros.referenciaInvalida('Psicólogo inexistente'),
        erros.dadosInvalidos('Nota fora de 0 a 5', ['estrela_avaliacao'])
    ],
    errosAlterar: [
        erros.referenciaInvalida('Psicólogo inexistente'),
        erros.dadosInvalidos('Nota fora de 0 a 5', ['estrela_avaliacao'])
    ]
});
