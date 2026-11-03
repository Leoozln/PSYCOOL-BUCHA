// Pedaços reutilizados pelos arquivos de documentação do Swagger (um arquivo por entidade).
// Os erros documentados aqui são os que backend/src/utils/tratarErroSequelize.js devolve:
// { "erro": "codigo", "mensagem": "texto para o usuário" }.

const ERRO_PADRAO = { $ref: '#/components/schemas/ErroPadrao' };

// Atalhos para descrever um campo do corpo da requisição.
const campo = (type, example, description, extra = {}) => ({ type, example, description, ...extra });
const lista = (example, description) => campo('array', example, description, { items: { type: 'string' } });

// Cada erro vira um exemplo na resposta do status correspondente.
const erros = {
    dadosInvalidos(resumo, campos) {
        const corpo = { erro: 'dados_invalidos', mensagem: 'Dados inválidos.' };
        if (campos) corpo.campos = campos;
        return { status: 400, resumo, corpo };
    },

    referenciaInvalida(resumo) {
        return {
            status: 400,
            resumo,
            corpo: { erro: 'referencia_invalida', mensagem: 'O registro relacionado informado não existe.' }
        };
    },

    duplicado(codigo, rotulo) {
        return {
            status: 409,
            resumo: `${rotulo} repetido`,
            corpo: { erro: `${codigo}_duplicado`, mensagem: `Este ${rotulo} já está cadastrado.` }
        };
    },

    registroEmUso(resumo) {
        return {
            status: 409,
            resumo,
            corpo: {
                erro: 'registro_em_uso',
                mensagem: 'Este registro está vinculado a outros dados e não pode ser removido.'
            }
        };
    },

    agendaConflito() {
        return {
            status: 409,
            resumo: 'O psicólogo já tem consulta nesse horário',
            corpo: { erro: 'agenda_conflito', mensagem: 'O psicólogo já tem uma consulta neste horário.' }
        };
    },

    erroInterno() {
        return {
            status: 500,
            resumo: 'Qualquer outro erro inesperado',
            corpo: { erro: 'erro_interno', mensagem: 'Erro interno do servidor.' }
        };
    }
};

const DESCRICAO_STATUS = {
    400: 'Dados inválidos ou registro relacionado inexistente',
    409: 'Dado duplicado, registro em uso ou conflito',
    500: 'Erro interno do servidor'
};

// Agrupa os erros por status e monta as respostas do Swagger. O 500 entra sempre.
function respostasDeErro(listaErros) {
    const respostas = {};

    for (const item of [...listaErros, erros.erroInterno()]) {
        if (!respostas[item.status]) {
            respostas[item.status] = {
                description: DESCRICAO_STATUS[item.status] || 'Erro',
                content: { 'application/json': { schema: ERRO_PADRAO, examples: {} } }
            };
        }

        const exemplos = respostas[item.status].content['application/json'].examples;
        let chave = item.corpo.erro;
        let n = 2;
        while (exemplos[chave]) {
            chave = `${item.corpo.erro}_${n}`;
            n += 1;
        }
        exemplos[chave] = { summary: item.resumo, value: item.corpo };
    }

    return respostas;
}

// Os 404 escritos dentro dos controllers ainda usam o formato antigo: só "erro", sem "mensagem".
function resposta404(texto) {
    return {
        description: 'Não encontrado (formato antigo: só "erro", sem "mensagem")',
        content: {
            'application/json': {
                schema: { type: 'object', properties: { erro: { type: 'string' } } },
                example: { erro: texto }
            }
        }
    };
}

function corpoJson(schema) {
    return { required: true, content: { 'application/json': { schema } } };
}

// Gera as 5 operações padrão (listar, cadastrar, buscar, alterar, excluir) de uma entidade.
//   tag, rota, nomeId, genero ('m' | 'f'), singular, plural
//   naoEncontrado, mensagemRemovido (textos dos controllers)
//   propriedades, obrigatorios, propriedadesAlterar (corpo do POST e do PUT)
//   descricaoCriar, descricaoExcluir (avisos opcionais)
//   errosCriar, errosAlterar, errosExcluir (listas de erros.*)
function gerarCrud(c) {
    const art = c.genero === 'f' ? { um: 'uma', o: 'a', os: 'as' } : { um: 'um', o: 'o', os: 'os' };
    const nomeId = c.nomeId || 'id';
    const rotaId = `${c.rota}/{${nomeId}}`;

    const parametros = [{
        name: nomeId,
        in: 'path',
        required: true,
        schema: { type: 'integer' },
        description: `ID d${art.o} ${c.singular}`
    }];

    // Id que não é número (ex.: abc) vira dados_invalidos em qualquer rota com id.
    const idInvalido = erros.dadosInvalidos('Id em formato inválido (ex.: abc)');

    const schemaCriar = { type: 'object', properties: c.propriedades };
    if (c.obrigatorios && c.obrigatorios.length) schemaCriar.required = c.obrigatorios;

    const schemaAlterar = { type: 'object', properties: c.propriedadesAlterar || c.propriedades };

    return {
        paths: {
            [c.rota]: {
                get: {
                    tags: [c.tag],
                    summary: `Lista ${art.os} ${c.plural}`,
                    responses: {
                        200: { description: 'Lista retornada com sucesso' },
                        ...respostasDeErro([])
                    }
                },

                post: {
                    tags: [c.tag],
                    summary: `Cadastra ${art.um} ${c.singular}`,
                    ...(c.descricaoCriar ? { description: c.descricaoCriar } : {}),
                    requestBody: corpoJson(schemaCriar),
                    responses: {
                        201: { description: 'Cadastrado com sucesso' },
                        ...respostasDeErro(c.errosCriar || [])
                    }
                }
            },

            [rotaId]: {
                get: {
                    tags: [c.tag],
                    summary: `Busca ${art.um} ${c.singular} pelo ID`,
                    parameters: parametros,
                    responses: {
                        200: { description: 'Registro encontrado' },
                        404: resposta404(c.naoEncontrado),
                        ...respostasDeErro([idInvalido])
                    }
                },

                put: {
                    tags: [c.tag],
                    summary: `Altera ${art.um} ${c.singular}`,
                    description: 'Envie só os campos que quer alterar: os demais continuam como estão.',
                    parameters: parametros,
                    requestBody: corpoJson(schemaAlterar),
                    responses: {
                        200: { description: 'Alterado com sucesso' },
                        404: resposta404(c.naoEncontrado),
                        ...respostasDeErro([idInvalido, ...(c.errosAlterar || [])])
                    }
                },

                delete: {
                    tags: [c.tag],
                    summary: `Exclui ${art.um} ${c.singular}`,
                    ...(c.descricaoExcluir ? { description: c.descricaoExcluir } : {}),
                    parameters: parametros,
                    responses: {
                        200: {
                            description: 'Excluído com sucesso',
                            content: {
                                'application/json': {
                                    schema: { type: 'object', properties: { mensagem: { type: 'string' } } },
                                    example: { mensagem: c.mensagemRemovido }
                                }
                            }
                        },
                        404: resposta404(c.naoEncontrado),
                        ...respostasDeErro([idInvalido, ...(c.errosExcluir || [])])
                    }
                }
            }
        }
    };
}

module.exports = { campo, lista, erros, gerarCrud };
