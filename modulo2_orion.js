// ========================================================================
// 🌌 FERRATECH JOGOS - MÓDULO 2: MISSÃO ORION (COMPLETO)
// ========================================================================

// --- VARIÁVEIS EXCLUSIVAS DA MISSÃO ORION ---
let inimigosOrion = [];
let velocidadeCenarioOrion = 6;
let tempoUltimoInimigoOrion = 0;
let abatidosOrion = 0;             // Contador de batedores eliminados
let bossMaeAranha = null;          // Objeto do Chefão
let tirosInimigosOrion = [];       // Array de tiros das aranhas menores e da Chefe
let teiasOrion = [];               // Array de teias vetoriais lançadas pela Chefe

// --- SISTEMA DE PARALISIA DA TEIA ---
let jogadorParalizado = false;
let timerParalisia = 0;

// --- CARREGAMENTO DOS ASSETS DA INTRODUÇÃO ---
const imgIntroMauro = new Image();
imgIntroMauro.src = "mauro1x.png";

const imgIntroAranha = new Image();
imgIntroAranha.src = "aranha1x.png";

// --- CONTROLE DA ANIMAÇÃO DE INTRODUÇÃO ---
let animacaoOrion = {
    timer: 0,
    fotoMauro: { x: -150, y: 0, escala: 0.1, angulo: 0, alvoX: 0 },
    fotoInimigo: { x: 0, y: 0, escala: 0.1, angulo: 0, alvoX: 0 },
    alphaTexto: 0, // Opacidade das escritas
    alphaX: 0      // Opacidade do "X"
};

/**
 * Função chamada quando o jogador clica no botão Orion na Sala de Comando
 */
function iniciarMissaoOrion() {
    console.log("Iniciando Módulo 2: Missão Orion");
    
    // 1. Alterna o estado do jogo para rodar a Introdução primeiro
    estadoJogo = "INTRO_ORION"; 
    
    // 2. Prepara o ambiente limpando os restos de código e arrays anteriores
    tiros.length = 0;
    batedores.length = 0;
    asteroides.length = 0;
    m_tiros_especiais.length = 0;
    inimigosOrion.length = 0;
    tirosInimigosOrion.length = 0;
    teiasOrion.length = 0;
    abatidosOrion = 0;
    bossMaeAranha = null;
    jogadorParalizado = false;
    timerParalisia = 0;
    
    // 3. Restaura a vida do Comandante Mauro para o novo desafio
    x_jogador.vida = x_jogador.vidaMax;
    
    // 4. Centraliza a nave na tela para começar a nova missão
    x_jogador.x = canvas.width / 2 - x_jogador.largura / 2;
    x_jogador.y = painel.y - x_jogador.altura - 30;

    // 5. Configura posições iniciais dinâmicas da animação com base no tamanho do canvas
    animacaoOrion.timer = 0;
    animacaoOrion.alphaTexto = 0;
    animacaoOrion.alphaX = 0;
    
    animacaoOrion.fotoMauro = { 
        x: -200, 
        y: canvas.height / 2 - 20, 
        escala: 0.1, 
        angulo: 0, 
        alvoX: canvas.width * 0.22 
    };
    
    animacaoOrion.fotoInimigo = { 
        x: canvas.width + 200, 
        y: canvas.height / 2 - 20, 
        escala: 0.1, 
        angulo: 0, 
        alvoX: canvas.width * 0.78 
    };
}

/**
 * CLASSE DOS INIMIGOS MENORES (Aranhas batedor_3)
 */
class Batedor3Orion {
    constructor() {
        this.largura = 45;
        this.altura = 45;
        this.x = Math.random() * (canvas.width - this.largura);
        this.y = -50;
        this.velocidade = 2 + Math.random() * 2;
        this.timerTiro = Math.random() * 50;
        
        // Carrega a imagem nativa do batedor_3
        this.img = new Image();
        this.img.src = "batedor_3.png";
    }

    atualizar() {
        this.y += this.velocidade;
        
        // Comportamento de tiro idêntico ao sistema da primeira fase
        this.timerTiro++;
        if (this.timerTiro > 100) {
            tirosInimigosOrion.push({
                x: this.x + this.largura / 2 - 3,
                y: this.y + this.altura,
                largura: 6,
                altura: 15,
                vel: 5
            });
            this.timerTiro = 0;
        }
    }

