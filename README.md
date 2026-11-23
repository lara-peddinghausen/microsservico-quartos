# Microsserviço de Quartos

API REST desenvolvida com NestJS, Prisma e MySQL para gerenciar o catálogo de quartos de um hotel.

## Funcionalidades

- Cadastro e consulta de tipos de quarto
- Cadastro e consulta de quartos físicos
- Gerenciamento de comodidades
- Associação de comodidades e camas aos tipos de quarto
- Upload, consulta e exclusão de fotos
- Consulta de disponibilidade por período
- Integração autenticada com o microsserviço de Reservas
- Verificação de saúde da aplicação e do banco de dados
- Documentação Swagger

## Tecnologias

- Node.js 24
- NestJS
- TypeScript
- Prisma 7
- MySQL/MariaDB
- Vitest
- Swagger

## Pré-requisitos

- Node.js 24
- npm
- MySQL (ou MariaDB, se compatível com a configuração do projeto)
- HeidiSQL (opcional, para gerenciamento do banco de dados)

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Configure as variáveis em `.env`:

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | URL de conexão MySQL | `mysql://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO` |
| `RESERVAS_SERVICE_URL` | URL base do microsserviço de Reservas | `http://localhost:3002` |
| `INTERNAL_API_KEY` | Chave compartilhada entre microsserviços | Chave com pelo menos 32 caracteres |
| `PORT` | Porta da aplicação | `3000` |

Gere uma chave segura com:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Use a mesma chave no microsserviço de Reservas.

### 4. Configurar o Prisma

O projeto utiliza Prisma ORM para acessar o banco de dados MySQL.

**Gerar os modelos a partir do banco de dados existente (recomendado para este projeto)**

Como o banco de dados do projeto já está criado, é possível obter sua estrutura diretamente do MySQL.

```bash
npx prisma db pull
npx prisma generate
```

**Observação:** antes de executar os comandos, configure corretamente a conexão com o banco de dados no `.env`. O comando `prisma db pull` pode sobrescrever ajustes manuais feitos no `schema.prisma`, portanto revise as alterações antes de utilizá-lo.

## Executando

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3000`.

## Documentação

Após iniciar a aplicação, acesse a documentação interativa em:

`http://localhost:3000/docs`

## Principais endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica a aplicação e o banco |
| `GET` | `/comodidades` | Lista comodidades |
| `POST` | `/comodidades` | Cadastra uma comodidade |
| `GET` | `/comodidades/:id` | Consulta uma comodidade |
| `DELETE` | `/comodidades/:id` | Remove uma comodidade não vinculada |
| `GET` | `/tipos-quarto` | Lista tipos de quarto |
| `POST` | `/tipos-quarto` | Cadastra um tipo de quarto |
| `GET` | `/tipos-quarto/:id` | Consulta um tipo de quarto |
| `PATCH` | `/tipos-quarto/:id` | Atualiza um tipo de quarto |
| `GET` | `/tipos-quarto/disponiveis?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD` | Lista tipos disponíveis no período |
| `POST` | `/tipos-quarto/:id/fotos` | Adiciona uma foto |
| `GET` | `/tipos-quarto/:id/fotos/:fotoId` | Visualiza uma foto |
| `DELETE` | `/tipos-quarto/:id/fotos/:fotoId` | Remove uma foto |
| `GET` | `/quartos` | Lista quartos |
| `POST` | `/quartos` | Cadastra um quarto |
| `GET` | `/quartos/:id` | Consulta um quarto |
| `PATCH` | `/quartos/:id` | Atualiza um quarto |
| `GET` | `/quartos/disponiveis?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD` | Lista quartos disponíveis no período |

## Autenticação interna

A rota protegida `/quartos/disponiveis` exige o cabeçalho:

```http
x-internal-api-key: SUA_CHAVE_INTERNA
```

O mesmo cabeçalho é utilizado nas integrações realizadas pelo microsserviço com o serviço de Reservas.

## Testes

```bash
npm test
```

Testes com cobertura:

```bash
npm run test:cov
```

Testes end-to-end:

```bash
npm run test:e2e
```

## Qualidade

```bash
npm run build
```

## Estrutura principal

```text
src/
├── comodidades/       # CRUD de comodidades
├── quartos/           # CRUD e disponibilidade de quartos
├── tipos-quarto/      # CRUD, camas e fotos dos tipos de quarto
├── integracoes/       # Comunicação com o microsserviço de Reservas
├── common/            # Guards, pipes e utilitários
├── config/            # Validação das variáveis de ambiente
├── health/            # Verificação de saúde
└── prisma/            # Configuração do Prisma
prisma/
└── schema.prisma      # Modelos e enums do banco
```
