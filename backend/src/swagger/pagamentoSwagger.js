const { campo, erros, gerarCrud } = require('./comum');

const dadosDoPagamento = {
    id_agenda_pagamento: campo('integer', 999999, 'ID da agenda paga. Hoje não há chave estrangeira: o banco aceita id inexistente. Exemplo fictício: troque pelo id real'),
    preco_final: campo('number', 150, 'Valor do pagamento'),
    forma_pagamento: campo('string', 'PIX', 'Forma de pagamento', {
        enum: ['DINHEIRO', 'PIX', 'CARTAO DE CREDITO', 'CARTAO DE DEBITO', 'BOLETO', 'A PRAZO']
    }),
    situacao_pagamento: campo('string', 'AGUARDANDO PAGAMENTO', 'Situação do pagamento', {
        enum: ['PAGO', 'AGUARDANDO PAGAMENTO', 'PAGO COM ATRASO', 'PAGAMENTO ATRASADO']
    })
};

module.exports = gerarCrud({
    tag: 'pagamento',
    rota: '/pagamento',
    genero: 'm',
    singular: 'pagamento',
    plural: 'pagamentos',
    naoEncontrado: 'Pagamento não encontrado!',
    mensagemRemovido: 'Pagamento removido!',

    propriedades: dadosDoPagamento,
    obrigatorios: ['preco_final', 'forma_pagamento', 'situacao_pagamento'],

    descricaoCriar:
        '⚠️ O banco é compartilhado. Use dados de teste e apague depois (veja o DELETE).\n\n' +
        'Atenção: `pagamento` não tem chave estrangeira com `agenda`, então `referencia_invalida` ' +
        'não acontece aqui.',

    errosCriar: [
        erros.dadosInvalidos('Forma ou situação de pagamento fora da lista', ['forma_pagamento'])
    ],
    errosAlterar: [
        erros.dadosInvalidos('Forma ou situação de pagamento fora da lista', ['forma_pagamento'])
    ]
});