    desenhar(ctx) {
        if (this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.largura, this.altura);
        } else {
            // Alternativa visual caso a imagem falhe
            ctx.fillStyle = "#a83232";
            ctx.fillRect(this.x, this.y, this.largura, this.altura);
        }
    }
}

/**
 * CLASSE DO CHEFÃO: MÃE ARANHA
 */
class MaeAranhaBoss {
    constructor() {
        this.largura = 220;
        this.altura = 190;
        this.x = canvas.width / 2 - this.largura / 2;
        this.y = -220; // Entrada dramática descendo de fora da tela
        this.vidaMax = 150;
        this.vida = this.vidaMax;
        this.velocidadeX = 3;
        this.timerAtaque = 0;
        
        this.img = new Image();
        this.img.src = "aranha1x.png";
    }

    atualizar() {
        // Entrada triunfal até Y = 80
        if (this.y < 80) {
            this.y += 1.5;
            return;
        }

        // Movimentação pendular inteligente (Direita / Esquerda)
        this.x += this.velocidadeX;
        if (this.x <= 20 || this.x >= canvas.width - this.largura - 20) {
            this.velocidadeX *= -1;
        }

        // Incrementa inteligência de ataque
        this.timerAtaque++;

        // 1. Rajada Tripla de Tiros de Plasma (A cada 2 segundos)
        if (this.timerAtaque % 120 === 0) {
            this.atirarRajadaTripla();
        }

        // 2. Lançamento de Teias Vetoriais Perpendiculares (A cada 4.5 segundos)
        if (this.timerAtaque % 270 === 0) {
            this.lancarTeiasVetoriais();
        }
    }

    atirarRajadaTripla() {
        let centroX = this.x + this.largura / 2;
        let baseY = this.y + this.altura - 20;

        // Tiro Esquerdo (Diagonal)
        tirosInimigosOrion.push({ x: centroX - 20, y: baseY, largura: 8, altura: 18, velY: 6, velX: -2 });
        // Tiro Central (Reto)
        tirosInimigosOrion.push({ x: centroX, y: baseY, largura: 8, altura: 18, velY: 7, velX: 0 });
        // Tiro Direito (Diagonal)
        tirosInimigosOrion.push({ x: centroX + 20, y: baseY, largura: 8, altura: 18, velY: 6, velX: 2 });
    }

    lancarTeiasVetoriais() {
        let centroX = this.x + this.largura / 2;
        let baseY = this.y + this.altura - 10;

        // Teia Direta (Centro Reto)
        teiasOrion.push({ x: centroX, y: baseY, raio: 15, velX: 0, velY: 5 });
        // Teia Perpendicular Esquerda
        teiasOrion.push({ x: centroX, y: baseY, raio: 15, velX: -3, velY: 4 });
        // Teia Perpendicular Direita
        teiasOrion.push({ x: centroX, y: baseY, raio: 15, velX: 3, velY: 4 });
    }

    desenhar(ctx) {
        if (this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.largura, this.altura);
        } else {
            ctx.fillStyle = "#701c1c";
            ctx.fillRect(this.x, this.y, this.largura, this.altura);
        }

        // Barra de Vida do Chefão no topo
        let largBarra = canvas.width * 0.7;
        let xBarra = canvas.width / 2 - largBarra / 2;
        ctx.fillStyle = "#333";
        ctx.fillRect(xBarra, 20, largBarra, 12);
        
        let largAtual = largBarra * (this.vida / this.vidaMax);
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(xBarra, 20, largAtual, 12);
        
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(xBarra, 20, largBarra, 12);
    }
}

/**
 * LOOP DE ANIMAÇÃO DE INTRODUÇÃO (A.S.H. FERRATECH)
 */
