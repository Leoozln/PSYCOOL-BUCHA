const { campo, erros, gerarCrud } = require('./comum');

const dadosDoCliente = {
    id_cliente: campo('integer', 999999, 'ID do usuário (tipo Cliente) criado antes em POST /usuario. Só no cadastro. Exemplo fictício: troque pelo id real'),
    convenio_cliente: campo('string', 'TESTE270', 'Precisa existir em empresa (convenio_empresa)'),
    nome_cliente: campo('string', 'Cliente Teste Alfa', 'Só letras e espaços, mínimo de 4 caracteres'),
    cpf_cliente: campo('string', '123.456.789-09', 'Formato 000.000.000-00. Único'),
    contato_cliente: campo('string', '11999990020', 'DDD + número, 11 dígitos. Único'),
    genero_cliente: campo('string', 'OUTRO', 'Gênero do cliente', {
        enum: ['MASCULINO', 'FEMININO', 'OUTRO', 'PREFIRO NÃO INFORMAR']
    }),
    data_nascimento_cliente: campo('string', '1995-05-20', 'Idade mínima de 16 anos', { format: 'date' }),
    descricao_cliente: campo('string', 'Cadastro de teste', 'Opcional')
};

// O id do cliente é o do usuário: não se altera depois de criado.
const { id_cliente, ...dadosAlteraveis } = dadosDoCliente;

module.exports = gerarCrud({
    tag: 'cliente',
    rota: '/cliente',
    nomeId: 'id_cliente',
    genero: 'm',
    singular: 'cliente',
    plural: 'clientes',
    naoEncontrado: 'Cliente não encontrado!',
    mensagemRemovido: 'Cliente removido!',

    propriedades: dadosDoCliente,
    obrigatorios: [
        'id_cliente', 'convenio_cliente', 'nome_cliente', 'cpf_cliente',
        'contato_cliente', 'genero_cliente', 'data_nascimento_cliente'
    ],
    propriedadesAlterar: dadosAlteraveis,

    descricaoCriar:
        '**Antes de cadastrar:** crie o usuário (`POST /usuario` com `tipo_usuario: "Cliente"`) e use o ' +
        '`id_usuario` retornado em `id_cliente`. O `convenio_cliente` precisa existir em uma empresa ' +
        '(`convenio_empresa`).\n\n' +
        '⚠️ O banco é compartilhado. Use dados de teste e apague depois (veja o DELETE).',
    descricaoExcluir:
        'Remove só o cliente. O **usuário** correspondente continua no banco: ' +
        'apague-o depois em `DELETE /usuario/{id}` (primeiro o cliente, depois o usuário).',

    errosCriar: [
        erros.duplicado('cpf', 'CPF'),
        erros.duplicado('telefone', 'telefone'),
        erros.referenciaInvalida('Convênio ou usuário (id_cliente) inexistente'),
        erros.dadosInvalidos('Campo obrigatório ausente', ['convenio_cliente']),
        erros.dadosInvalidos('CPF fora do formato ou menor de 16 anos (regra do banco, sem lista de campos)')
    ],
    errosAlterar: [
        erros.duplicado('cpf', 'CPF'),
        erros.duplicado('telefone', 'telefone'),
        erros.referenciaInvalida('Convênio inexistente'),
        erros.dadosInvalidos('CPF fora do formato ou menor de 16 anos (regra do banco, sem lista de campos)')
    ],
    errosExcluir: [
        erros.registroEmUso('Cliente com agendamento ou consulta ligados')
    ]
});
