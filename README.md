# 🧠 PsyCool

Plataforma web de psicologia online que conecta pacientes e profissionais para consultas práticas, seguras e acessíveis.

## 📋 Objetivo

O PsyCool tem como objetivo oferecer uma plataforma web de fácil acesso para pacientes e profissionais da psicologia, permitindo a realização de consultas online de forma prática e organizada.

A plataforma é responsável por auxiliar no agendamento de consultas, gerenciamento de perfis profissionais e intermediação dos pagamentos realizados pelos pacientes.

O sistema busca facilitar o acesso à saúde mental, conectando pacientes a profissionais qualificados através de uma interface intuitiva e acessível.

## 🚀 Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) | Estrutura e marcação das páginas web |
| ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | Estilização e layout responsivo da interface |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | Lógica e interatividade no frontend e backend |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | Ambiente de execução server-side |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | Framework para criação da API REST (rotas e controllers) |
| ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=sequelize&logoColor=white) | ORM utilizado para comunicação com o banco de dados |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white) | Banco de dados relacional |
| ![Insomnia](https://img.shields.io/badge/Insomnia-4000BF?style=flat&logo=insomnia&logoColor=white) | Ferramenta utilizada para testar os endpoints da API |

## 🔀 Fluxo de uma Requisição

Todo dado que entra ou sai da API percorre o seguinte caminho, seguindo o padrão MVC:

```
                Usuário
         (faz a requisição)
                   |
                   |
                   |
                   |
                routes
     (direciona pro controller certo)
                   |
                   |
                   |
                   |
              controllers
    (executa a lógica e chama o banco)
                   |
                   |
                   |
                   |
                models
     (representa a tabela do banco)
                   |
          +--------+--------+
          |                 |
 +-----------------+  +-----------------+
 |    Sequelize    |  |    pg (node-    |
 |   (ORM usado    |  |   postgres)     |
 |   no projeto)   |  |  (SQL puro,     |
 |                 |  |  disponível no  |
 |                 |  |  projeto, mas   |
 |                 |  |  não utilizado  |
 |                 |  |  atualmente)    |
 +-----------------+  +-----------------+
          |                 |
          +--------+--------+
                   |
                   |
              PostgreSQL
    (executa o SQL e retorna o dado)
```
---

## ⚙️ Instalação e Execução

### Pré-requisitos

Antes de começar, instale as seguintes ferramentas:

1. **Node.js** (inclui o npm)
   - Baixe em: https://nodejs.org/ (recomendado a versão LTS)
   - Confirme a instalação no terminal:
```bash
     node -v
     npm -v
```

2. **PostgreSQL**
   - Baixe em: https://www.postgresql.org/download/
   - Durante a instalação, defina uma senha para o usuário `postgres` (anote-a, ela será usada na configuração do projeto)
   - Confirme a instalação abrindo o **pgAdmin** (interface gráfica que acompanha a instalação)

3. **Insomnia** (para testar a API)
   - Baixe em: https://insomnia.rest/download

4. **Git**
   - Baixe em: https://git-scm.com/downloads

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/Leoozln/PSYCOOL-BUCHA.git
cd PSYCOOL-BUCHA
```

**2. Instale as dependências do projeto**
```bash
npm install
```
Isso instala automaticamente Express, Sequelize, pg e demais bibliotecas listadas no `package.json`.

**3. Configure o banco de dados**
- Abra o pgAdmin e crie um banco de dados chamado `psycool`
- Verifique se as credenciais em `config/database.js` (usuário, senha, host) correspondem à sua instalação local do PostgreSQL

**4. Inicie o servidor**
```bash
node index.js
```
Se tudo estiver correto, o terminal deve exibir:

**5. Teste os endpoints**
- Abra o Insomnia
- Crie uma requisição para `http://localhost:3000/usuario` (ou outra entidade disponível)
- Confirme que a resposta retorna com status `200 OK`

---

## 👥 Integrantes do Grupo

| Nome |
|---|
| Alexandre Przybyszewski |
| Bruno de Paula Martins |
| Caio Willian Litka |
| Clayton dos Santos Alves |
| Guilherme Boesing |
| Leonardo de Lara Stechechen |

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
