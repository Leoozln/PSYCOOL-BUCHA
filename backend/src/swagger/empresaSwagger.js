const { campo, erros, gerarCrud } = require('./comum');

const dadosDaEmpresa = {
    id_empresa: campo('integer', 999999, 'ID do usuário (tipo Empresa) criado antes em POST /usuario. Só no cadastro. Exemplo fictício: troque pelo id real'),
    nome_empresa: campo('string', 'Empresa Teste Alfa', 'Letras, números de 1 a 9, espaço, ponto e hífen (mínimo de 3)'),
    cnpj_empresa: campo('string', '12345678000199', '14 dígitos, sem pontuação. Único'),
    contato_empresa: campo('string', '11999990010', 'DDD + número, 11 dígitos. Único'),
    convenio_empresa: campo('string', 'TESTE270', 'De 3 a 10 caracteres (letras, números e hífen). Único'),
    nome_fantasia: campo('string', 'Alfa Teste', 'Opcional'),
    cep_empresa: campo('string', '89000-000', 'Formato 00000-000'),
    logo_empresa: campo('string', 'https://exemplo.teste/logo.png', 'Opcional'),
    descricao_empresa: campo('string', 'Cadastro de teste', 'Opcional')
};

// O id da empresa é o do usuário: não se altera depois de criada.
const { id_empresa, ...dadosAlteraveis } = dadosDaEmpresa;

module.exports = gerarCrud({
    tag: 'empresa',
    rota: '/empresa',
    genero: 'f',
    singular: 'empresa',
    plural: 'empresas',
    naoEncontrado: 'Empresa não encontrada!',
    mensagemRemovido: 'Empresa removida!',

    propriedades: dadosDaEmpresa,
    obrigatorios: [
        'id_empresa', 'nome_empresa', 'cnpj_empresa', 'contato_empresa', 'convenio_empresa', 'cep_empresa'
    ],
    propriedadesAlterar: dadosAlteraveis,

    descricaoCriar:
        '**Antes de cadastrar:** crie o usuário (`POST /usuario` com `tipo_usuario: "Empresa"`) e use o ' +
        '`id_usuario` retornado em `id_empresa`.\n\n' +
        '⚠️ O banco é compartilhado. Use dados de teste e apague depois (veja o DELETE).',
    descricaoExcluir:
        'Remove só a empresa. O **usuário** correspondente continua no banco: ' +
        'apague-o depois em `DELETE /usuario/{id}` (primeiro a empresa, depois o usuário).',

    errosCriar: [
        erros.duplicado('cnpj', 'CNPJ'),
        erros.duplicado('convenio', 'convênio'),
        erros.duplicado('telefone', 'telefone'),
        erros.referenciaInvalida('Usuário (id_empresa) inexistente'),
        erros.dadosInvalidos('CNPJ, CEP, telefone ou convênio fora do formato (regra do banco, sem lista de campos)')
    ],
    errosAlterar: [
        erros.duplicado('cnpj', 'CNPJ'),
        erros.duplicado('convenio', 'convênio'),
        erros.duplicado('telefone', 'telefone'),
        erros.dadosInvalidos('CNPJ, CEP, telefone ou convênio fora do formato (regra do banco, sem lista de campos)')
    ],
    errosExcluir: [
        erros.registroEmUso('Empresa com clientes vinculados pelo convênio')
    ]
});
