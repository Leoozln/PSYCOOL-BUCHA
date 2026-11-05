const path = require('path');

// Carrega as variáveis de ambiente
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('./config/passport');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

app.get('/', (req, res) => { res.send('Olá mundo !'); });

// --- CONFIGURAÇÃO DO CORS (Atualizado para aceitar cookies) ---
app.use(cors({
    origin: 'http://localhost:5173', // Endereço do seu frontend
    credentials: true // OBRIGATÓRIO para o cookie de sessão funcionar
}));

const pool = require('./db');
app.use(express.json());

// --- CONFIGURAÇÃO DA SESSÃO NO BANCO (PostgreSQL) ---
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: { rejectUnauthorized: false } // Necessário para o Supabase
});

app.use(session({
    store: new pgSession({
        pool: pgPool,
        tableName: 'session',
        createTableIfMissing: true // Cria a tabela caso não exista
    }),
    secret: process.env.SESSION_SECRET || 'psycool_secret_temporario',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true, 
        secure: false, // false no localhost, true em produção
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
}));

// --- INICIALIZAÇÃO DO PASSPORT ---
app.use(passport.initialize());
app.use(passport.session());

// --- ROTAS DE AUTENTICAÇÃO ---
const authRoutes = require('./3routes/authRoutes');
app.use('/auth', authRoutes);

// --- DEMAIS ROTAS DO SISTEMA ---
app.use(express.static(
    path.resolve(__dirname, '../../frontend')
));

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

// --- SWAGGER ---
app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});