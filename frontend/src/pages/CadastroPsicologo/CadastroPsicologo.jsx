import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import LayoutCadastro from '../../components/LayoutCadastro/LayoutCadastro';
import Select from '../../components/Select/Select';
import './cadastro-psicologo.css';
import { API_URL, api } from '../../services/api';

// Título e posição de cada etapa no indicador.
const ETAPAS = {
  google: { titulo: 'Cadastre-se gratuitamente', indice: 0 },
  dados: { titulo: 'Confirme seus dados', indice: 1 },
  docs: { titulo: 'Formação e atuação', indice: 2 }
};

// Os documentos abrem em outra aba para não perder o que já foi preenchido.
const NOVA_ABA = { target: '_blank', rel: 'noopener noreferrer' };

// Exige ao menos um caractere que não seja espaço.
const PADRAO_NAO_VAZIO = '.*\\S.*';

// Separa um texto em uma lista, usando a vírgula como separador.
function paraArray(valor) {
  return valor
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// Aplica automaticamente a barra no campo CRP.
function maskCRP(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);

  if (digitos.length > 2) {
    return digitos.slice(0, 2) + '/' + digitos.slice(2);
  }

  return digitos;
}

// Aplica automaticamente parênteses e hífen no telefone.
function maskTelefone(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);

  if (digitos.length > 7) {
    return digitos.replace(
      /^(\d{2})(\d{5})(\d{0,4})/,
      '($1) $2-$3'
    );
  } else if (digitos.length > 2) {
    return digitos.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else if (digitos.length > 0) {
    return digitos.replace(/^(\d{0,2})/, '($1');
  }

  return digitos;
}

// Data mais recente permitida: o psicólogo precisa ter no mínimo 21 anos.
function dataMaximaNascimento() {
  const hoje = new Date();
  const limite = new Date(hoje.getFullYear() - 21, hoje.getMonth(), hoje.getDate());
  const mes = String(limite.getMonth() + 1).padStart(2, '0');
  const dia = String(limite.getDate()).padStart(2, '0');

  return `${limite.getFullYear()}-${mes}-${dia}`;
}

// Traduz alguns erros retornados pela API para mensagens mais claras.
function traduzirErro(status, dados) {
  if (status === 404) {
    return 'Registro não encontrado';
  }

  if (
    dados?.erro &&
    dados.erro.toLowerCase().includes('validation')
  ) {
    return 'Verifique os dados informados: pode haver um campo inválido ou já cadastrado.';
  }

  return 'Ocorreu um erro inesperado ao processar seu cadastro. Tente novamente em alguns instantes.';
}

