# Ficha Ordem Paranormal — extensão para Owlbear Rodeo

## Como instalar (GitHub Pages)

1. No GitHub, crie um repositório **público** chamado `ficha-ordem-paranormal` (na conta `pebarrosdenashor`).
2. Envie para a raiz dele os arquivos: `manifest.json`, `index.html`, `app.js`, `style.css`, `icon.svg`.
3. Em **Settings → Pages**, escolha *Deploy from a branch* → `main` → `/ (root)` e salve.
4. Espere 1–2 minutos e confira se abre: `https://pebarrosdenashor.github.io/ficha-ordem-paranormal/manifest.json`
5. No Owlbear Rodeo: **Perfil → Extensions → Add Extension**, cole o link do passo 4 e ative a extensão na sala.

> Usou outro nome de repositório ou de conta? Troque os dois links dentro do `manifest.json`.

## Como funciona

- Cada jogador cria a(s) própria(s) ficha(s) pelo botão **＋** e só vê as dele.
- O mestre vê suas fichas e as de todos os jogadores (agrupadas no seletor do topo) e pode editá-las; as mudanças voltam para o jogador.
- As fichas ficam salvas no navegador de cada pessoa, por sala. Use **⋯ → Exportar** para fazer backup (ou para levar a ficha a outro computador) e **Importar** para restaurar.
- O mestre recebe as fichas quando o jogador está conectado na sala (envio automático; também dá para usar **⋯ → Pedir fichas aos jogadores**).
- Clique na sigla de um atributo ou no 🎲 de uma perícia para rolar; o resultado aparece para todos da sala.
- **⤢** abre a ficha em tela grande.

## Observação

A sincronização usa as mensagens da sala do Owlbear. A interface esconde as fichas dos outros jogadores, mas os dados passam pelo navegador de todos os participantes, então não é um sigilo à prova de quem souber abrir as ferramentas de desenvolvedor.
