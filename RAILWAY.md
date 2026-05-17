# Deploy and Host Unwrapped on Railway

**Unwrapped** é um dashboard open source de estatísticas musicais — o “Spotify Wrapped” que nunca fecha. Conecte Spotify, Last.fm, faça upload do histórico estendido e visualize hábitos, tops e cards para compartilhar (pt-BR, en, es).

**Available languages:** pt, en, es.

![Unwrapped — landing page](https://raw.githubusercontent.com/jorgehenrrique/proj-frontend-music-stats/main/.github/images/landing-page.png)

## About Hosting Unwrapped

Unwrapped roda como site estático em container Docker — sem backend de autenticação. O login Spotify acontece no navegador; os tokens ficam apenas no dispositivo do usuário.

Ao usar este template, a redirect URI do Spotify é configurada automaticamente (`https://${{RAILWAY_PUBLIC_DOMAIN}}/callback`). Você só precisa cadastrar a mesma URL no painel do Spotify após o deploy. As demais credenciais você informa ao clicar em **Deploy**.

**Ordem recomendada:** gerar as API keys → fazer deploy com as 3 variáveis → copiar a URL pública do Railway → adicionar a Redirect URI no Spotify.

![Unwrapped — dashboard](https://raw.githubusercontent.com/jorgehenrrique/proj-frontend-music-stats/main/.github/images/dashboard-overview.png)

## Common Use Cases

- Hospedar sua própria instância do Unwrapped
- Compartilhar estatísticas sem depender de serviços fechados
- Self-host com controle dos seus dados
- Deploy rápido para demo ou portfolio

## Dependencies for Unwrapped Hosting

- Conta no [Railway](https://railway.app)
- App no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Chaves no [Last.fm API](https://www.last.fm/api/account/create)
- Spotify pode requerer Premium para usar a API em modo de desenvolvimento.

### Deployment Dependencies

- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- [Last.fm — criar API account](https://www.last.fm/api/account/create)
- [Spotify — solicitar Extended History](https://www.spotify.com/account/privacy) _(opcional, para upload de histórico)_

### Implementation Details

Ao clicar em **Deploy**, preencha estas variáveis (obtenha-as **antes** do deploy):

| Variável                    | Onde obter                                  |
| --------------------------- | ------------------------------------------- |
| `VITE_SPOTIFY_CLIENT_ID`    | Spotify Developer → seu app → **Client ID** |
| `VITE_LASTFM_API_KEY`       | Last.fm API account → **API Key**           |
| `VITE_LASTFM_SHARED_SECRET` | Last.fm API account → **Shared secret**     |

A variável `VITE_SPOTIFY_REDIRECT_URI` já vem definida no template e não precisa ser alterada manualmente.

---

## Antes do deploy

### Spotify — Client ID

1. Acesse [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard).
2. **Create app** → preencha nome e descrição → marque **Web API**.
3. Em **Redirect URIs**, você pode deixar em branco por enquanto e adicionar depois do deploy.
4. Copie o **Client ID** — será usado no deploy.

### Last.fm — API Key e Shared Secret

1. Acesse [last.fm/api/account/create](https://www.last.fm/api/account/create).
2. Preencha o formulário (nome do app à sua escolha).
3. **Callback URL** pode ficar em branco.
4. Copie **API Key** e **Shared secret** — serão usados no deploy.

---

## Deploy

1. Clique em **Deploy** no template.
2. Informe as 3 variáveis quando solicitado:
   - `VITE_SPOTIFY_CLIENT_ID`
   - `VITE_LASTFM_API_KEY`
   - `VITE_LASTFM_SHARED_SECRET`
3. Aguarde o deploy concluir.

---

## Depois do deploy — Redirect URI no Spotify

1. No Railway, copie o domínio público gerado (ex.: `unwrapped-production.up.railway.app`).
2. Monte a Redirect URI no formato:
   ```
   https://<seu-dominio-railway>/callback
   ```
   Exemplo: `https://unwrapped-production.up.railway.app/callback`
3. No [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), abra seu app → **Settings** → **Redirect URIs** → adicione essa URL e salve.

A URL no Spotify deve ser **idêntica** à que o template usa (`https` + domínio + `/callback`).

Pronto — abra o site, conecte o Spotify e use o app.

---

## Spotify + Last.fm (recomendado)

O Unwrapped usa o Spotify para tops e dados atuais, mas a API do Spotify **não expõe** histórico completo nem contagens reais de reprodução. O **Last.fm** guarda cada música que você escuta (scrobbles) e libera na interface totais de plays, histórico longo e gráficos mais fiéis.

Para isso funcionar bem, vincule o Spotify **no Last.fm** (não só no Unwrapped). Assim, tudo que você ouvir no Spotify passa a ser registrado no seu perfil Last.fm.

### 1. Conta e scrobbling no Last.fm

1. Crie ou entre na sua conta em [last.fm](https://www.last.fm/join).
2. Conecte o Spotify em uma destas opções:
   - [last.fm/settings/applications](https://www.last.fm/settings/applications) → **Spotify Scrobbling** → **Connect**
   - ou [last.fm/about/trackmymusic](https://www.last.fm/about/trackmymusic) → **Spotify** → **Connect**
3. Autorize o Last.fm a acessar sua conta Spotify.

A partir daí, as reproduções no Spotify (app, web, etc.) são salvas automaticamente no Last.fm. Quanto mais tempo com o scrobbling ativo, mais rico fica o histórico no Unwrapped.

### 2. No Unwrapped

1. Abra seu site no Railway e clique em **Conectar Spotify**.
2. Na mesma tela, em **Last.fm**, informe seu **username** do Last.fm (o mesmo da conta que conectou ao Spotify) e confirme.

![Conectar integrações no Unwrapped](https://raw.githubusercontent.com/jorgehenrrique/proj-frontend-music-stats/main/.github/images/connect-integrations.png)

O app só lê dados públicos do seu perfil — não pede senha do Last.fm. Sem o username, o dashboard ainda funciona, mas plays e histórico ficam limitados ao que o Spotify permite.

---

## Checklist

- [ ] Client ID do Spotify e chaves do Last.fm obtidos **antes** do deploy
- [ ] Deploy feito com as 3 variáveis preenchidas
- [ ] URL pública do Railway copiada
- [ ] Redirect URI `https://<dominio>/callback` cadastrada no Spotify
- [ ] Login Spotify testado no site
- [ ] Spotify conectado ao Last.fm (scrobbling ativo)
- [ ] Username do Last.fm informado no Unwrapped

---

## Why Deploy Unwrapped on Railway?

Railway is a singular platform to deploy your infrastructure stack. Railway will host your infrastructure so you don't have to deal with configuration, while allowing you to vertically and horizontally scale it.

By deploying Unwrapped on Railway, you are one step closer to supporting a complete full-stack application with minimal burden. Host your servers, databases, AI agents, and more on Railway.

---

## Licença

MIT — use, modifique e distribua livremente.
