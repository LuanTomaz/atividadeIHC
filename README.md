# Atlas Local

## Proposta

O Atlas Local e um arquivo visual offline para cultivar uma colecao de jogos. Cada jogo aparece como uma semente dentro de uma estufa: o usuario observa formas, cores, posicoes e respostas visuais para inferir o que cada acionamento faz.

Esta e a proposta de funcionalidade do projeto: **arquivo de sementes digitais para organizar, adquirir, plantar e revisitar jogos**.

## Funcoes para o teste de inferencia

Os controles nao usam palavras, simbolos conhecidos ou icones convencionais na interface. Eles foram desenhados como formas organicas e geometricas, cada um com uma resposta perceptivel:

- orbita central: retornar a biblioteca;
- orbita aberta: visitar o catalogo;
- broto: criar uma nova entrada com titulo, descricao, genero, tamanho e imagem;
- lente coral: revelar e usar a busca;
- trilha de tres niveis: alternar as zonas de filtro;
- semente coral no card: adquirir um jogo do catalogo;
- seta dourada no card: plantar/instalar um jogo;
- circulo verde no card: emitir o sinal de execucao;
- recipiente escuro no card: remover o jogo da biblioteca.

Ao acionar uma funcao, a estufa muda, o contador e atualizado ou uma mensagem aparece no indicador superior. A compra, instalacao e remocao sao persistidas no navegador.

## Execucao offline

Abra `index.html` diretamente em um navegador. Nao ha backend, build ou dependencia obrigatoria de internet. Os dados da colecao ficam no `localStorage` do navegador e as capas iniciais estao em `assets/`.

## Hospedagem

[Abrir o sistema no GitHub Pages](https://luantomaz.github.io/atividadeIHC/)
