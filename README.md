# Unwrapped

**O Spotify Wrapped que nunca fecha.** Estatísticas completas de música disponíveis 365 dias por ano.

> Open source · MIT License · Self-hosted

---

## Features

- **Spotify Web API** — top tracks, artistas, tocando agora (OAuth 2.0 PKCE)
- **Last.fm** — histórico completo, scrobbles, play counts reais
- **Extended History** — upload do JSON do GDPR para análise profunda
- **Hábitos** — gráficos por hora do dia e dia da semana
- **Cards para compartilhar** — export PNG com cores dinâmicas do artista
- **3 idiomas** — pt-BR, en, es
- **Dark glassmorphism** — design futurista com aurora animado

---

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- Zustand · Recharts
- i18next · Lucide React · colorthief

---

## Rodar localmente

```bash
git clone <repo>
cd music-stats

cp .env.example .env
# Preencha as variáveis de ambiente (veja seções abaixo)

npm install
npm run dev
```

Acesse `http://localhost:5173`

---

## Configurar Spotify Developer App

1. Acesse [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Clique em **Create app**
3. Preencha:
   - **App name:** Unwrapped
   - **App description:** Music stats dashboard
   - **Redirect URIs:** `http://localhost:5173/callback`
   - **APIs:** Web API
4. Copie o **Client ID** para o `.env`:

```env
VITE_SPOTIFY_CLIENT_ID=seu_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

> **Importante:** a Redirect URI no painel do Spotify e no `.env` devem ser **idênticas**.
> O caminho `/callback` é onde o app processa o retorno do OAuth — ele precisa existir exatamente assim.

### Em produção

Adicione a URL de produção como Redirect URI no painel do Spotify (pode ter mais de uma cadastrada) e atualize o `.env`:

```env
VITE_SPOTIFY_REDIRECT_URI=https://seusite.com/callback
```

---

## Configurar Last.fm API

1. Acesse [last.fm/api/account/create](https://www.last.fm/api/account/create)
2. Preencha o formulário (qualquer nome de app serve)
3. O campo **Callback URL** pode ficar em branco — o app usa apenas leitura pública por username, sem redirecionamento OAuth
4. Copie a **API key** e **Shared secret** para o `.env`:

```env
VITE_LASTFM_API_KEY=sua_api_key
VITE_LASTFM_SHARED_SECRET=seu_shared_secret
```

> O usuário informa o próprio username do Last.fm diretamente no app. O app valida que o perfil existe e salva localmente — sem login, sem senha, sem redirecionamento.

---

## Como o fluxo OAuth funciona

O app usa **OAuth 2.0 PKCE** (sem backend necessário):

1. Usuário clica em "Conectar Spotify"
2. App gera um `code_verifier` e `code_challenge` locais
3. Browser redireciona para `accounts.spotify.com/authorize`
4. Após autorização, Spotify redireciona para `VITE_SPOTIFY_REDIRECT_URI?code=...`
5. App lê o `?code=` da URL, troca pelo access token diretamente com a API do Spotify
6. Tokens ficam salvos no `localStorage` via Zustand persist

O refresh de token acontece automaticamente sempre que o access token expirar.

---

## Upload do Extended Streaming History

1. Acesse [spotify.com/account/privacy](https://www.spotify.com/account/privacy)
2. Em **Privacy Settings**, clique em **Request your data**
3. Marque **Extended streaming history** e envie a solicitação
4. Aguarde o email com o link (pode levar até 30 dias)
5. Extraia o ZIP e faça upload dos arquivos `Streaming_History_Audio_*.json` na página de Upload

---

## Deploy no Railway

1. Faça fork/clone do repositório
2. Conecte ao [Railway](https://railway.app)
3. Crie um novo projeto a partir do repositório
4. Configure as variáveis de ambiente no painel do Railway:
   - `VITE_SPOTIFY_CLIENT_ID`
   - `VITE_SPOTIFY_REDIRECT_URI` → URL do Railway + `/callback` (ex: `https://unwrapped.up.railway.app/callback`)
   - `VITE_LASTFM_API_KEY`
   - `VITE_LASTFM_SHARED_SECRET`
5. Adicione essa mesma URL como Redirect URI no painel do Spotify Developer
6. O `railway.json` já está configurado — o deploy acontece automaticamente

---

## Self-host com Docker

```bash
cp .env.example .env
# Preencha as variáveis

docker-compose up -d
```

Acesse `http://localhost:3000`

Lembre de adicionar `http://localhost:3000/callback` como Redirect URI no painel do Spotify.

---

## Licença

MIT — use, modifique e distribua livremente.
