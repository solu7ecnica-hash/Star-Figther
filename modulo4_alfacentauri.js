// ========================================================
// 🌌 FERRATECH JOGOS - MÓDULO 4: MISSÃO ALFA CENTAURI (BASE)
// ========================================================

// Variáveis exclusivas da Missão Alfa Centauri (evita misturar com os outros módulos)
let inimigosAlfaCentauri = [];
let velocidadeCenarioAlfaCentauri = 6;
let tempoUltimoInimigoAlfaCentauri = 0;

/**
 * Função chamada quando o jogador clica no botão Alfa Centauri na Sala de Comando
 */
function iniciarMissaoAlfaCentauri() {
    console.log("Iniciando Módulo 4: Missão Alfa Centauri");
    
    // 1. Alterna o estado do jogo para o loop ler este módulo (agora padronizado em maiúsculo)
    estadoJogo = "JOGANDO_ALFACENTAURI"; 
    
    // 2. Prepara o ambiente limpando os restos de código do Módulo 1
    tiros.length = 0;
    batedores.length = 0;
    asteroides.length = 0;
    m_tiros_especiais.length = 0;
    
    // 3. Restaura a vida do Comandante Mauro para o novo desafio
    x_jogador.vida = x_jogador.vidaMax;
    
    // 4. Centraliza a nave na tela para começar a nova missão
    x_jogador.x = canvas.width / 2 - x_jogador.largura / 2;
    x_jogador.y = painel.y - x_jogador.altura - 30;

    // Se quiser mudar o fundo do jogo para a nova missão, descomente a linha abaixo:
    // imgFundo.src = "fundo_alfacentauri.jpg"; 

    alert("Módulo 4: Missão Alfa Centauri Inicializada!");
}

/**
 * Loop de lógica e física da Missão Alfa Centauri
 */
function atualizarAlfaCentauri(ts) {
    // 1. Movimentação básica do fundo das estrelas (reaproveitando o seu vetor)
    estrelasFundo.forEach(est => {
        est.y += est.vel * 1.5; // Estrelas passam mais rápido em Alfa Centauri!
        if(est.y > canvas.height) { 
            est.y = -10; 
            est.x = Math.random() * canvas.width; 
        }
    });

    // 2. Lógica dos controles do jogador (copiada da sua mecânica do Módulo 1)
    if (x_jogador.movendoEsquerda && x_jogador.x > 0) x_jogador.x -= x_jogador.velocidad;
    if (x_jogador.movendoDireita && x_jogador.x < canvas.width - x_jogador.largura) x_jogador.x += x_jogador.velocidad;
    if (x_jogador.movendoCima && x_jogador.y > 0) x_jogador.y -= x_jogador.velocidad;
    if (x_jogador.movendoBaixo && x_jogador.y < painel.y - x_jogador.altura) x_jogador.y += x_jogador.velocidad;

    // 3. Movimentação dos tiros disparados em Alfa Centauri
    for (let i = tiros.length - 1; i >= 0; i--) {
        tiros[i].y -= tiros[i].vel;
        if (tiros[i].y + 25 < 0) tiros.splice(i, 1);
    }

    // [AQUI CRIAREMOS A LOGICA DE INIMIGOS EXCLUSIVOS DE ALFA CENTAURI DEPOIS]
}

/**
 * Loop de renderização (desenho) da Missão Alfa Centauri
 */
function desenharAlfaCentauri(ctx) {
    // 1. Desenha o fundo preto profundo espacial
    ctx.fillStyle = "#020208";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Desenha as estrelas piscantes correndo
    ctx.fillStyle = "#fff";
    estrelasFundo.forEach(est => {
        ctx.fillRect(est.x, est.y, est.tamanho, est.tamanho);
    });

    // 3. Desenha os tiros do jogador
    ctx.fillStyle = "#00ffcc"; // Tiros cianos em Alfa Centauri!
    tiros.forEach(t => {
        ctx.fillRect(t.x, t.y, t.largura, t.altura);
    });

    // 4. Desenha a nave do Comandante Mauro
    if (imgNave.complete) {
        ctx.drawImage(imgNave, x_jogador.x, x_jogador.y, x_jogador.largura, x_jogador.altura);
    }
}