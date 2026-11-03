const usuarioSwagger = require('./usuarioSwagger');
const psicologoSwagger = require('./psicologoSwagger');
const clienteSwagger = require('./clienteSwagger');
const empresaSwagger = require('./empresaSwagger');
const agendaSwagger = require('./agendaSwagger');
const consultaSwagger = require('./consultaSwagger');
const pagamentoSwagger = require('./pagamentoSwagger');
const avaliacaoSwagger = require('./avaliacaoSwagger');
const anotacaoSwagger = require('./anotacaoSwagger');

const swaggerSpec = {
    openapi: '3.0.0',

    info: {
        title: 'API - Sistema',
        version: '1.0.0',
        description:
            'Documentação da API do sistema.\n\n' +
            '⚠️ **O banco é o Supabase compartilhado pelo grupo.** Ao testar, use dados inventados e apague ' +
            'o que criar. Para apagar, primeiro as tabelas filhas (psicólogo, cliente, empresa, agenda...) ' +
            'e por último o usuário.\n\n' +
            '**Formato dos erros:** erros de duplicidade, validação e chave estrangeira vêm como ' +
            '`{ "erro": "codigo", "mensagem": "texto para o usuário" }`. Os 404 e alguns 400 escritos dentro ' +
            'dos controllers ainda usam o formato antigo, só com `erro` (sem `mensagem`).'
    },

    servers: [
        {
            url: 'http://localhost:3000'
        }
    ],

    tags: [
        { name: 'usuario' },
        { name: 'psicologo' },
        { name: 'cliente' },
        { name: 'empresa' },
        { name: 'agenda' },
        { name: 'consulta' },
        { name: 'pagamento' },
        { name: 'avaliacao' },
        { name: 'anotacao' }
    ],

    paths: {
        ...usuarioSwagger.paths,
        ...psicologoSwagger.paths,
        ...clienteSwagger.paths,
        ...empresaSwagger.paths,
        ...agendaSwagger.paths,
        ...consultaSwagger.paths,
        ...pagamentoSwagger.paths,
        ...avaliacaoSwagger.paths,
        ...anotacaoSwagger.paths
    },

    components: {
        schemas: {
            ErroPadrao: {
                type: 'object',
                properties: {
                    erro: {
                        type: 'string',
                        description: 'Código do erro',
                        example: 'crp_duplicado'
                    },
                    mensagem: {
                        type: 'string',
                        description: 'Texto pronto para mostrar ao usuário',
                        example: 'Este CRP já está cadastrado.'
                    },
                    campos: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Campos com problema (só em erros de validação do model)',
                        example: ['crp_psicologo']
                    }
                }
            }
        }
    }
};

module.exports = swaggerSpec;
