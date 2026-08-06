const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cargo = sequelize.define('Cargo', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    cargo: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }

},
{
    tableName: 'cargo',
    timestamps: false
});

module.exports = Cargo;