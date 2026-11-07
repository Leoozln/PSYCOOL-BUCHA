-- =====================================================================================
-- SCRUM-292: dados de demonstração para a banca (09/11/2026)
--
-- Deixa a conta Google da faculdade como PSICÓLOGO APROVADO, com 3 consultas futuras
-- (é o que a tela inicial do psicólogo lista em GET /psicologo/me/consultas).
-- Funciona no banco atual (usuário já existe, só é aprovado) e num banco LIMPO
-- (só a estrutura de psycool_banco.sql): nos dois casos o script pode ser rodado de novo
-- sem duplicar nada.
--
-- ATENÇÃO - DATAS FIXAS: as consultas são em 11/11/2026 às 10h, 12/11/2026 às 14h e
-- 13/11/2026 às 16h (horário de Brasília), gravadas em UTC (+3h). Depois de 11/11/2026 as
-- datas precisam ser atualizadas aqui no script: as CHECK de data futura
-- (agenda.datahora_agenda >= CURRENT_DATE e consulta.data_hora_consulta >= CURRENT_DATE)
-- recusam a primeira consulta e a execução inteira volta atrás. O que já foi gravado não é
-- afetado, e rodar de novo sem consultas novas a criar não dá erro.
--
-- Dados: tudo inventado (e-mails @exemplo.com, CPFs e CNPJ inválidos de propósito, telefones
-- 55501xx), exceto o e-mail institucional do psicólogo, que é a conta usada no login.
--
-- Uso:  psql -v ON_ERROR_STOP=1 -f backend/src/db/dados_demonstracao.sql
-- O banco do Supabase é compartilhado: aplique uma vez e confira antes.
-- =====================================================================================

BEGIN;

-- 1. Usuário do psicólogo. Se o e-mail já existir, não faz nada (mantém o google_id real).
--    Num banco limpo, o passport.js acha o usuário pelo e-mail no primeiro login e grava o google_id verdadeiro.
INSERT INTO usuario (tipo_usuario, email_usuario, google_id, ativo)
VALUES ('Psicologo', 'ens-guilhermeboesing@ugv.edu.br', 'demo-google-id-pendente', true)
ON CONFLICT DO NOTHING;

-- 2. Psicólogo com dados profissionais fictícios, só se ainda não existir (no banco atual já existe e não é alterado).
INSERT INTO psicologo (
    id_psicologo, nome_psicologo, crp_psicologo, cpf_psicologo, contato_psicologo, genero_psicologo,
    data_nascimento_psicologo, especialidade_psicologo, diploma_psicologo, abordagem_psicologo, descricao_psicologo
)
SELECT u.id_usuario, 'Guilherme Boesing Demonstracao', '99/99999', '000.000.000-04', '11955550199', 'MASCULINO',
       DATE '1995-03-20', ARRAY['Ansiedade', 'Terapia Cognitivo-Comportamental'],
       ARRAY['Psicologia - Universidade Exemplo'], 'TCC',
       'Perfil ficticio criado para a demonstracao da banca (SCRUM-292).'
FROM usuario u
WHERE u.email_usuario = 'ens-guilhermeboesing@ugv.edu.br'
  AND u.tipo_usuario = 'Psicologo'
  AND NOT EXISTS (SELECT 1 FROM psicologo p WHERE p.id_psicologo = u.id_usuario);

-- 3. Aprova o psicólogo. Não mexe em CRP, CPF, telefone nem nome.
--    Se já estiver APROVADO com data de verificação, deixa como está.
UPDATE psicologo
SET status_validacao = 'APROVADO',
    data_verificacao_crp = CURRENT_DATE
WHERE id_psicologo = (SELECT id_usuario FROM usuario WHERE email_usuario = 'ens-guilhermeboesing@ugv.edu.br')
  AND (status_validacao <> 'APROVADO' OR data_verificacao_crp IS NULL);

-- 4. Usuários fictícios: a empresa e os 3 pacientes (o id deles é FK de usuario).
INSERT INTO usuario (tipo_usuario, email_usuario, google_id, ativo) VALUES
    ('Empresa', 'empresa.demo@exemplo.com',   'demo-google-id-empresa',    true),
    ('Cliente', 'paciente.demo1@exemplo.com', 'demo-google-id-paciente-1', true),
    ('Cliente', 'paciente.demo2@exemplo.com', 'demo-google-id-paciente-2', true),
    ('Cliente', 'paciente.demo3@exemplo.com', 'demo-google-id-paciente-3', true)
