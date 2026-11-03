const { campo, erros, gerarCrud } = require('./comum');

const dadosDaAgenda = {
    id_cliente: campo('integer', 999999, 'ID de um cliente existente. Exemplo fictício: troque pelo id real'),
    id_psicologo: campo('integer', 999999, 'ID de um psicólogo existente. Exemplo fictício: troque pelo id real'),
    datahora_agenda: campo('string', '2035-06-10T14:00:00', 'Não pode ser no passado', { format: 'date-time' }),
    status_agenda: campo('string', 'AGENDADO', 'Status do agendamento', {
        enum: ['AGENDADO', 'EM_ANALISE', 'CANCELADO', 'REALIZADO']
    }),
    preco_base: campo('number', 150, 'Maior ou igual a zero'),
    desconto_convenio: campo('number', 0, 'Entre zero e o preço base. Se omitido, vale zero'),
    preco_final: campo('number', 150, 'Obrigatório no corpo, mas o banco sempre recalcula como preco_base - desconto_convenio (o valor enviado é ignorado)')
};

module.exports = gerarCrud({
    tag: 'agenda',
    rota: '/agenda',
    genero: 'f',
    singular: 'agenda',
    plural: 'agendas',
    naoEncontrado: 'Agenda não encontrada!',
    mensagemRemovido: 'Agenda removida com sucesso!',

    propriedades: dadosDaAgenda,
    obrigatorios: [
        'id_cliente', 'id_psicologo', 'datahora_agenda', 'status_agenda', 'preco_base', 'preco_final'
    ],

    descricaoCriar:
        'Precisa de um cliente e um psicólogo que já existam. Um psicólogo não pode ter dois ' +
        'agendamentos no mesmo horário (trigger do banco).\n\n' +
        '⚠️ O banco é compartilhado. Use dados de teste e apague depois (veja o DELETE).',
    descricaoExcluir:
        'Bloqueado se houver **consulta** ligada ao agendamento. ' +
        'Hoje o pagamento não tem chave estrangeira com a agenda, então não bloqueia a exclusão.',

    errosCriar: [
        erros.agendaConflito(),
        erros.referenciaInvalida('Cliente ou psicólogo inexistente'),
        erros.dadosInvalidos('Status fora da lista', ['status_agenda']),
        erros.dadosInvalidos('Data no passado ou preço fora da regra (regra do banco, sem lista de campos)')
    ],
    errosAlterar: [
        erros.agendaConflito(),
        erros.referenciaInvalida('Cliente ou psicólogo inexistente'),
        erros.dadosInvalidos('Status fora da lista', ['status_agenda']),
        erros.dadosInvalidos('Data no passado ou preço fora da regra (regra do banco, sem lista de campos)')
    ],
    errosExcluir: [
        erros.registroEmUso('Agenda com consulta ligada')
    ]
});
