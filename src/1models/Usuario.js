const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {

    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    tipo_usuario: {
        type: DataTypes.STRING(20)
    },

    email_usuario: {
        type: DataTypes.STRING(255)
    },

    senha_usuario: {
        type: DataTypes.STRING(255)
    },
    
    ativo: {
        type: DataTypes.BOOLEAN
    }

},
{
    tableName: 'usuario',
    timestamps: false
});

module.exports = Usuario;