const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const psicologo = sequelize.define('psicologo', {

    id_psicologo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        references: {
            model: 'usuario',
            key: 'id_usuario'
        }
    },

    nome_psicologo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            is: /^[A-Za-zÀ-ú ][A-Za-zÀ-ú ]{3,255}$/
        }
    },

    crp_psicologo: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[0-9]{2}\/[0-9]{5,6}$/
        }
    },

    // Obrigatório no model e no banco: a coluna é NOT NULL, com CHECK de formato e UNIQUE.
    cpf_psicologo: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/
        }
    },

    contato_psicologo: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[1-9]{2}[0-9]{9}$/
        }
    },

    diploma_psicologo: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: []
    },

    genero_psicologo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['MASCULINO', 'FEMININO', 'OUTRO', 'PREFIRO NÃO INFORMAR']]
        }
    },

    data_nascimento_psicologo: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isOldEnough(value) {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    if (age - 1 < 21) {
                        throw new Error('Psicólogo deve ter no mínimo 21 anos');
                    }
                } else {
                    if (age < 21) {
                        throw new Error('Psicólogo deve ter no mínimo 21 anos');
                    }
                }
            }
        }
    },

    especialidade_psicologo: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        validate: {
            notEmpty(value) {
                if (!value || value.length < 1) {
                    throw new Error('É necessário informar ao menos uma especialidade.');
                }
            }
        }
    },

    foto_psicologo: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

    descricao_psicologo: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    abordagem_psicologo: {
        type: DataTypes.STRING(100),
        allowNull: true
    },

    status_validacao: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'PENDENTE',
        validate: {
            isIn: [['PENDENTE', 'APROVADO', 'REPROVADO']]
        }
    },

    // Motivo mostrado ao psicólogo quando o administrador reprova o cadastro (RF026).
    motivo_reprovacao: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    // Preenchida na aprovação e em cada reverificação anual do CRP (RNF005).
    data_verificacao_crp: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },

    // Média das estrelas das avaliações. É mantida pelo trigger trg_atualizador_avaliacao do banco
    // (a cada INSERT/UPDATE/DELETE em avaliacao), então a API NÃO deve receber nem gravar este campo.
    // O pg devolve numeric como string (ex.: "0.00").
    media_avaliacao: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0
    },

}, {

    tableName: 'psicologo',
    timestamps: false,
    validate: {
        // Espelha o CHECK motivo_reprovacao_check do banco, mas também recusa motivo vazio ou só com espaços,
        // que o CHECK aceita. Fica no nível do model porque validador de campo não roda quando o valor é nulo.
        motivoObrigatorioSeReprovado() {
            const motivo = this.motivo_reprovacao;
            if (this.status_validacao === 'REPROVADO' && (!motivo || !String(motivo).trim())) {
                throw new Error('É necessário informar o motivo da reprovação.');
            }
        }
    },
    indexes: [
        {
        unique: true,
        fields: ['crp_psicologo']
        },
        {
        unique:true,
        fields:['contato_psicologo']
        }
    ]
});

module.exports = psicologo;