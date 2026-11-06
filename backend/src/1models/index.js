const Agenda = require('./Agenda');
const Anotacao = require('./Anotacao');
const Avaliacao = require('./Avaliacao');
const Cliente = require('./Cliente');
const Consulta = require('./Consulta');
const Empresa = require('./Empresa');
const Pagamento = require('./Pagamento');
const Psicologo = require('./Psicologo');
const Usuario = require('./Usuario');

Usuario.hasOne(Psicologo, { foreignKey: 'id_psicologo', sourceKey: 'id_usuario' });
Psicologo.belongsTo(Usuario, { foreignKey: 'id_psicologo', targetKey: 'id_usuario' });

Usuario.hasOne(Cliente, { foreignKey: 'id_cliente', sourceKey: 'id_usuario' });
Cliente.belongsTo(Usuario, {foreignKey: 'id_cliente', targetKey: 'id_usuario' });

Usuario.hasOne(Empresa, {foreignKey: 'id_empresa', sourceKey: 'id_usuario' });
Empresa.belongsTo(Usuario, {foreignKey: 'id_empresa', targetKey: 'id_usuario'});

Cliente.hasMany(Agenda, { foreignKey: 'id_cliente' });
Agenda.belongsTo(Cliente, { foreignKey: 'id_cliente' });

Psicologo.hasMany(Agenda, { foreignKey: 'id_psicologo' });
Agenda.belongsTo(Psicologo, { foreignKey: 'id_psicologo' });

Consulta.belongsTo(Cliente, { foreignKey: 'id_cliente_consultado' });
Consulta.belongsTo(Psicologo, { foreignKey: 'id_psicologo_responsavel' });

Consulta.belongsTo(Agenda, { foreignKey: 'id_consulta_agendada' });
Agenda.hasOne(Consulta, { foreignKey: 'id_consulta_agendada' });

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