function LogoGoogle() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function CadastroPsicologo() {
  // Guarda os valores preenchidos nos campos do formulário.

  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    cpf: '',
    crp: '',
    contato: '',
    genero: '',
    nascimento: '',
    especialidades: '',
    diploma: '',
    abordagem: '',
  });

  const usuario = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (usuario && usuario.cadastroPendente) {
        setFormulario((anterior) => ({
            ...anterior,
            nome: usuario.nome,
            email: usuario.email
        }));
    }
}, [usuario]);

  // Guarda a mensagem de resultado e seu tipo: sucesso ou erro.
  const [resultado, setResultado] = useState(null);

  // Informa se o formulário está sendo enviado.
  const [enviando, setEnviando] = useState(false);

  // Guarda se o checkbox do termo de adesão foi marcado
  const [aceiteTermo, setAceiteTermo] = useState(false);

  // Informa se a pessoa já passou da etapa de dados para a de formação.
  const [emDocs, setEmDocs] = useState(false);

  // Sem cadastro pendente não há dados do Google para confirmar.
  let etapa = 'google';

  if (usuario?.cadastroPendente) {
    etapa = emDocs ? 'docs' : 'dados';
  }

  // Atualiza somente o campo que foi alterado.
  function atualizarCampo(e) {
    const { id, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [id]: value
    }));
  }

  // Atualiza o CRP aplicando sua máscara.
  function atualizarCRP(e) {
    setFormulario((anterior) => ({
      ...anterior,
      crp: maskCRP(e.target.value)
    }));
  }

  // Atualiza o telefone aplicando sua máscara.
  function atualizarTelefone(e) {
    setFormulario((anterior) => ({
      ...anterior,
      contato: maskTelefone(e.target.value)
    }));
  }

  // Troca de etapa sem apagar o que já foi preenchido.
  function trocarEtapa(irParaDocs) {
    setResultado(null);
    setEmDocs(irParaDocs);
    window.scrollTo(0, 0);
  }

  // Encerra a sessão atual e volta para o login do Google.
  async function usarOutraConta() {
    setResultado(null);

    try {
      await api('/auth/logout', { method: 'POST' });
      window.location.href = API_URL + '/auth/google';
    } catch {
      setResultado({
        tipo: 'erro',
        mensagem:
          'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente em instantes.'
      });
    }
  }

  // O navegador só chega aqui com os campos visíveis válidos.
  function concluirEtapa(e) {
    if (etapa === 'dados') {
      e.preventDefault();
      trocarEtapa(true);
      return;
    }

    enviarFormulario(e);
  }

  // Executa quando o usuário envia o formulário.
  async function enviarFormulario(e) {
    e.preventDefault();

    setEnviando(true);
    setResultado(null);

    // Monta os dados no formato esperado pelo backend.
    const payload = {
      nome_psicologo: formulario.nome.trim(),
      cpf_psicologo: formulario.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4'),
      crp_psicologo: formulario.crp.trim(),
      contato_psicologo: formulario.contato.replace(/\D/g, ''),
      genero_psicologo: formulario.genero,
      data_nascimento_psicologo: formulario.nascimento,
      especialidade_psicologo: paraArray(formulario.especialidades),
      diploma_psicologo: paraArray(formulario.diploma),
      abordagem_psicologo: formulario.abordagem.trim(),
      aceite_termo: aceiteTermo
    };

    try {
      // Envia os dados para a API.
      const resp = await api('/cadastro/psicologo',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Tenta interpretar a resposta enviada pelo backend.
      let dados = {};

      try {
        dados = await resp.json();
      } catch {
        dados = {};
      }

      // Se a API responder com sucesso...
      if (resp.ok) {
        navigate('/cadastro/psicologo/enviado');
      } else {
      setResultado({
        tipo: 'erro',
        mensagem: traduzirErro(resp.status, dados)
      });
    }

    } catch {
      // Se não conseguir conectar com o servidor...
      setResultado({
        tipo: 'erro',
        mensagem:
          'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente em instantes.'
      });
    } finally {
      // Habilita o botão novamente, mesmo se houver erro.
      setEnviando(false);
    }
  }

  return (
    <LayoutCadastro titulo={ETAPAS[etapa].titulo} etapaAtual={ETAPAS[etapa].indice}>
      {etapa === 'google' && (
        <>
          <Button variante="google" href={API_URL + '/auth/google'} className="cadastro__google">
            <span className="cadastro__google-marca"><LogoGoogle /></span>
            <span className="cadastro__google-texto">Cadastre-se com o Google</span>
          </Button>

          <p className="cadastro__texto">
            Ao continuar, você concorda com os<br />
            <Link to="/termos-de-uso" className="cadastro__link" {...NOVA_ABA}>Termos de uso</Link>
            {' e a '}
            <Link to="/politica-de-privacidade" className="cadastro__link" {...NOVA_ABA}>Política de privacidade</Link>
          </p>

          <p className="cadastro__texto">
            Já tem uma conta?{' '}
            <a href={API_URL + '/auth/google'} className="cadastro__link">Conecte-se</a>
          </p>
        </>
      )}

      {etapa !== 'google' && (
        <form id="form" className="cadastro__formulario" onSubmit={concluirEtapa}>
          {etapa === 'dados' && (
            <div key="dados" className="cadastro__campos cadastro__campos--duplos">
              <Input
                label="Nome completo (como no seu registro do CRP)*"
                type="text"
                id="nome"
                value={formulario.nome}
                onChange={atualizarCampo}
                required
                minLength={4}
                pattern="[A-Za-zÀ-ú ]{4,256}"
                title="Use somente letras e espaços."
              />

              <Input
                label="E-mail"
                type="email"
                id="email"
                value={formulario.email}
                onChange={atualizarCampo}
                required
                readOnly
                title={formulario.email}
              />

              <Input
                label="CPF*"
                type="text"
                id="cpf"
                value={formulario.cpf}
                onChange={atualizarCampo}
                required
                placeholder="12345678910"
                maxLength={11}
                pattern="\d{11}"
                inputMode="numeric"
                title="Digite os 11 números do CPF, sem pontos ou traço."
              />

              <Input
                label="CRP*"
                type="text"
                id="crp"
                value={formulario.crp}
                onChange={atualizarCRP}
                required
                placeholder="06/123456"
                pattern="^\d{2}/\d{5,6}$"
                title="Formato: NN/NNNNN ou NN/NNNNNN."
              />

              <Input
                label="Telefone*"
                type="text"
                id="contato"
                value={formulario.contato}
                onChange={atualizarTelefone}
                required
                placeholder="(42) 92550-1234"
                pattern="^\(\d{2}\) \d{5}-\d{4}$"
                maxLength={16}
                title="Preencha o DDD e o número de telefone."
              />

              <Input
                label="Data de nascimento*"
                type="date"
                id="nascimento"
                value={formulario.nascimento}
                onChange={atualizarCampo}
                required
                max={dataMaximaNascimento()}
                title="É preciso ter no mínimo 21 anos."
              />

              <Select
                label="Gênero*"
                id="genero"
                className="cadastro__genero"
                value={formulario.genero}
                onChange={atualizarCampo}
                required
              >
                <option value="">Selecione</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
                <option value="OUTRO">Outro</option>
                <option value="PREFIRO NÃO INFORMAR">
                  Prefiro não informar
                </option>
              </Select>
            </div>
          )}

          {etapa === 'docs' && (
            <div key="docs" className="cadastro__campos">
              <Input
                label="Diplomas e titulações*"
                type="text"
                id="diploma"
                value={formulario.diploma}
                onChange={atualizarCampo}
                required
                pattern={PADRAO_NAO_VAZIO}
                placeholder="Ex.: Psicologia – UFPR, 2018"
                title="Informe ao menos um diploma. Separe por vírgula se houver mais de um."
              />

              <Input
                label="Especialidades*"
                type="text"
                id="especialidades"
                value={formulario.especialidades}
                onChange={atualizarCampo}
                required
                pattern={PADRAO_NAO_VAZIO}
                placeholder="Ex.: Ansiedade, Depressão"
                title="Informe ao menos uma especialidade. Separe por vírgula se houver mais de uma."
              />

              <Input
                label="Abordagem*"
                type="text"
                id="abordagem"
                value={formulario.abordagem}
                onChange={atualizarCampo}
                required
                pattern={PADRAO_NAO_VAZIO}
                maxLength={100}
                placeholder="Ex.: TCC, Psicanálise"
                title="Informe a sua abordagem."
              />

              <label className="cadastro__termo">
                <input
                  type="checkbox"
                  checked={aceiteTermo}
                  onChange={(e) => setAceiteTermo(e.target.checked)}
                  required
                />
                <span>
                  Li e aceito o{' '}
                  <Link to="/termo-de-adesao" className="cadastro__link" {...NOVA_ABA}>termo de adesão</Link>
                </span>
              </label>
            </div>
          )}

          {etapa === 'dados' && (
            <>
              <Button type="submit" className="cadastro__continuar">Continuar</Button>
              <p className="cadastro__texto">
                Não é você?{' '}
                <button type="button" className="cadastro__link" onClick={usarOutraConta}>
                  Usar outra conta Google
                </button>
              </p>
            </>
          )}

          {etapa === 'docs' && (
            <div className="cadastro__botoes">
              <Button variante="secundaria" onClick={() => trocarEtapa(false)}>Voltar</Button>
              <Button type="submit" id="btnEnviar" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar cadastro'}
              </Button>
            </div>
          )}
        </form>
      )}

      {resultado && (
        <p id="resultado" className="cadastro__erro" role="alert">
          {resultado.mensagem}
        </p>
      )}
    </LayoutCadastro>
  );
}

export default CadastroPsicologo;
