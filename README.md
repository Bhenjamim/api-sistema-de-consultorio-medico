![](https://i.imgur.com/xG74tOh.png)

# Desafio Alternativo Módulo 2 - Back-end

Você acabou de ser contratado pela melhor empresa de tecnologia do mundo: a **CUBOS**.
Sua primeira tarefa como programador é criar uma api para um Consultório Médico. Esse será um pojeto **MVP** (Produto Viável Mínimo), ou seja, em um futuro próximo outras funcionalidade surgirão para agragar ainda mais ao projeto, sendo assim os dados do banco (nomePaciente, consultório, etc.) serão imutáveis (estáticos).

Seu papel enquanto desenvolvedor será construir uma RESTful API que permita:

- Criar consulta médica
- Listar consultas médicas
- Atualizar os dados de uma consulta
- Excluir uma consulta médica
- Finalizar uma consulta médica
- Listar o laudo de uma consulta
- Listar as consultas que um médico atendeu

**Importante: Sempre que a validação de uma requisição falhar, responda com código de erro e mensagem adequada à situação, ok?**

**Exemplo**

```javascript
// Quando é informado que uma consulta não existe:
// HTTP Status
{
  "mensagem": "Consulta inexistente!"
}
```

## Persistências dos dados

Os dados serão persistidos em memória, no objeto existente dentro do arquivo `bancodedados.js`. **Todas as informações e consultas médicas deverão ser inseridas dentro deste objeto, seguindo a estrutura que já existe.**

### Estrutura do objeto no arquivo `bancodedados.js`

```javascript
{
  consultorio: {
    nome: "Cubos Healthcare",
    identificador: 1,
    cnes: "1001",
    senha: "CubosHealth@2022",
    medicos: [
      {
        identificador: 1,
        nome: "Bill",
        especialidade: "GERAL",
      },
      {
        identificador: 2,
        nome: "Irineu",
        especialidade: "ODONTOLOGIA"
      },
    ]
  },
  consultas: [
    // array de consultas médicas
  ],
  consultasFinalizadas: [
    // array de consultas finalizadas
  ],
  laudos: [
    // array de laudos médicos
  ]
}
```

## Requisitos obrigatórios

- Sua API deve seguir o padrão REST
- Seu código deve estar organizado, delimitando as responsabilidades de cada arquivo adequadamente. Ou seja, é esperado que ele tenha, no mínimo a seguinte estrutura:
  - src/
    - controladores/
      - **_seus controladores vão aqui_**
    - bancodedados.js
    - rotas.js
    - index.js
- Qualquer valor (dinheiro) deverá ser representado em centavos (Ex.: R$ 10,00 reais = 1000).
- Evite códigos duplicados. Antes de copiar e colar, pense se não faz sentido esse pedaço de código estar centralizado numa função.
- Quando o enunciado do end-point frizar o armazenamento em memória, o mesmo esta se referindo ao arquivo **_bancodedados.js_**, ou seja, a persistência deve ser feita no arquivo **_bancodedados.js_**.

## Status Code

Abaixo, listamos os possíveis **_status code_** esperados como resposta da API.

(Obs.): A lista abaixo são exemplos que **_podem_** ou **_não_** ser utilizados no projeto, ou seja, não se faz necessário o uso de todos.

```javascript
// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
// 500 (Internal Server Error) = falhas causadas pelo servidor
```

## Endpoints

### Listar consultas médicas

#### `GET` `/consultas?cnes_consultorio=1001&senha_consultorio=CubosHealth@2022`

Esse end-point deverá listar todas as consultas médicas.

- Você deverá, **OBRIGATORIAMENTE**:

  - Verificar se o cnes e a senha do consultório foram informados (passado como query params na url).
  - Validar se o cnes a senha do consultório estão corretos.

- **Requisição** - query params (Siga o padrão de nomenclatura)

  - cnes_consultorio
  - senha_consultorio

- **Resposta**
  - Listagem de todas as consultas.

#### Exemplo de resposta

```javascript
// HTTP Status 200 - Success
// 3 consultas encontradas
[
  {
    identificador: 1,
    tipoConsulta: "GERAL",
    identificadorMedico: 1,
    finalizada: true,
    valorConsulta: 3000,
    paciente: {
      nome: "John Doe",
      cpf: "55132392051",
      dataNascimento: "2022-02-02",
      celular: "11999997777",
      email: "john@doe.com",
      senha: "1234",
    },
  },
  {
    identificador: 3,
    tipoConsulta: "ODONTOLOGIA",
    identificadorMedico: 1,
    finalizada: false,
    valorConsulta: 5000,
    paciente: {
      nome: "John Doe 3",
      cpf: "55132392053",
      dataNascimento: "2022-02-02",
      celular: "11999997777",
      email: "john@doe3.com",
      senha: "1234",
    },
  },
];
```

```javascript
// Nenhuma consulta encontrada
// HTTP Status 204 - No Content
```

```javascript
// Senha do consultorio errada
// HTTP Status 401 - Unauthorized
{
  "mensagem": "Cnes ou senha inválidos!"
}
```

### Criar Consulta médica

#### `POST` `/consulta`

Esse endpoint deverá criar uma consulta médica, onde será gerado um identificador único para identificação da consulta (identicador da consulta).

- Você deverá, **OBRIGATORIAMENTE**:

  - Verificar se todos os campos foram informados (todos são obrigatórios) 
  - Verifica se o valor da consulta é numérico
  - Verificar se o CPF informado já não está vinculado a nenhuma consulta que não foi finalizada
  - Validar se o tipo da consulta informado consta nas especialidade dos médicos na base
  - Vincular o identificador do médico especializado que irá atender a consulta em questão no momento de criação da consulta
  - Definir _finalizada_ como false
  - Criar uma consulta médica cuja o identificador é único

- **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - tipoConsulta
  - valorConsulta
  - paciente
    - nome
    - cpf
    - dataNascimento
    - celular
    - email
    - senha

- **Resposta**

  Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
   Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição

```javascript
// POST /consulta
{
  "tipoConsulta": "ODONTOLOGIA",
  "valorConsulta": 5000,
  "paciente": {
    "nome": "John Doe 3",
    "cpf": "55132392053",
    "dataNascimento": "2022-02-02",
    "celular": "11999997777",
    "email": "john@doe3.com",
    "senha": "1234"
  }
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 204 - No Content
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
{
    "mensagem": "Já existe uma consulta em andamento com o cpf ou e-mail informado!"
}
```

### Atualizar informações da consulta médica

#### `PUT` `/consulta/:identificadorConsulta/paciente`

Esse endpoint deverá atualizar apenas os dados do paciente de uma consulta médica que não esteja finalizada.

- Você deverá, **OBRIGATORIAMENTE**:

  - Verificar se foi passado todos os campos no body da requisição
  - Verificar se o identificador da consulta passado como parametro na URL é válido
  - Se o CPF for informado, verificar se já existe outro registro com o mesmo CPF
  - Se o E-mail for informado, verificar se já existe outro registro com o mesmo E-mail
  - Verifica se a consulta não esta finalizada
  - Atualizar os dados do usuário de uma consulta médica

- **Requisição** - O corpo (body) deverá possuir um objeto com todas as seguintes propriedades (respeitando estes nomes):

  - nome
  - cpf
  - dataNascimento
  - celular
  - email
  - senha

- **Resposta**

  Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.
  Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição

```javascript
// PUT /consulta/:identificadorConsulta/paciente
{
  "nome": "John Doe",
  "cpf": "55132392051",
  "dataNascimento": "2022-02-02",
  "celular": "11999997777",
  "email": "john@doe.com",
  "senha": "1234"
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 204 - No Content
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
{
    "mensagem": "Cpf já consta na base!"
}
```

### Cancelar Consulta

#### `DELETE` `/consulta/:identificadorConsulta`

Esse endpoint deve cancelar uma consulta médica existente, esta consulta não pode estar _finalizada_.

- Você deverá, **OBRIGATORIAMENTE**:

  - Verificar se o identificador da consulta médica passado como parametro na URL é válido
  - Permitir excluir uma consulta apenas se _finalizada_ for igual a false
  - Remover a consulta do objeto de persistência de dados

- **Requisição**

  - Identificador da consulta (passado como parâmetro na rota)

- **Resposta**

  Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Resposta

```javascript
// HTTP Status 204 - No Content
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
{
  "mensagem": "A consulta só pode ser removida se a mesma não estiver finalizada"
}
```

### Finalizar uma consulta

#### `POST` `/consulta/finalizar`

Esse endpoint deverá finalizar uma consulta com um texto de laudo válido do médico e registrar esse laudo e essa consulta finalizada.

- Você deverá, **OBRIGATORIAMENTE**:

  - Verificar se foi passado todos os campos no body da requisição
  - Verificar se o identificador da consulta existe
  - Verificar se a consulta já esta finalizada
  - Verificar se o texto do médico possui um tamanho > 0 e <= 200 carácteres
  - Armazenar as informações do laudo na persistência de dados
  - Armazenar a consulta médica finalizada na persistência de dados

- **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - identificadorConsulta
  - textoMedico

- **Resposta**

  Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição

```javascript
// POST /consulta/finalizar
{
	"identificadorConsulta": 1,
	"textoMedico": "XPTO"
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 204 - No Content
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
{
    "mensagem": "O tamanho do textoMedico não está dentro do esperado"
}
```

#### Exemplo do registro de uma consulta médica finalizada

```javascript
{
  "identificador": 1,
  "tipoConsulta": "GERAL",
  "identificadorMedico": 1,
  "finalizada": true,
  "identificadorLaudo": 1,
  "valorConsulta": 3000,
  "paciente": {
    "nome": "John Doe",
    "cpf": "55132392051",
    "dataNascimento": "2022-02-02",
    "celular": "11999997777",
    "email": "john@doe.com",
    "senha": "1234"
   }
}
```

#### Exemplo do registro de um laudo

```javascript
{
  "identificador": 1,
  "identificadorConsulta": 3,
  "identificadorMedico": 2,
  "textoMedico": "XPTO",
  "paciente": {
     "nome": "John Doe",
     "cpf": "55132392051",
     "dataNascimento": "2022-02-02",
     "celular": "11999997777",
     "email": "john@doe.com",s
  }
}
```

### Laudo

#### `GET` `/consulta/laudo?identificador_consulta=1&senha=1234`

Esse endpoint deverá retornar informações do laudo de uma consulta junto as informações adicionais das entidades relacionadas aquele laudo.

- Você deverá, **OBRIGATORIAMENTE**:

  - Verificar se o identificador da consulta e a senha foram informados (passado como query params na url)
  - Verificar se a consulta médica informada existe
  - Verificar se a senha informada é uma senha válida
  - Verificar se existe um laudo para consulta informada
  - Exibir o laudo da consulta médica em questão junto as informações adicionais

- **Requisição** - query params

  - identificador_consulta
  - senha

- **Resposta**

  - Informações do laudo e das entidades relacionadas

#### Exemplo de Resposta

```javascript
// HTTP Status 200 - Success
{
  "identificador":1,
  "identificadorConsulta": 3,
  "identificadorMedico": 2,
  "textoMedico": "XPTO",
  "paciente": {
    "nome": "John Doe",
    "cpf": "55132392051",
    "dataNascimento": "2022-02-02",
    "celular": "11999997777",
    "email": "john@doe.com",
    "senha": "12345"
  }
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "Consulta médica não encontrada!"
}
```

### Médico

#### `GET` `/consultas/medico?identificador_medico=1`

Esse endpoint deverá retornar todas as consultas que um profissional **_atendeu_**, ou seja, finalizadas.

- Você deverá, **OBRIGATORIAMENTE**:

  - Verificar se o identificador do medico foi informado (passado como query params na url)
  - Verificar se o médico existe
  - Exibir as consultas vinculadas ao médico

- **Requisição** - query params

  - identificador_medico

- **Resposta**

  - Listagem das consultas vinculadas ao médico

#### Exemplo de Resposta

```javascript
// HTTP Status 200 - Success
[
  {
    identificador: 1,
    tipoConsulta: "GERAL",
    identificadorMedico: 1,
    finalizada: true,
    identificadorLaudo: 1,
    valorConsulta: 3000,
    paciente: {
      nome: "John Doe",
      cpf: "55132392051",
      dataNascimento: "2022-02-02",
      celular: "11999997777",
      email: "john@doe.com",
      senha: "1234",
    },
  },
  {
    identificador: 3,
    tipoConsulta: "GERAL",
    identificadorMedico: 1,
    finalizada: true,
    identificadorLaudo: 1,
    valorConsulta: 5000,
    paciente: {
      nome: "John Doe 3",
      cpf: "55132392053",
      dataNascimento: "2022-02-02",
      celular: "11999997777",
      email: "john@doe3.com",
      senha: "1234",
    },
  },
];
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "O médico informado não existe na base!"
}
```

## Aulas úteis:

-   [Rotas, Intermediários e Controladores](https://aulas.cubos.academy/turma/503b31f6-db13-4a79-8c3f-132b3d44e96f/aulas/ac35fd79-d5b9-4aae-8582-4579286ce15f)
-   [Aula API REST](https://aulas.cubos.academy/turma/503b31f6-db13-4a79-8c3f-132b3d44e96f/aulas/ecb7d0dc-9b7d-4a29-bf47-df73c1eb726f)
-   [Formatando datas com date-fns](https://aulas.cubos.academy/turma/503b31f6-db13-4a79-8c3f-132b3d44e96f/aulas/b9b9e316-1362-4cc0-ba7a-d91a82b7d105)
-   [Aula objetos](https://aulas.cubos.academy/turma/503b31f6-db13-4a79-8c3f-132b3d44e96f/aulas/f7f7cdf2-823d-4bc9-aa17-2413a4e120f0)
-   [Aula funções](https://aulas.cubos.academy/turma/503b31f6-db13-4a79-8c3f-132b3d44e96f/aulas/94475475-4560-4612-b74e-aba9d3a0ad12)
-   [Aula de Revisão](https://aulas.cubos.academy/turma/503b31f6-db13-4a79-8c3f-132b3d44e96f/aulas/048a88a1-0785-4c08-a984-b5b5382ea38f)

**LEMBRE-SE**: Feito é melhor do que perfeito, mas não faça mal feito!!!

###### tags: `back-end` `módulo 2` `nodeJS` `API REST` `desafio-alternativo`
