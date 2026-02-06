# Multiplayer Chess

App de xadrez P2P em HTML/CSS/JS puro com PeerJS. O tabuleiro e a lógica rodam no navegador e a comunicação acontece via WebRTC.

## Estrutura
- `INDEX.html`: UI e layout da página.
- `CSS/CSS.css`: tema e estilo.
- `JS/JS.js`: regras, turnos e comunicação.
- `JS/peer.min.js`: PeerJS local (sem CDN).

## Como rodar local (rápido)
1. Abra `INDEX.html` no navegador.
2. Para jogar em P2P, troque o ID com outra pessoa (cada um abre o arquivo no próprio navegador).

Observação:
- Sem configuração adicional, o PeerJS tenta usar o servidor padrão da cloud do PeerJS. Se quiser 100% independente, veja a seção abaixo.

## Local 100% independente (com seu PeerServer)
Você precisa de um servidor PeerJS e (idealmente) STUN/TURN próprios.

### 1) Suba um PeerServer
Opções comuns:
- Instalar globalmente o peerjs e rodar o server.
- Rodar o server em um container.

Exemplo simples (Node):
```bash
npm i -g peer
peerjs --port 9000 --path /peerjs
```

### 2) Aponte o front para o seu servidor
Adicione no `INDEX.html` antes de carregar `JS/JS.js`:
```html
<script>
  window.PEER_CONFIG = {
    host: location.hostname,
    port: 9000,
    path: "/peerjs",
    secure: false
  };
  window.ICE_SERVERS = [
    { urls: "stun:seu-stun.local:3478" },
    { urls: "turn:seu-turn.local:3478", username: "user", credential: "pass" }
  ];
</script>
```

## Produção
### Recomendado
- Hospede o `INDEX.html` e a pasta `CSS/` e `JS/` em um servidor estático (Nginx, S3, Netlify, etc.).
- Suba um PeerServer dedicado.
- Use STUN/TURN confiável para NATs mais restritos.

### Exemplo de deploy
1. **Front-end estático**
   - Copie `INDEX.html`, `CSS/` e `JS/` para o seu host.
2. **PeerServer**
   - Suba em uma VM/Container com HTTPS e WebSocket liberado.
3. **Config**
   - Defina `window.PEER_CONFIG` e `window.ICE_SERVERS` como no exemplo acima.

## Dicas
- Para testes locais com dois jogadores, abra duas abas/ navegações diferentes e use os IDs.
- O botão "Copiar meu ID" facilita o convite.

## Roadmap (não implementado)
- Relógio e controles de tempo.
- Chat dentro da partida.
- Revanche automática.
- Detecção completa de xeque-mate/empate.