function gerenciarIntroOrion() {
    animacaoOrion.timer++;

    // 1. Movimentação e Rotação da foto do Comandante Mauro (Gira para a Esquerda)
    if (animacaoOrion.fotoMauro.x < animacaoOrion.fotoMauro.alvoX) {
        animacaoOrion.fotoMauro.x += 4;
        animacaoOrion.fotoMauro.escala = Math.min(1, animacaoOrion.fotoMauro.escala + 0.015);
        animacaoOrion.fotoMauro.angulo -= 0.06;
    }

    // 2. Movimentação e Rotação da ameaça Aranha (Gira para a Direita)
    if (animacaoOrion.fotoInimigo.x > animacaoOrion.fotoInimigo.alvoX) {
        animacaoOrion.fotoInimigo.x -= 4;
        animacaoOrion.fotoInimigo.escala = Math.min(1, animacaoOrion.fotoInimigo.escala + 0.015);
        animacaoOrion.fotoInimigo.angulo += 0.06;
    }

    // 3. Entrada suave das escritas textuais de missão
    if (animacaoOrion.timer > 40) {
        animacaoOrion.alphaTexto = Math.min(1, animacaoOrion.alphaTexto + 0.03);
    }

    // 4. Surgimento do grande sinal de confronto "X"
    if (animacaoOrion.timer > 90) {
        animacaoOrion.alphaX = Math.min(1, animacaoOrion.alphaX + 0.04);
    }

    // 5. Finaliza a animação de introdução e libera o gameplay real
    if (animacaoOrion.timer > 260) {
        estadoJogo = "JOGANDO_ORION";
    }
}

function desenharIntroOrion(ctx) {
    // Fundo preto puro espacial cinematográfico
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar Foto do Comandante Mauro com matriz rotacional
    ctx.save();
    ctx.translate(animacaoOrion.fotoMauro.x, animacaoOrion.fotoMauro.y);
    ctx.rotate(animacaoOrion.fotoMauro.angulo);
    let largM = 150 * animacaoOrion.fotoMauro.escala;
    let altM = 150 * animacaoOrion.fotoMauro.escala;
    if (imgIntroMauro.complete) {
        ctx.drawImage(imgIntroMauro, -largM / 2, -altM / 2, largM, altM);
    } else {
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(-largM / 2, -altM / 2, largM, altM);
    }
    ctx.restore();

    // Desenhar Foto da Aranha Inimiga
    ctx.save();
    ctx.translate(animacaoOrion.fotoInimigo.x, animacaoOrion.fotoInimigo.y);
    ctx.rotate(animacaoOrion.fotoInimigo.angulo);
    let largA = 150 * animacaoOrion.fotoInimigo.escala;
    let altA = 150 * animacaoOrion.fotoInimigo.escala;
    if (imgIntroAranha.complete) {
        ctx.drawImage(imgIntroAranha, -largA / 2, -altA / 2, largA, altA);
    } else {
        ctx.fillStyle = "#ff0055";
        ctx.fillRect(-largA / 2, -altA / 2, largA, altA);
    }
    ctx.restore();

    // Renderização do Confronto central "X"
    ctx.save();
    ctx.globalAlpha = animacaoOrion.alphaX;
    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "#ff0000";
    ctx.textAlign = "center";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff0000";
    ctx.fillText("X", canvas.width / 2, canvas.height / 2 + 20);
    ctx.restore();

    // Textos informativos inferiores da Missão solicitada
    ctx.save();
    ctx.globalAlpha = animacaoOrion.alphaTexto;
    ctx.textAlign = "center";
    
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = "#00ffcc";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffcc";
    ctx.fillText("MISSÃO ÓRION", canvas.width / 2, canvas.height - 120);
    
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 0;
    ctx.fillText("(Os Aracnídeos do Espaço)", canvas.width / 2, canvas.height - 90);
    
    ctx.font = "italic bold 16px sans-serif";
    ctx.fillStyle = "#ffcc00";
    ctx.fillText("Proteger a Via Láctea", canvas.width / 2, canvas.height - 50);
    ctx.restore();
}

/**
 * Loop de lógica e física da Missão Orion
 */
