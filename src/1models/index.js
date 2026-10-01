const Agenda = require('./Agenda');
const Anotacao = require('./Anotacao');
const Avaliacao = require('./Avaliacao');
const Cliente = require('./Cliente');
const Consulta = require('./Consulta');
const Empresa = require('./Empresa');
const Pagamento = require('./Pagamento');
const Psicologo = require('./Psicologo');
const Usuario = require('./Usuario');

// Relações
Usuario.hasOne(Psicologo, { foreignKey: 'id_psicologo' });
Psicologo.belongsTo(Usuario, { foreignKey: 'id_psicologo' });

Cliente.hasMany(Agenda, { foreignKey: 'id_cliente' });
Agenda.belongsTo(Cliente, { foreignKey: 'id_cliente' });

Psicologo.hasMany(Agenda, { foreignKey: 'id_psicologo' });
Agenda.belongsTo(Psicologo, { foreignKey: 'id_psicologo' });

Consulta.belongsTo(Cliente, { foreignKey: 'id_cliente_consultado' });
Consulta.belongsTo(Psicologo, { foreignKey: 'id_psicologo_responsavel' });

Anotacao.belongsTo(Consulta, { foreignKey: 'id_consulta_anotacao' });
Consulta.hasOne(Anotacao, { foreignKey: 'id_consulta_anotacao' });

Avaliacao.belongsTo(Psicologo, { foreignKey: 'avaliacao_psicologo' });
Avaliacao.belongsTo(Consulta, { foreignKey: 'avaliacao_consulta' });

Pagamento.belongsTo(Agenda, { foreignKey: 'id_agenda_pagamento' });
Agenda.hasOne(Pagamento, { foreignKey: 'id_agenda_pagamento' });

Empresa.hasMany(Cliente, { foreignKey: 'convenio_cliente' });

module.exports = {
    Agenda,
    Anotacao,
    Avaliacao,
    Cliente,
    Consulta,
    Empresa,
    Pagamento,
    Psicologo,
    Usuario,
};