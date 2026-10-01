require('dotenv').config();
const express = require('express');
const app = express()
const port = 3000

const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./swagger/swagger');

app.get('/', (req, res) => { res.send('Olá mundo !'); })

const pool = require('./db');
app.use(express.json());
app.use(express.static('public'));

const usuarioRoutes = require('./3routes/usuarioRoutes');
app.use('/usuario', usuarioRoutes);

const clienteRoutes = require('./3routes/clienteRoutes');
app.use('/cliente', clienteRoutes);

const psicologoRoutes = require('./3routes/psicologoRoutes');
app.use('/psicologo', psicologoRoutes);

const empresaRoutes = require('./3routes/empresaRoutes');
app.use('/empresa', empresaRoutes);

const agendaRoutes = require('./3routes/agendaRoutes');
app.use('/agenda', agendaRoutes);

const anotacaoRoutes = require('./3routes/anotacaoRoutes');
app.use('/anotacao', anotacaoRoutes);

const avaliacaoRoutes = require('./3routes/avaliacaoRoutes');
app.use('/avaliacao', avaliacaoRoutes);

const consultaRoutes = require('./3routes/consultaRoutes');
app.use('/consulta', consultaRoutes);

const pagamentoRoutes = require('./3routes/pagamentoRoutes');
app.use('/pagamento', pagamentoRoutes);

app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