function atualizarOrion(ts) {
    // Se o estado atual for a animação, desvia o fluxo lógico
    if (estadoJogo === "INTRO_ORION") {
        gerenciarIntroOrion();
        return;
    }

    // --- CONTROLE DE RECONSTRUÇÃO DA PARALISIA DA TEIA ---
    if (jogadorParalizado) {
        timerParalisia--;
        if (timerParalisia <= 0) {
            jogadorParalizado = false;
        }
    }

    // 1. Movimentação básica do fundo das estrelas 
    estrelasFundo.forEach(est => {
        est.y += est.vel * 2.0; 
        if(est.y > canvas.height) { 
            est.y = -10; 
            est.x = Math.random() * canvas.width; 
        }
    });

    // 2. Lógica dos controles do jogador (Travados se o jogadorParalizado for true)
    if (!jogadorParalizado) {
        if (x_jogador.movendoEsquerda && x_jogador.x > 0) x_jogador.x -= x_jogador.velocidad;
        if (x_jogador.movendoDireita && x_jogador.x < canvas.width - x_jogador.largura) x_jogador.x += x_jogador.velocidad;
        if (x_jogador.movendoCima && x_jogador.y > 0) x_jogador.y -= x_jogador.velocidad;
        if (x_jogador.movendoBaixo && x_jogador.y < painel.y - x_jogador.altura) x_jogador.y += x_jogador.velocidad;
    }

    // 3. Movimentação dos tiros disparados pelo Comandante Mauro
    for (let i = tiros.length - 1; i >= 0; i--) {
        tiros[i].y -= tiros[i].vel;
        if (tiros[i].y + 25 < 0) tiros.splice(i, 1);
    }

    // 4. Gerenciamento do fluxo de Inimigos de Orion
    if (abatidosOrion < 50 && bossMaeAranha === null) {
        // Envia ondas até o limite estável de 17 aranhas batedoras simultâneas na tela
        if (inimigosOrion.length < 17 && Math.random() < 0.04) {
            inimigosOrion.push(new Batedor3Orion());
        }
    } else if (bossMaeAranha === null) {
        // Invocação imediata da Mãe Aranha quando os 50 batedores forem desintegrados
        bossMaeAranha = new MaeAranhaBoss();
        inimigosOrion.length = 0; // Limpa as sobras de batedores comuns
    }

    // Atualização dos batedores ativos
    for (let i = inimigosOrion.length - 1; i >= 0; i--) {
        let aranha = inimigosOrion[i];
        aranha.atualizar();

        // Se sair pela base inferior da área de combate, remove e reinjeta no topo
        if (aranha.y > painel.y) {
            inimigosOrion.splice(i, 1);
            continue;
        }

        // Colisão cirúrgica: Tiro do Comandante atingindo a Aranha Batedora
        for (let j = tiros.length - 1; j >= 0; j--) {
            if (tiros[j].x < aranha.x + aranha.largura &&
                tiros[j].x + tiros[j].largura > aranha.x &&
                tiros[j].y < aranha.y + aranha.altura &&
                tiros[j].y + tiros[j].altura > aranha.y) {
                
                // Explosão e abate computado
                abatidosOrion++;
                inimigosOrion.splice(i, 1);
                tiros.splice(j, 1);
                break;
            }
        }
    }

    // Atualização da inteligência e colisões com a Chefona
    if (bossMaeAranha) {
        bossMaeAranha.atualizar();

        // Tiros do Comandante infligindo dano na Aranha Gigante
        for (let j = tiros.length - 1; j >= 0; j--) {
            if (tiros[j].x < bossMaeAranha.x + bossMaeAranha.largura &&
                tiros[j].x + tiros[j].largura > bossMaeAranha.x &&
                tiros[j].y < bossMaeAranha.y + bossMaeAranha.altura &&
                tiros[j].y + tiros[j].altura > bossMaeAranha.y) {
                
                bossMaeAranha.vida -= 1; // Tira um ponto de vida
                tiros.splice(j, 1);

                if (bossMaeAranha.vida <= 0) {
                    alert("Vitória Gloriosa! A Mãe Aranha de Orion foi destruída pelo Comandante Mauro!");
                    estadoJogo = "SALA_CONTROLE"; // Retorna vitorioso para escolher nova rota
                    bossMaeAranha = null;
                    return;
                }
                break;
            }
        }
    }

    // 5. Movimentação e colisão de Tiros Inimigos (Menores e Boss)
    for (let k = tirosInimigosOrion.length - 1; k >= 0; k--) {
        let tInimigo = tirosInimigosOrion[k];
        
        // Aplica velocidade reta ou vetorial se possuir velX
        tInimigo.y += (tInimigo.velY !== undefined) ? tInimigo.velY : tInimigo.vel;
        if (tInimigo.velX !== undefined) tInimigo.x += tInimigo.velX;

        // Limpa tiro fora da tela
        if (tInimigo.y > painel.y || tInimigo.x < 0 || tInimigo.x > canvas.width) {
            tirosInimigosOrion.splice(k, 1);
            continue;
        }

        // Colisão do tiro atingindo a nave do jogador
        if (tInimigo.x < x_jogador.x + x_jogador.largura &&
            tInimigo.x + tInimigo.largura > x_jogador.x &&
            tInimigo.y < x_jogador.y + x_jogador.altura &&
            tInimigo.y + tInimigo.altura > x_jogador.y) {
            
            x_jogador.vida -= 10; // Causa dano estrutural à nave
            tirosInimigosOrion.splice(k, 1);

            if (x_jogador.vida <= 0) {
                alert("Sua nave desintegrou no quadrante de Orion! Fim de Jogo.");
                estadoJogo = "SALA_CONTROLE";
            }
        }
    }

    // 6. Física de movimentação e colisão das Teias de Aranha Vetoriais (Exclusivo Boss)
    for (let m = teiasOrion.length - 1; m >= 0; m--) {
        let teia = teiasOrion[m];
        teia.x += teia.velX;
        teia.y += teia.velY;
        teia.raio += 0.15; // A teia se expande em movimento vetorial!

        if (teia.y > painel.y || teia.x < -50 || teia.x > canvas.width + 50) {
            teiasOrion.splice(m, 1);
            continue;
        }

        // Cálculo de colisão por raio de proximidade com o centro da nave
        let centroNaveX = x_jogador.x + x_jogador.largura / 2;
        let centroNaveY = x_jogador.y + x_jogador.altura / 2;
        let distancia = Math.hypot(centroNaveX - teia.x, centroNaveY - teia.y);

        if (distancia < teia.raio + x_jogador.largura / 3) {
            // ATIVADO! Nave fica paralisada por 2 segundos completos (120 frames a 60fps)
            jogadorParalizado = true;
            timerParalisia = 120; 
            teiasOrion.splice(m, 1); 
            console.log("Comandante Mauro preso na teia! Controles travados!");
        }
    }
}

