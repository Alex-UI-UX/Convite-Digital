# Convite Digital - Aniversário One Piece 🏴‍☠️

Convite digital interativo para festas infantis, com tema **One Piece / Piratas**. Projeto open-source feito com Next.js, MongoDB e deploy gratuito na Vercel.

## Funcionalidades

- **Página pública** — convite single-page, mobile-first, com visual temático pirata
- **Confirmação de presença** — "Eu vou" / "Não vou", com campo de nome e acompanhantes dinâmicos
- **Controle de duplicidade** — resposta salva no localStorage para evitar confirmações duplicadas
- **Recados** — visitantes podem deixar mensagens para o aniversariante
- **Mapa** — Google Maps embed integrado com localização do evento
- **Painel admin** — gerenciar convidados, recados e informações do evento
- **Autenticação** — login com credenciais via NextAuth.js

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **TailwindCSS v4**
- **MongoDB** (Mongoose)
- **NextAuth.js** (autenticação)
- **Lucide React** (ícones)
- **Vercel** (deploy)

## Pré-requisitos

- Node.js 18+
- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free Tier)
- Conta na [Vercel](https://vercel.com) (para deploy)

## Instalação

```bash
# Clone o repositório
git clone https://github.com/Alex-UI-UX/Convite-Digital.git
cd Convite-Digital

# Instale as dependências
npm install

# Copie o arquivo de variáveis de ambiente
cp .env.example .env.local
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz com:

```env
MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster.mongodb.net/convite?retryWrites=true&w=majority
NEXTAUTH_SECRET=sua-chave-secreta-aqui
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@convite.com
ADMIN_PASSWORD=sua-senha-admin
```

> Para gerar o `NEXTAUTH_SECRET`: `openssl rand -base64 32`

## Rodando localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver o convite.

Painel admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Deploy na Vercel

1. Faça push do projeto para o GitHub
2. Importe o repositório na [Vercel](https://vercel.com)
3. Adicione as variáveis de ambiente (mesmas do `.env.local`)
4. Clique em **Deploy**

## Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Página pública do convite
│   ├── layout.tsx            # Layout raiz
│   ├── globals.css           # Estilos globais (tema pirata)
│   ├── admin/
│   │   ├── page.tsx          # Dashboard admin
│   │   ├── login/page.tsx    # Login admin
│   │   └── layout.tsx        # Layout admin (SessionProvider)
│   └── api/
│       ├── event/route.ts    # CRUD do evento
│       ├── guests/route.ts   # Confirmações de presença
│       ├── messages/route.ts # Recados
│       └── auth/[...nextauth]/route.ts
├── components/
│   ├── FixedBottomButton.tsx # Botão fixo inferior
│   ├── ConfirmModal.tsx      # Modal de confirmação
│   ├── RecadosSection.tsx    # Seção de recados
│   └── SessionProvider.tsx   # Wrapper NextAuth
├── models/                   # Schemas Mongoose
│   ├── Event.ts
│   ├── Guest.ts
│   └── Message.ts
└── lib/
    └── mongodb.ts            # Conexão MongoDB
```

## Personalização

Para adaptar o convite para outra festa:

1. Troque as imagens em `public/img/` (cartaz, divisor, wanted)
2. Edite os dados placeholder em `src/app/page.tsx` ou use o painel admin
3. Ajuste as cores no `globals.css` (variáveis CSS `:root`)

## Licença

Projeto open-source. Use e adapte livremente para seus eventos!
