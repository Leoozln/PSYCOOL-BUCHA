const usuarioSwagger = {
    paths: {

        // LISTAR CARGOS
        '/cargos': {
            get: {
                tags: ['Cargos'],
                summary: 'Lista todos os cargos',

                responses: {
                    200: {
                        description: 'Lista de cargos retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // INSERIR CARGO
            post: {
                tags: ['Cargos'],
                summary: 'Cadastra um novo cargo',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    car_nome: {
                                        type: 'string',
                                        example: 'Desenvolvedor'
                                    }
                                },

                                required: ['car_nome']
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Cargo cadastrado com sucesso'
                    },

                    400: {
                        description: 'Dados inválidos'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        // BUSCAR CARGO POR ID
        '/cargos/{id}': {

            get: {
                tags: ['Cargos'],
                summary: 'Busca um cargo pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do cargo'
                    }
                ],

                responses: {
                    200: {
                        description: 'Cargo encontrado'
                    },

                    404: {
                        description: 'Cargo não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // ALTERAR CARGO
            put: {
                tags: ['Cargos'],
                summary: 'Altera um cargo',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do cargo'
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    car_nome: {
                                        type: 'string',
                                        example: 'Desenvolvedor Backend'
                                    }
                                },

                                required: ['car_nome']
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Cargo alterado com sucesso'
                    },

                    404: {
                        description: 'Cargo não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // EXCLUIR CARGO
            delete: {
                tags: ['Cargos'],
                summary: 'Exclui um cargo',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do cargo'
                    }
                ],

                responses: {
                    200: {
                        description: 'Cargo excluído com sucesso'
                    },

                    404: {
                        description: 'Cargo não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        }
    }
};

module.exports = usuarioSwagger;