/**
 * Loop de renderização (desenho) da Missão Orion
 */
function desenharOrion(ctx) {
    // Se o estado for introdução, delega a renderização para a função da animação
    if (estadoJogo === "INTRO_ORION") {
        desenharIntroOrion(ctx);
        return;
    }

    // 1. Desenha o fundo preto profundo espacial de Orion
    ctx.fillStyle = "#020208";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Desenha as estrelas piscantes correndo velozes
    ctx.fillStyle = "#ffffff";
    estrelasFundo.forEach(est => {
        ctx.fillRect(est.x, est.y, est.tamanho, est.tamanho);
    });

    // 3. Desenha os tiros do Comandante Mauro (Cianos em Orion!)
    ctx.fillStyle = "#00ffcc"; 
    tiros.forEach(t => {
        ctx.fillRect(t.x, t.y, t.largura, t.altura);
    });

    // 4. Desenha as Teias Vetoriais geradas por computação gráfica no Canvas
    teiasOrion.forEach(teia => {
        ctx.save();
        ctx.strokeStyle = "rgba(230, 255, 200, 0.75)"; // Teia brilhante semitransparente
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#e6ffc8";
        
        // Desenho geométrico da estrutura da teia
        ctx.beginPath();
        ctx.arc(teia.x, teia.y, teia.raio, 0, Math.PI * 2);
        
        // Linhas internas cruzadas para dar efeito realista de aranha
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            ctx.moveTo(teia.x, teia.y);
            ctx.lineTo(teia.x + Math.cos(a) * teia.raio, teia.y + Math.sin(a) * teia.raio);
        }
        ctx.stroke();
        ctx.restore();
    });

    // 5. Desenha os Tiros Vermelhos das Aranhas
    ctx.fillStyle = "#ff2222";
    tirosInimigosOrion.forEach(tInim => {
        ctx.fillRect(tInim.x, tInim.y, tInim.largura, tInim.altura);
    });

    // 6. Desenha todas as Aranhas Batedoras comuns
    inimigosOrion.forEach(aranha => {
        aranha.desenhar(ctx);
    });

    // 7. Desenha a Chefona se ela estiver em campo
    if (bossMaeAranha) {
        bossMaeAranha.desenhar(ctx);
    }

    // 8. Desenha a nave do Comandante Mauro
    if (imgNave.complete) {
        ctx.save();
        // Se a nave estiver presa na teia, aplica um efeito visual piscante verde
        if (jogadorParalizado && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }
        ctx.drawImage(imgNave, x_jogador.x, x_jogador.y, x_jogador.largura, x_jogador.altura);
        ctx.restore();
    }

    // HUD indicador de progresso no topo esquerdo
    if (bossMaeAranha === null) {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("Alvos para o Boss: " + abatidosOrion + " / 50", 20, 40);
    }
}