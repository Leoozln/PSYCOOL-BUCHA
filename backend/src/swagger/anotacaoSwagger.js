const { campo, lista, gerarCrud } = require('./comum');

const dadosDaAnotacao = {
    id_consulta_anotacao: campo('integer', 999999, 'ID da consulta. Hoje não há chave estrangeira: o banco aceita id inexistente. Exemplo fictício: troque pelo id real'),
    anotacao_cliente: lista(['Texto de teste'], 'Anotações do cliente'),
    anotacao_psicologo: lista(['Texto de teste'], 'Anotações do psicólogo')
};

module.exports = gerarCrud({
    tag: 'anotacao',
    rota: '/anotacao',
    genero: 'f',
    singular: 'anotação',
    plural: 'anotações',
    naoEncontrado: 'Anotação não encontrada!',
    mensagemRemovido: 'Anotação removida!',

    propriedades: dadosDaAnotacao,

    descricaoCriar:
        'Anotações são **dado de saúde** (dado pessoal sensível na LGPD): nos testes use só texto ' +
        'inventado, nunca conteúdo real.\n\n' +
        '⚠️ O banco é compartilhado. Apague o que criar (veja o DELETE).'
});
