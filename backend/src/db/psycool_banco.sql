--
-- PostgreSQL database dump
--

\restrict 9yE53aH7Nknp7rhftTpDO8uWKagh2oqMQGvMlRcdNu6pWuBK4UfSWNUIVED72tM

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: atualizador_avaliacao(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.atualizador_avaliacao() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_psicologo INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_id_psicologo := OLD.avaliacao_psicologo;
  ELSE
    v_id_psicologo := NEW.avaliacao_psicologo;
  END IF;
  UPDATE psicologo
  SET media_avaliacao = (
    SELECT COALESCE(AVG(estrela_avaliacao), 0)
    FROM avaliacao
    WHERE avaliacao_psicologo = v_id_psicologo
  ) WHERE id_psicologo = v_id_psicologo;
  RETURN NULL;
END;
$$;


--
-- Name: cadastrar_empresa(character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cadastrar_empresa(p_google_id character varying, p_email_usuario character varying, p_nome_empresa character varying, p_cnpj_empresa character varying, p_contato_empresa character varying, p_convenio_empresa character varying, p_nome_fantasia character varying DEFAULT NULL::character varying, p_cep_empresa character varying DEFAULT NULL::character varying, p_logo_empresa character varying DEFAULT NULL::character varying, p_descricao_empresa text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_usuario INTEGER;
BEGIN
    INSERT INTO usuario (google_id, email_usuario, tipo_usuario)
    VALUES (p_google_id, p_email_usuario, 'Empresa')
    RETURNING id_usuario INTO v_id_usuario;
    INSERT INTO empresa (
        id_empresa, 
        nome_empresa, 
        cnpj_empresa, 
        contato_empresa, 
        convenio_empresa, 
        nome_fantasia, 
        cep_empresa, 
        logo_empresa, 
        descricao_empresa
    ) VALUES (
        v_id_usuario, 
        p_nome_empresa, 
        p_cnpj_empresa, 
        p_contato_empresa, 
        p_convenio_empresa, 
        p_nome_fantasia, 
        p_cep_empresa, 
        p_logo_empresa, 
        p_descricao_empresa
    );
END;
$$;


--
-- Name: cadastro_cliente(uuid, character varying, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cadastro_cliente(p_id_empresa uuid, p_nome_cliente character varying, p_cpf_cliente character varying, p_email_usuario character varying, p_senha_usuario character varying, p_convenio_cliente character varying DEFAULT NULL::character varying) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
v_id_usuario UUID;
v_id_cliente UUID;
BEGIN
INSERT INTO usuario (email_usuario, senha_usuario, tipo_usuario, id_empresa) VALUES (
  p_email_usuario, p_senha_usuario, 'CLIENTE', p_id_empresa
)
RETURNING id_usuario INTO v_id_usuario;
INSERT INTO cliente (nome_cliente, cpf_cliente, id_usuario, id_empresa, convenio_cliente, status_cliente, data_nascimento_cliente) VALUES (
  p_nome_cliente, p_cpf_cliente, v_id_usuario, p_id_empresa, p_convenio_cliente, 'Ativo', NOW()
)
RETURNING id_cliente INTO v_id_cliente;
RETURN v_id_cliente;
END;
$$;


--
-- Name: calculo_preco_final(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculo_preco_final() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.desconto_convenio IS NOT NULL THEN
  NEW.preco_final := NEW.preco_base - NEW.desconto_convenio;
ELSE
  NEW.preco_final := NEW.preco_base;
END IF;

IF NEW.preco_final < 0 THEN
  NEW.preco_final := 0;
END IF;

  RETURN NEW;
END;
$$;


--
-- Name: finalizacao_consulta(uuid, character varying, numeric); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.finalizacao_consulta(IN p_id_consulta uuid, IN p_forma_pagamento character varying, IN p_valor_final numeric)
    LANGUAGE plpgsql
    AS $$DECLARE v_id_agenda UUID;
BEGIN
  UPDATE consulta
  SET status_consulta = 'Realizada', data_hora_consulta = NOW()
  WHERE id_consulta = p_id_consulta
  RETURNING id_agenda_agendada INTO v_id_agenda;
  UPDATE agenda
  SET status_agenda = 'Concluído'
  WHERE id_agenda = v_id_agenda;
  INSERT INTO pagamento (id_agenda_pagamento, preco_final, forma_pagamento, situacao_pagamento)
  VALUES (
    v_id_agenda, p_valor_final, p_forma_pagamento, 'Pago'
  );
END;$$;


--
-- Name: listar_empresa(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.listar_empresa() RETURNS TABLE(id_empresa uuid, razao_social character varying, cnpj_empresa character varying)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
RETURN QUERY
SELECT e.id_empresa, e.razao_social, e.cnpj_empresa
FROM empresa e
WHERE e.status_empresa = 'Ativo'
ORDER BY e.razao_social;
END;
$$;


--
-- Name: lote_cliente(uuid, jsonb); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.lote_cliente(IN p_id_empresa uuid, IN p_cliente jsonb)
    LANGUAGE plpgsql
    AS $$DECLARE
  v_cliente JSONB;
  v_id_usuario UUID;
BEGIN 
  FOR v_cliente IN SELECT * FROM jsonb_array_elements(p_clientes) LOOP
    INSERT INTO usuario (email_usuario, senha_usuario, tipo_usuario, id_empresa)
    VALUES (
      v_cliente->>'email',
      'senha_padrao_123',
      'CLIENTE',
      p_id_empresa
    ) RETURNING id_usuario INTO v_id_usuario;
    INSERT INTO cliente (nome_cliente, cpf_cliente, contato_cliente, id_usuario, id_empresa, status_cliente)
    VALUES (
      v_cliente->>'nome',
      v_cliente->>'cpf',
      v_cliente->>'contato',
      v_id_usuario,
      p_id_empresa,
      'Ativo'
    );
  END LOOP;
END;$$;


--
-- Name: validar_convenio_cliente(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validar_convenio_cliente(p_convenio_empresa character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF p_convenio_empresa IS NOT NULL THEN
        IF NOT EXISTS(
            SELECT 1 FROM empresa WHERE convenio_empresa = p_convenio_empresa
            AND ativo = true
        ) THEN
            RETURN FALSE;
        END IF;
    END IF;
    RETURN TRUE;
END;
$$;


--
-- Name: verificacao_conflito_agenda(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.verificacao_conflito_agenda() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_conflito INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_conflito
  FROM agenda
  WHERE id_psicologo = NEW.id_psicologo
    AND id_agenda != COALESCE(NEW.id_agenda, -1)
    AND status_agenda != 'Cancelado'
    AND (
      (NEW.datahora_agenda >= datahora_agenda AND NEW.datahora_agenda < datahora_agenda + interval '1 hour')
      OR (NEW.datahora_agenda + interval '1 hour' > datahora_agenda AND NEW.datahora_agenda + interval '1 hour' <= datahora_agenda + interval '1 hour')
    );
  IF v_conflito > 0 THEN
    RAISE EXCEPTION 'Conflito de agenda: O psicólogo já tem uma consulta neste horário.';
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: vincular_empresa(uuid, uuid, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.vincular_empresa(p_id_cliente uuid, p_id_empresa uuid, p_convenio_cliente character varying DEFAULT NULL::character varying) RETURNS TABLE(sucesso boolean, mensagem character varying, id_cliente uuid, id_empresa uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  v_cliente_existe BOOLEAN;
  v_empresa_existe BOOLEAN;
  v_empresa_ativa BOOLEAN;
  v_empresa_atual UUID;
BEGIN
  SELECT
    EXISTS (SELECT 1 FROM cliente WHERE id_cliente = p_id_cliente),
    (SELECT id_empresa FROM cliente WHERE id_cliente = p_id_cliente)
  INTO v_cliente_existe, v_empresa_atual;
  IF NOT v_cliente_existe THEN
    RETURN QUERY SELECT FALSE, 'Cliente não encontrado.'::VARCHAR, NULL::UUID, NULL::UUID;
    RETURN;
  END IF;
  SELECT 
    EXISTS (SELECT 1 FROM empresa WHERE id_empresa = p_id_empresa),
    COALESCE((SELECT status_empresa = 'Ativo' FROM empresa WHERE id_empresa = p_id_empresa), FALSE)
  INTO v_empresa_existe, v_empresa_ativa;
  IF NOT v_empresa_existe THEN
    RETURN QUERY SELECT FALSE, 'Empresa não encontrada.'::VARCHAR, NULL::UUID, NULL::UUID;
    RETURN;
  END IF;
  IF NOT v_empresa_ativa THEN
    RETURN QUERY SELECT FALSE, 'Empresa inativa. Não é possível realizar o vínculo.'::VARCHAR, NULL::UUID, NULL::UUID;
    RETURN;
  END IF;
  IF v_empresa_atual = p_id_empresa THEN
    RETURN QUERY SELECT FALSE, 'Cliente já está vinculado a esta empresa.'::VARCHAR, p_id_cliente, p_id_empresa;
    RETURN;
  END IF;
  UPDATE cliente 
    SET
      id_empresa = p_id_empresa,
      convenio_cliente = COALESCE(p_convenio_cliente, convenio_cliente),
      data_cadastro_cliente = NOW()
    WHERE id_cliente = p_id_cliente;
    RETURN QUERY SELECT TRUE, 'Cliente vinculado com sucesso.'::VARCHAR, p_id_cliente, p_id_empresa;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY SELECT FALSE, ('Erro ao vincular: ' || SQLERRM)::VARCHAR, NULL::UUID, NULL::UUID;
  END;
  $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agenda; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agenda (
    id_agenda integer NOT NULL,
    id_cliente integer NOT NULL,
    id_psicologo integer NOT NULL,
    datahora_agenda timestamp without time zone NOT NULL,
    status_agenda character varying(20) DEFAULT 'AGENDADO'::character varying NOT NULL,
    preco_base numeric(10,2) NOT NULL,
    desconto_convenio numeric(10,2) DEFAULT 0,
    preco_final numeric(10,2) NOT NULL,
    CONSTRAINT datahora_agenda_check CHECK ((datahora_agenda >= CURRENT_DATE)),
    CONSTRAINT desconto_convenio_check CHECK (((desconto_convenio >= (0)::numeric) AND (desconto_convenio <= preco_base))),
    CONSTRAINT preco_base_check CHECK ((preco_base >= (0)::numeric)),
    CONSTRAINT preco_final_check CHECK ((preco_final = (preco_base - desconto_convenio))),
    CONSTRAINT status_agenda_check CHECK (((status_agenda)::text = ANY (ARRAY[('AGENDADO'::character varying)::text, ('EM_ANALISE'::character varying)::text, ('CANCELADO'::character varying)::text, ('REALIZADO'::character varying)::text])))
);


--
-- Name: agenda_id_agenda_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.agenda_id_agenda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: agenda_id_agenda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.agenda_id_agenda_seq OWNED BY public.agenda.id_agenda;


--
-- Name: cliente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cliente (
    id_cliente integer NOT NULL,
    convenio_cliente character varying(10),
    nome_cliente character varying(255) NOT NULL,
    cpf_cliente character varying(14) NOT NULL,
    contato_cliente character varying(11) NOT NULL,
    genero_cliente character varying(20) NOT NULL,
    data_nascimento_cliente date NOT NULL,
    descricao_cliente text,
    CONSTRAINT contato_cliente_check CHECK (((contato_cliente)::text ~ '^[1-9]{2}[0-9]{9}$'::text)),
    CONSTRAINT cpf_cliente_check CHECK (((cpf_cliente)::text ~ '^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$'::text)),
    CONSTRAINT data_nascimento_cliente_check CHECK ((data_nascimento_cliente <= (CURRENT_DATE - '16 years'::interval))),
    CONSTRAINT genero_cliente_check CHECK (((genero_cliente)::text = ANY (ARRAY[('MASCULINO'::character varying)::text, ('FEMININO'::character varying)::text, ('OUTRO'::character varying)::text, ('PREFIRO NÃO INFORMAR'::character varying)::text]))),
    CONSTRAINT nome_cliente_check CHECK (((nome_cliente)::text ~* '^[A-Za-zÀ-ú ][A-Za-zÀ-ú ]{3,255}$'::text))
);


--
-- Name: consulta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consulta (
    id_consulta integer NOT NULL,
    id_consulta_agendada integer,
    id_psicologo_responsavel integer,
    id_cliente_consultado integer,
    link_consulta character varying(255) NOT NULL,
    data_hora_consulta timestamp without time zone NOT NULL,
    CONSTRAINT data_hora_consulta_check CHECK ((data_hora_consulta >= CURRENT_DATE)),
    CONSTRAINT link_consulta_check CHECK (((link_consulta)::text ~* '^https://meet.google.com/[A-Za-z._%+-?=&]{1,100}$'::text))
);


--
-- Name: psicologo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.psicologo (
    id_psicologo integer NOT NULL,
    nome_psicologo character varying(255) NOT NULL,
    crp_psicologo character varying(12) NOT NULL,
    contato_psicologo character varying(11) NOT NULL,
    diploma_psicologo text[] DEFAULT '{}'::text[],
    genero_psicologo character varying(20) NOT NULL,
    data_nascimento_psicologo date NOT NULL,
    especialidade_psicologo text[] DEFAULT '{}'::text[] NOT NULL,
    foto_psicologo character varying(255),
    descricao_psicologo text,
    status_validacao character varying(20) DEFAULT 'PENDENTE'::character varying NOT NULL,
    media_avaliacao numeric(3,2) DEFAULT 0,
    abordagem_psicologo character varying(100),
    motivo_reprovacao text,
    data_verificacao_crp date,
    cpf_psicologo character varying(14) NOT NULL,
    CONSTRAINT contato_psicologo_check CHECK (((contato_psicologo)::text ~ '^[1-9]{2}[0-9]{9}$'::text)),
    CONSTRAINT cpf_psicologo_check CHECK (((cpf_psicologo)::text ~ '^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$'::text)),
    CONSTRAINT crp_psicologo_check CHECK (((crp_psicologo)::text ~ '^[0-9]{2}/[0-9]{5,6}$'::text)),
    CONSTRAINT data_nascimento_psicologo_check CHECK ((data_nascimento_psicologo <= (CURRENT_DATE - '21 years'::interval))),
    CONSTRAINT especialidade_psicologo_check CHECK ((array_length(especialidade_psicologo, 1) >= 1)),
    CONSTRAINT genero_psicologo_check CHECK (((genero_psicologo)::text = ANY (ARRAY[('MASCULINO'::character varying)::text, ('FEMININO'::character varying)::text, ('OUTRO'::character varying)::text, ('PREFIRO NÃO INFORMAR'::character varying)::text]))),
    CONSTRAINT motivo_reprovacao_check CHECK ((((status_validacao)::text <> 'REPROVADO'::text) OR (motivo_reprovacao IS NOT NULL))),
    CONSTRAINT nome_psicologo_check CHECK (((nome_psicologo)::text ~* '^[A-Za-zÀ-ú ][A-Za-zÀ-ú ]{3,255}$'::text)),
    CONSTRAINT psicologo_status_validacao_check CHECK (((status_validacao)::text = ANY (ARRAY[('PENDENTE'::character varying)::text, ('APROVADO'::character varying)::text, ('REPROVADO'::character varying)::text])))
);


--
-- Name: agenda_meet; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.agenda_meet AS
 SELECT cs.id_consulta,
    cs.data_hora_consulta,
    cs.link_consulta,
    c.nome_cliente,
    c.contato_cliente,
    ps.nome_psicologo,
    ag.status_agenda
   FROM (((public.consulta cs
     JOIN public.agenda ag ON ((cs.id_consulta_agendada = ag.id_agenda)))
     JOIN public.cliente c ON ((cs.id_cliente_consultado = c.id_cliente)))
     JOIN public.psicologo ps ON ((cs.id_psicologo_responsavel = ps.id_psicologo)));


--
-- Name: anotacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.anotacao (
    id_anotacao integer NOT NULL,
    id_consulta_anotacao integer,
    anotacao_cliente text[],
    anotacao_psicologo text[]
);


--
-- Name: anotacoes_id_anotacao_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.anotacoes_id_anotacao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: anotacoes_id_anotacao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.anotacoes_id_anotacao_seq OWNED BY public.anotacao.id_anotacao;


--
-- Name: avaliacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.avaliacao (
    id_avaliacao integer NOT NULL,
    avaliacao_psicologo integer NOT NULL,
    estrela_avaliacao numeric NOT NULL,
    texto_avaliacao text[] DEFAULT '{}'::text[] NOT NULL,
    avaliacao_consulta integer,
    CONSTRAINT estrela_avaliacao_check CHECK (((estrela_avaliacao)::text ~ '^[0-5]{1}$'::text))
);


--
-- Name: avaliacao_id_avaliacao_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.avaliacao_id_avaliacao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: avaliacao_id_avaliacao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.avaliacao_id_avaliacao_seq OWNED BY public.avaliacao.id_avaliacao;


--
-- Name: cliente_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cliente_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cliente_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cliente_id_cliente_seq OWNED BY public.cliente.id_cliente;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    tipo_usuario character varying(20) NOT NULL,
    email_usuario character varying(255) NOT NULL,
    ativo boolean DEFAULT true,
    google_id character varying(255) NOT NULL,
    google_access_token text,
    google_refresh_token text,
    CONSTRAINT email_usuario_check CHECK (((email_usuario)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[a-z]{2,}$'::text)),
    CONSTRAINT tipo_usuario_check CHECK (((tipo_usuario)::text = ANY ((ARRAY['Cliente'::character varying, 'Psicologo'::character varying, 'Empresa'::character varying, 'Administrador'::character varying])::text[])))
);


--
-- Name: clientes_ativos; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.clientes_ativos AS
 SELECT c.nome_cliente,
    c.contato_cliente,
    u.email_usuario,
    u.ativo
   FROM (public.cliente c
     JOIN public.usuario u ON ((u.id_usuario = c.id_cliente)))
  WHERE (u.ativo = true);


--
-- Name: consulta_id_consulta_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.consulta_id_consulta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: consulta_id_consulta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.consulta_id_consulta_seq OWNED BY public.consulta.id_consulta;


--
-- Name: empresa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.empresa (
    id_empresa integer NOT NULL,
    nome_empresa character varying(255) NOT NULL,
    cnpj_empresa character varying(18) NOT NULL,
    contato_empresa character varying(11) NOT NULL,
    convenio_empresa character varying(10) NOT NULL,
    nome_fantasia character varying(255),
    cep_empresa character varying(9) NOT NULL,
    logo_empresa character varying(255),
    descricao_empresa text,
    CONSTRAINT cep_empresa_check CHECK (((cep_empresa)::text ~ '^[0-9]{5}-[0-9]{3}$'::text)),
    CONSTRAINT cnpj_empresa_check CHECK (((cnpj_empresa)::text ~ '^[0-9]{14}$'::text)),
    CONSTRAINT contato_empresa_check CHECK (((contato_empresa)::text ~ '^[1-9]{2}[0-9]{9}$'::text)),
    CONSTRAINT convenio_empresa_check CHECK (((convenio_empresa)::text ~* '^[A-Za-zÀ-ú0-9-]{3,10}$'::text)),
    CONSTRAINT nome_empresa_check CHECK (((nome_empresa)::text ~* '^[A-Za-zÀ-ú1-9 .-]{3,255}$'::text))
);


--
-- Name: contatos_usuarios; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.contatos_usuarios AS
 SELECT u.id_usuario,
    c.nome_cliente AS nome_usuario,
    u.tipo_usuario,
    c.contato_cliente AS telefone_contato,
    u.email_usuario,
    u.ativo
   FROM (public.cliente c
     JOIN public.usuario u ON ((c.id_cliente = u.id_usuario)))
UNION ALL
 SELECT u.id_usuario,
    ps.nome_psicologo AS nome_usuario,
    u.tipo_usuario,
    ps.contato_psicologo AS telefone_contato,
    u.email_usuario,
    u.ativo
   FROM (public.psicologo ps
     JOIN public.usuario u ON ((ps.id_psicologo = u.id_usuario)))
UNION ALL
 SELECT u.id_usuario,
    e.nome_empresa AS nome_usuario,
    u.tipo_usuario,
    e.contato_empresa AS telefone_contato,
    u.email_usuario,
    u.ativo
   FROM (public.empresa e
     JOIN public.usuario u ON ((e.id_empresa = u.id_usuario)));


--
-- Name: empresa_id_empresa_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.empresa_id_empresa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: empresa_id_empresa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.empresa_id_empresa_seq OWNED BY public.empresa.id_empresa;


--
-- Name: pagamento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pagamento (
    id_pagamento integer NOT NULL,
    id_agenda_pagamento integer,
    preco_final numeric(10,2) NOT NULL,
    forma_pagamento character varying(55) DEFAULT 'DINHEIRO'::character varying NOT NULL,
    situacao_pagamento character varying(255) DEFAULT 'AGUARDANDO PAGAMENTO'::character varying NOT NULL,
    CONSTRAINT forma_pagamento_check CHECK (((forma_pagamento)::text = ANY (ARRAY[('DINHEIRO'::character varying)::text, ('PIX'::character varying)::text, ('CARTAO DE CREDITO'::character varying)::text, ('CARTAO DE DEBITO'::character varying)::text, ('BOLETO'::character varying)::text, ('A PRAZO'::character varying)::text]))),
    CONSTRAINT situacao_pagamento_check CHECK (((situacao_pagamento)::text = ANY (ARRAY[('PAGO'::character varying)::text, ('AGUARDANDO PAGAMENTO'::character varying)::text, ('PAGO COM ATRASO'::character varying)::text, ('PAGAMENTO ATRASADO'::character varying)::text])))
);


--
-- Name: erros_agendamento; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.erros_agendamento AS
 SELECT c.nome_cliente,
    a.datahora_agenda,
    a.status_agenda,
    p.situacao_pagamento
   FROM ((public.cliente c
     JOIN public.agenda a ON ((a.id_cliente = c.id_cliente)))
     JOIN public.pagamento p ON ((p.id_agenda_pagamento = a.id_agenda)))
  ORDER BY a.status_agenda;


--
-- Name: faturamento_psicologo; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.faturamento_psicologo AS
 SELECT ps.id_psicologo,
    ps.nome_psicologo,
    count(pg.id_pagamento) AS qtd_pagamentos,
    avg(pg.preco_final) AS media_pagamento,
    sum(pg.preco_final) AS total_pagamento
   FROM ((public.pagamento pg
     JOIN public.agenda ag ON ((pg.id_agenda_pagamento = ag.id_agenda)))
     JOIN public.psicologo ps ON ((ag.id_psicologo = ps.id_psicologo)))
  WHERE ((pg.situacao_pagamento)::text = 'PAGO'::text)
  GROUP BY ps.id_psicologo, ps.nome_psicologo;


--
-- Name: pagamento_id_pagamento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pagamento_id_pagamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pagamento_id_pagamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pagamento_id_pagamento_seq OWNED BY public.pagamento.id_pagamento;


--
-- Name: pendencias_financeiras; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.pendencias_financeiras AS
 SELECT pg.id_pagamento,
    c.nome_cliente,
    c.contato_cliente,
    ps.nome_psicologo,
    ag.datahora_agenda,
    pg.preco_final,
    pg.situacao_pagamento
   FROM (((public.pagamento pg
     JOIN public.agenda ag ON ((pg.id_agenda_pagamento = ag.id_agenda)))
     JOIN public.cliente c ON ((ag.id_cliente = c.id_cliente)))
     JOIN public.psicologo ps ON ((ag.id_psicologo = ps.id_psicologo)))
  WHERE ((pg.situacao_pagamento)::text = 'AGUARDANDO PAGAMENTO'::text);


--
-- Name: psicologo_id_psicologo_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.psicologo_id_psicologo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: psicologo_id_psicologo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.psicologo_id_psicologo_seq OWNED BY public.psicologo.id_psicologo;


--
-- Name: relatorio_convenio; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.relatorio_convenio AS
 SELECT e.id_empresa,
    e.nome_empresa,
    e.convenio_empresa,
    count(ag.id_agenda) AS total_consultas,
    sum(ag.desconto_convenio) AS desconto_concedido
   FROM ((public.empresa e
     JOIN public.cliente c ON (((c.convenio_cliente)::text = (e.convenio_empresa)::text)))
     JOIN public.agenda ag ON ((ag.id_cliente = c.id_cliente)))
  GROUP BY e.id_empresa, e.nome_empresa, e.convenio_empresa;


--
-- Name: reputacao_psicologo; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.reputacao_psicologo AS
 SELECT ps.id_psicologo,
    ps.nome_psicologo,
    ps.crp_psicologo,
    count(a.id_avaliacao) AS total_avaliacoes,
    round(avg(a.estrela_avaliacao), 2) AS media_estrelas
   FROM (public.psicologo ps
     LEFT JOIN public.avaliacao a ON ((ps.id_psicologo = a.avaliacao_psicologo)))
  GROUP BY ps.id_psicologo, ps.nome_psicologo, ps.crp_psicologo;


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- Name: vinculos_empresas; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.vinculos_empresas AS
 SELECT e.nome_empresa,
    e.convenio_empresa,
    c.nome_cliente
   FROM (public.empresa e
     JOIN public.cliente c ON (((c.convenio_cliente)::text = (e.convenio_empresa)::text)));


--
-- Name: agenda id_agenda; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda ALTER COLUMN id_agenda SET DEFAULT nextval('public.agenda_id_agenda_seq'::regclass);


--
-- Name: anotacao id_anotacao; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anotacao ALTER COLUMN id_anotacao SET DEFAULT nextval('public.anotacoes_id_anotacao_seq'::regclass);


--
-- Name: avaliacao id_avaliacao; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avaliacao ALTER COLUMN id_avaliacao SET DEFAULT nextval('public.avaliacao_id_avaliacao_seq'::regclass);


--
-- Name: cliente id_cliente; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente ALTER COLUMN id_cliente SET DEFAULT nextval('public.cliente_id_cliente_seq'::regclass);


--
-- Name: consulta id_consulta; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta ALTER COLUMN id_consulta SET DEFAULT nextval('public.consulta_id_consulta_seq'::regclass);


--
-- Name: empresa id_empresa; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa ALTER COLUMN id_empresa SET DEFAULT nextval('public.empresa_id_empresa_seq'::regclass);


--
-- Name: pagamento id_pagamento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagamento ALTER COLUMN id_pagamento SET DEFAULT nextval('public.pagamento_id_pagamento_seq'::regclass);


--
-- Name: psicologo id_psicologo; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psicologo ALTER COLUMN id_psicologo SET DEFAULT nextval('public.psicologo_id_psicologo_seq'::regclass);


--
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- Name: agenda agenda_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT agenda_pkey PRIMARY KEY (id_agenda);


--
-- Name: anotacao anotacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anotacao
    ADD CONSTRAINT anotacoes_pkey PRIMARY KEY (id_anotacao);


--
-- Name: avaliacao avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT avaliacao_pkey PRIMARY KEY (id_avaliacao);


--
-- Name: cliente cliente_contato_cliente_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_contato_cliente_key UNIQUE (contato_cliente);


--
-- Name: cliente cliente_cpf_cliente_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_cpf_cliente_key UNIQUE (cpf_cliente);


--
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);


--
-- Name: consulta consulta_link_consulta_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta
    ADD CONSTRAINT consulta_link_consulta_key UNIQUE (link_consulta);


--
-- Name: consulta consulta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta
    ADD CONSTRAINT consulta_pkey PRIMARY KEY (id_consulta);


--
-- Name: usuario email_usuario_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT email_usuario_unique UNIQUE (email_usuario);


--
-- Name: empresa empresa_cnpj_empresa_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_cnpj_empresa_key UNIQUE (cnpj_empresa);


--
-- Name: empresa empresa_contato_empresa_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_contato_empresa_key UNIQUE (contato_empresa);


--
-- Name: empresa empresa_convenio_empresa_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_convenio_empresa_key UNIQUE (convenio_empresa);


--
-- Name: empresa empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_pkey PRIMARY KEY (id_empresa);


--
-- Name: pagamento pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagamento
    ADD CONSTRAINT pagamento_pkey PRIMARY KEY (id_pagamento);


--
-- Name: psicologo psicologo_contato_psicologo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psicologo
    ADD CONSTRAINT psicologo_contato_psicologo_key UNIQUE (contato_psicologo);


--
-- Name: psicologo psicologo_cpf_psicologo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psicologo
    ADD CONSTRAINT psicologo_cpf_psicologo_key UNIQUE (cpf_psicologo);


--
-- Name: psicologo psicologo_crp_psicologo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psicologo
    ADD CONSTRAINT psicologo_crp_psicologo_key UNIQUE (crp_psicologo);


--
-- Name: psicologo psicologo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psicologo
    ADD CONSTRAINT psicologo_pkey PRIMARY KEY (id_psicologo);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: usuario usuario_email_usuario_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_usuario_key UNIQUE (email_usuario);


--
-- Name: usuario usuario_google_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_google_id_key UNIQUE (google_id);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: avaliacao trg_atualizador_avaliacao; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_atualizador_avaliacao AFTER INSERT OR DELETE OR UPDATE ON public.avaliacao FOR EACH ROW EXECUTE FUNCTION public.atualizador_avaliacao();


--
-- Name: agenda trg_calculo_preco_final; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_calculo_preco_final BEFORE INSERT OR UPDATE ON public.agenda FOR EACH ROW EXECUTE FUNCTION public.calculo_preco_final();


--
-- Name: agenda trg_verificacao_conflito_agenda; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_verificacao_conflito_agenda BEFORE INSERT OR UPDATE ON public.agenda FOR EACH ROW EXECUTE FUNCTION public.verificacao_conflito_agenda();


--
-- Name: avaliacao avaliacao_avaliacao_psicologo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT avaliacao_avaliacao_psicologo_fkey FOREIGN KEY (avaliacao_psicologo) REFERENCES public.psicologo(id_psicologo);


--
-- Name: cliente cliente_convenio_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_convenio_cliente_fkey FOREIGN KEY (convenio_cliente) REFERENCES public.empresa(convenio_empresa);


--
-- Name: cliente cliente_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.usuario(id_usuario);


--
-- Name: consulta consulta_id_cliente_consultado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta
    ADD CONSTRAINT consulta_id_cliente_consultado_fkey FOREIGN KEY (id_cliente_consultado) REFERENCES public.cliente(id_cliente);


--
-- Name: consulta consulta_id_consulta_agendada_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta
    ADD CONSTRAINT consulta_id_consulta_agendada_fkey FOREIGN KEY (id_consulta_agendada) REFERENCES public.agenda(id_agenda);


--
-- Name: consulta consulta_id_psicologo_responsavel_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consulta
    ADD CONSTRAINT consulta_id_psicologo_responsavel_fkey FOREIGN KEY (id_psicologo_responsavel) REFERENCES public.psicologo(id_psicologo);


--
-- Name: empresa empresa_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.usuario(id_usuario);


--
-- Name: agenda fk_agenda_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT fk_agenda_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: agenda fk_agenda_psicologo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT fk_agenda_psicologo FOREIGN KEY (id_psicologo) REFERENCES public.psicologo(id_psicologo) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cliente fk_convenio_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_convenio_cliente FOREIGN KEY (convenio_cliente) REFERENCES public.empresa(convenio_empresa) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cliente fk_id_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_id_cliente FOREIGN KEY (id_cliente) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: empresa fk_id_empresa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT fk_id_empresa FOREIGN KEY (id_empresa) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: psicologo fk_id_psicologo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psicologo
    ADD CONSTRAINT fk_id_psicologo FOREIGN KEY (id_psicologo) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: psicologo psicologo_id_psicologo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psicologo
    ADD CONSTRAINT psicologo_id_psicologo_fkey FOREIGN KEY (id_psicologo) REFERENCES public.usuario(id_usuario);


--
-- PostgreSQL database dump complete
--

\unrestrict 9yE53aH7Nknp7rhftTpDO8uWKagh2oqMQGvMlRcdNu6pWuBK4UfSWNUIVED72tM

