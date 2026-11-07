const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('usuario', {

    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    google_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },

    google_access_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    google_refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    tipo_usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: { isIn: [['Cliente', 'Psicologo', 'Empresa', 'Administrador']]}
    },

    email_usuario: {
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