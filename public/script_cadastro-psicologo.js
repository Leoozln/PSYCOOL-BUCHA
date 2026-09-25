const form = document.getElementById('form');
const resultado = document.getElementById('resultado');
const btnEnviar = document.getElementById('btnEnviar');


//<<<<FUNÇÕES ABAIXO UTILIZADAS NO CAMPO 'CRP' DO FORMULÁRIO>>>>

//Cria um ''ouvinte'' que é ativado sempre que alguem insere alguma informação no campo crp
document.getElementById('crp').addEventListener('input', (e) => {
  e.target.value = maskCRP(e.target.value);
});

function paraArray(valor) {
  return valor
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Essa função cria uma mascara no crp para adicionar a '/' automaticamente, ou seja, o usuario coloca apenas os digitos do crp
function maskCRP(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 8); // 2 dígitos + até 6 = máximo do banco
  if (digitos.length > 2) {
    return digitos.slice(0, 2) + '/' + digitos.slice(2);
  }
  return digitos;
}

//<<<<FUNÇÕES ACIMA UTILIZADAS NO CAMPO 'CRP' DO FORMULÁRIO>>>>

//<<<<FUNÇÕES ABAIXO UTILIZADAS NO CAMPO 'TELEFONE' DO FORMULÁRIO>>>>
// Essa função cria uma mascara automatica para preencher os parenteses e o '-' do campos, porem para o back, ele manda apenas os numeros
// Desta forma, fica visualmente mais agradavel e como o banco nao aceita outros caracteres, nao quebra a validação
function maskTelefone(valor) { 
  const digitos = valor.replace(/\D/g, '').slice(0, 11); // DDD (2) + 9 dígitos = 11 no total
  if (digitos.length > 7) {
    return digitos.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  } else if (digitos.length > 2) {
    return digitos.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else if (digitos.length > 0) {
    return digitos.replace(/^(\d{0,2})/, '($1');
  }
  return digitos;
}

document.getElementById('contato').addEventListener('input', (e) => {
  e.target.value = maskTelefone(e.target.value);
});

//<<<<FUNÇÕES ACIMA UTILIZADAS NO CAMPO 'TELEFONE' DO FORMULÁRIO>>>>

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const apiUrl = document.getElementById('apiUrl').value.trim();

  const payload = {
    nome_psicologo: document.getElementById('nome').value.trim(),
    crp_psicologo: document.getElementById('crp').value.trim(),
    contato_psicologo: document.getElementById('contato').value.replace(/\D/g, ''),
    genero_psicologo: document.getElementById('genero').value,
    data_nascimento_psicologo: document.getElementById('nascimento').value,
    especialidade_psicologo: paraArray(document.getElementById('especialidades').value),
    diploma_psicologo: paraArray(document.getElementById('diploma').value),
    descricao_psicologo: document.getElementById('descricao').value.trim() || null
  };

  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';
  resultado.className = '';
  resultado.style.display = 'none';

  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const dados = await resp.json();

    if (resp.ok) {
      resultado.className = 'ok';
      resultado.textContent = 'Cadastrado com sucesso!\n\n' + JSON.stringify(dados, null, 2);
      form.reset();
    } else {
      resultado.className = 'erro';
      resultado.textContent = 'Erro ao cadastrar (status ' + resp.status + '):\n\n' + JSON.stringify(dados, null, 2);
    }
  } catch (err) {
    resultado.className = 'erro';
    resultado.textContent = 'Falha na requisição: ' + err.message +
      '\n\nSe o erro for de CORS ou "Failed to fetch", confirme que o servidor Express está rodando e considere adicionar o middleware "cors" no index.js.';
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Cadastrar';
  }
});