ON CONFLICT DO NOTHING;

-- 5. Empresa conveniada fictícia (convênio DEMOBANCA).
INSERT INTO empresa (
    id_empresa, nome_empresa, cnpj_empresa, contato_empresa, convenio_empresa, nome_fantasia, cep_empresa, descricao_empresa
)
SELECT u.id_usuario, 'Empresa Demonstracao Exemplo', '00000000000000', '11955550100', 'DEMOBANCA',
       'Empresa Demonstracao', '00000-000', 'Empresa ficticia criada para a demonstracao da banca (SCRUM-292).'
FROM usuario u
WHERE u.email_usuario = 'empresa.demo@exemplo.com'
  AND NOT EXISTS (SELECT 1 FROM empresa e WHERE e.id_empresa = u.id_usuario);

-- 6. Pacientes fictícios, conveniados pela empresa acima.
INSERT INTO cliente (
    id_cliente, convenio_cliente, nome_cliente, cpf_cliente, contato_cliente, genero_cliente,
    data_nascimento_cliente, descricao_cliente
)
SELECT u.id_usuario, 'DEMOBANCA', d.nome, d.cpf, d.contato, d.genero, d.nascimento,
       'Paciente ficticio criado para a demonstracao da banca (SCRUM-292).'
FROM (VALUES
    ('paciente.demo1@exemplo.com', 'Mariana Exemplo Souza', '000.000.000-01', '11955550101', 'FEMININO',  DATE '1992-08-14'),
    ('paciente.demo2@exemplo.com', 'Rafael Exemplo Lima',   '000.000.000-02', '11955550102', 'MASCULINO', DATE '1988-02-03'),
    ('paciente.demo3@exemplo.com', 'Camila Exemplo Costa',  '000.000.000-03', '11955550103', 'FEMININO',  DATE '1995-11-27')
) AS d(email, nome, cpf, contato, genero, nascimento)
JOIN usuario u ON u.email_usuario = d.email
WHERE NOT EXISTS (SELECT 1 FROM cliente c WHERE c.id_cliente = u.id_usuario);

-- 7. Três consultas (agenda AGENDADO + consulta). A chave para não duplicar é o link do Meet, que é único.
--    Horários em UTC: 13h, 17h e 19h = 10h, 14h e 16h em Brasília. Preço 150,00 com 30,00 de desconto de convênio.
WITH demo (email_paciente, horario_utc, link) AS (
    VALUES
        ('paciente.demo1@exemplo.com', TIMESTAMP '2026-11-11 13:00:00', 'https://meet.google.com/psy-demo-aaa'),
        ('paciente.demo2@exemplo.com', TIMESTAMP '2026-11-12 17:00:00', 'https://meet.google.com/psy-demo-bbb'),
        ('paciente.demo3@exemplo.com', TIMESTAMP '2026-11-13 19:00:00', 'https://meet.google.com/psy-demo-ccc')
),
novas AS (
    SELECT d.horario_utc, d.link, u.id_usuario AS id_cliente,
           (SELECT id_usuario FROM usuario WHERE email_usuario = 'ens-guilhermeboesing@ugv.edu.br') AS id_psicologo
    FROM demo d
    JOIN usuario u ON u.email_usuario = d.email_paciente
    WHERE NOT EXISTS (SELECT 1 FROM consulta c WHERE c.link_consulta = d.link)
),
agendas AS (
    INSERT INTO agenda (id_cliente, id_psicologo, datahora_agenda, status_agenda, preco_base, desconto_convenio, preco_final)
    SELECT id_cliente, id_psicologo, horario_utc, 'AGENDADO', 150.00, 30.00, 120.00
    FROM novas
    RETURNING id_agenda, id_cliente, datahora_agenda
)
INSERT INTO consulta (id_consulta_agendada, id_psicologo_responsavel, id_cliente_consultado, link_consulta, data_hora_consulta)
SELECT a.id_agenda, n.id_psicologo, a.id_cliente, n.link, a.datahora_agenda
FROM agendas a
JOIN novas n ON n.id_cliente = a.id_cliente AND n.horario_utc = a.datahora_agenda;

COMMIT;
