// ========================================================
// 🌌 FERRATECH JOGOS - MÓDULO 3: PEGASUS (BASE)
// ========================================================

// Variáveis exclusivas da Missão Pegasus (evita misturar com os outros módulos)
let inimigosPegasus = [];
let velocidadCenarioPegasus = 6;
let tempoUltimoInimigoPegasus = 0;

/**
 * Função chamada quando o jogador clica no botão Pegasus na Sala de Comando
 */
function iniciarMissaoPegasus() {
    console.log("Iniciando Módulo 3: Missão Pegasus");
    
    // 1. Alterna o estado do jogo para o loop ler este módulo
    estadoJogo = "JOGANDO_PEGASUS"; 
    
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
    // imgFundo.src = "fundo_pegasus.jpg"; 

    alert("Módulo 3: Missão Pegasus Inicializada!");
}

/**
 * Loop de lógica e física da Missão Pegasus
 */
function atualizarPegasus(ts) {
    // 1. Movimentação básica do fundo das estrelas (reaproveitando o seu vetor)
    estrelasFundo.forEach(est => {
        est.y += est.vel * 1.5; // Estrelas passam mais rápido em Pegasus!
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

    // 3. Movimentação dos tiros disparados em Pegasus
    for (let i = tiros.length - 1; i >= 0; i--) {
        tiros[i].y -= tiros[i].vel;
        if (tiros[i].y + 25 < 0) tiros.splice(i, 1);
    }

    // [AQUI CRIAREMOS A LOGICA DE INIMIGOS EXCLUSIVOS DE PEGASUS DEPOIS]
}

/**
 * Loop de renderização (desenho) da Missão Pegasus
 */
function desenharPegasus(ctx) {
    // 1. Desenha o fundo preto profundo espacial
    ctx.fillStyle = "#020208";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Desenha as estrelas piscantes correndo
    ctx.fillStyle = "#fff";
    estrelasFundo.forEach(est => {
        ctx.fillRect(est.x, est.y, est.tamanho, est.tamanho);
    });

    // 3. Desenha os tiros do jogador
    ctx.fillStyle = "#00ffcc"; // Tiros cianos em Pegasus!
    tiros.forEach(t => {
        ctx.fillRect(t.x, t.y, t.largura, t.altura);
    });

    // 4. Desenha a nave do Comandante Mauro
    if (imgNave.complete) {
        ctx.drawImage(imgNave, x_jogador.x, x_jogador.y, x_jogador.largura, x_jogador.altura);
    }
}
