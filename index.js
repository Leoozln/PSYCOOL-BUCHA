const express = require('express');
const app = express()
const port = 3000

app.get('/', (req, res) => { res.send('Olá mundo !'); })

const pool = require('./db');
app.use(express.json());

const usuarioRoutes = require('./3routes/usuarioRoutes');
app.use('/usuario', usuarioRoutes);

const clienteRoutes = require('./3routes/clienteRoutes');
app.use('/cliente', clienteRoutes);

const psicologoRoutes = require('./3routes/psicologoRoutes');
app.use('/psicologo', psicologoRoutes);

const agendaRoutes = require('./3routes/agendaRoutes');
app.use('/agenda', agendaRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

