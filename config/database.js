const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'psycool',
    'postgres',
    'postgres',
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

 module.exports = sequelize;

// DB do LEO:

// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(
//     'psycool',
//     'postgres',
//     'minha-senha',
//     {
//         host: 'localhost',
//         port: 5433, // <- porta do PostgreSQL 15
//         dialect: 'postgres',
//         logging: false
//     }
// );

// module.exports = sequelize;
