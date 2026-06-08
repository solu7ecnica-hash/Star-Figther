// ========================================================================
// 🌌 FERRATECH JOGOS - MÓDULO 2: MISSÃO ORION (VERSÃO REVISADA)
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
    fotoMauro: { x: 0, y: 0, escala: 0, angulo: 0, alvoX: 0 },
    fotoInimigo: { x: 0, y: 0, escala: 0, angulo: 0, alvoX: 0 },
    alphaTexto: 0, // Opacidade das escritas
    alphaX: 0      // Opacidade do "X"
};

/**
 * Função chamada quando o jogador clica no botão Orion na Sala de Comando
 */
function iniciarMissaoOrion() {
    console.log("Iniciando Módulo 2: Missão Orion");
    
    // 1. Força o estado que o HTML principal já lê para manter o motor ativo
    estadoJogo = "JOGANDO_ORION"; 
    
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

    // 5. Configura a Animação Cinematográfica - NASCIMENTO UNIFICADO NO CENTRO
    animacaoOrion.timer = 0;
    animacaoOrion.alphaTexto = 0;
    animacaoOrion.alphaX = 0;
    
    let centroX = canvas.width / 2;
    let centroY = canvas.height / 2 - 40;

    // Ambas as fotos nascem exatamente nas coordenadas do centro e com escala ZERO
    animacaoOrion.fotoMauro = { 
        x: centroX, 
        y: centroY, 
        escala: 0.0, 
        angulo: 0, 
        alvoX: canvas.width * 0.23 // Destino final: Lado Esquerdo
    };
    
    animacaoOrion.fotoInimigo = { 
        x: centroX, 
        y: centroY, 
        escala: 0.0, 
        angulo: 0, 
        alvoX: canvas.width * 0.77 // Destino final: Lado Direito
    };
} // CORREÇÃO: Chave de fechamento que estava faltando e quebrando o código!

/** * CLASSE DOS INIMIGOS MENORES (Aranhas batedor_3)
 */
class Batedor3Orion {
    constructor() {
        this.largura = 45;
        this.altura = 45;
        this.x = Math.random() * (canvas.width - this.largura);
        this.y = -50;
        this.velocidade = 2 + Math.random() * 2;
        this.timerTiro = Math.random() * 50;
        
        this.img = new Image();
        this.img.src = "batedor_3.png";
    }

    atualizar() {
        this.y += this.velocidade;
        
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
        this.y = -220; 
        this.vidaMax = 150;
        this.vida = this.vidaMax;
        this.velocidadeX = 3;
        this.timerAtaque = 0;
        
        this.img = new Image();
        this.img.src = "aranha1x.png";
    }

    atualizar() {
        if (this.y < 80) {
            this.y += 1.5;
            return;
        }

        this.x += this.velocidadeX;
        if (this.x <= 20 || this.x >= canvas.width - this.largura - 20) {
            this.velocidadeX *= -1;
        }

        this.timerAtaque++;

        if (this.timerAtaque % 120 === 0) {
            this.atirarRajadaTripla();
        }

        if (this.timerAtaque % 270 === 0) {
            this.lancarTeiasVetoriais();
        }
    }

    atirarRajadaTripla() {
        let centroX = this.x + this.largura / 2;
        let baseY = this.y + this.altura - 20;

        tirosInimigosOrion.push({ x: centroX - 20, y: baseY, largura: 8, altura: 18, velY: 6, velX: -2 });
        tirosInimigosOrion.push({ x: centroX, y: baseY, largura: 8, altura: 18, velY: 7, velX: 0 });
        tirosInimigosOrion.push({ x: centroX + 20, y: baseY, largura: 8, altura: 18, velY: 6, velX: 2 });
    }

    lancarTeiasVetoriais() {
        let centroX = this.x + this.largura / 2;
        let baseY = this.y + this.altura - 10;

        teiasOrion.push({ x: centroX, y: baseY, raio: 15, velX: 0, velY: 5 });
        teiasOrion.push({ x: centroX, y: baseY, raio: 15, velX: -3, velY: 4 });
        teiasOrion.push({ x: centroX, y: baseY, raio: 15, velX: 3, velY: 4 });
    }

    desenhar(ctx) {
        if (this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.largura, this.altura);
        } else {
            ctx.fillStyle = "#701c1c";
            ctx.fillRect(this.x, this.y, this.largura, this.altura);
        }

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
 * CONTROLADOR CINEMATOGRÁFICO DE TRANSIÇÃO (LINHA DE TEMPO)
 */
function gerenciarIntroOrion() {
    animacaoOrion.timer++;

    // Movimentação e Rotação: Afastando do centro e expandindo
    // 1. Comandante Mauro viaja para a ESQUERDA e gira no sentido anti-horário
    if (animacaoOrion.fotoMauro.x > animacaoOrion.fotoMauro.alvoX) {
        animacaoOrion.fotoMauro.x -= 4;
        animacaoOrion.fotoMauro.escala = Math.min(1, animacaoOrion.fotoMauro.escala + 0.02);
        animacaoOrion.fotoMauro.angulo -= 0.07;
    }

    // 2. Aranha Ameaça viaja para a DIREITA e gira no sentido horário
    if (animacaoOrion.fotoInimigo.x < animacaoOrion.fotoInimigo.alvoX) {
        animacaoOrion.fotoInimigo.x += 4;
        animacaoOrion.fotoInimigo.escala = Math.min(1, animacaoOrion.fotoInimigo.escala + 0.02);
        animacaoOrion.fotoInimigo.angulo += 0.07;
    }

    // 3. Quando as fotos se fixam nos alvos (por volta do frame 80), o "X" corta o centro
    if (animacaoOrion.timer > 80) {
        animacaoOrion.alphaX = Math.min(1, animacaoOrion.alphaX + 0.05);
    }

    // 4. Em seguida, os letreiros surgem em degradê suave de opacidade
    if (animacaoOrion.timer > 120) {
        animacaoOrion.alphaTexto = Math.min(1, animacaoOrion.alphaTexto + 0.04);
    }
}

function desenharIntroOrion(ctx) {
    // Cortina preta translúcida por cima das estrelas correndo ao fundo
    ctx.fillStyle = "rgba(0, 0, 0, 0.82)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Renderizar Foto do Comandante Mauro (Lado Esquerdo)
    ctx.save();
    ctx.translate(animacaoOrion.fotoMauro.x, animacaoOrion.fotoMauro.y);
    ctx.rotate(animacaoOrion.fotoMauro.angulo);
    let largM = 160 * animacaoOrion.fotoMauro.escala;
    let altM = 160 * animacaoOrion.fotoMauro.escala;
    if (imgIntroMauro.complete) {
        ctx.drawImage(imgIntroMauro, -largM / 2, -altM / 2, largM, altM);
    } else {
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(-largM / 2, -altM / 2, largM, altM);
    }
    ctx.restore();

    // Renderizar Foto da Aranha (Lado Direito)
    ctx.save();
    ctx.translate(animacaoOrion.fotoInimigo.x, animacaoOrion.fotoInimigo.y);
    ctx.rotate(animacaoOrion.fotoInimigo.angulo);
    let largA = 160 * animacaoOrion.fotoInimigo.escala;
    let altA = 160 * animacaoOrion.fotoInimigo.escala;
    if (imgIntroAranha.complete) {
        ctx.drawImage(imgIntroAranha, -largA / 2, -altA / 2, largA, altA);
    } else {
        ctx.fillStyle = "#ff0055";
        ctx.fillRect(-largA / 2, -altA / 2, largA, altA);
    }
    ctx.restore();

    // Renderizar o grande Confronto "X" (Corta por cima dos limites se necessário)
    if (animacaoOrion.alphaX > 0) {
        ctx.save();
        ctx.globalAlpha = animacaoOrion.alphaX;
        ctx.font = "bold 90px sans-serif";
        ctx.fillStyle = "#ff0000";
        ctx.textAlign = "center";
        ctx.shadowBlur = 25;
        ctx.shadowColor = "#ff0000";
        ctx.fillText("X", canvas.width / 2, canvas.height / 2 + 15);
        ctx.restore();
    }

    // Textos Oficiais de Missão solicitados
    if (animacaoOrion.alphaTexto > 0) {
        ctx.save();
        ctx.globalAlpha = animacaoOrion.alphaTexto;
        ctx.textAlign = "center";
        
        // Linha 1: Nome Principal
        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "#00ffcc";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00ffcc";
        ctx.fillText("MISSÃO ÓRION", canvas.width / 2, canvas.height - 135);
        
        // Linha 2: O subtítulo do grupo inimigo
        ctx.font = "18px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 0;
        ctx.fillText("(Os Aracnídeos do Espaço)", canvas.width / 2, canvas.height - 100);
        
        // Linha 3: O lema de defesa
        ctx.font = "italic bold 16px sans-serif";
        ctx.fillStyle = "#ffcc00";
        ctx.fillText("Proteger a Via Láctea", canvas.width / 2, canvas.height - 60);
        ctx.restore();
    }
}

/**
 * Loop de lógica e física da Missão Orion
 */
function atualizarOrion(ts) {
    // 1. Sempre movimenta as estrelas ao fundo para criar a sensação de velocidade contínua
    estrelasFundo.forEach(est => {
        est.y += est.vel * 2.0; 
        if(est.y > canvas.height) { 
            est.y = -10; 
            est.x = Math.random() * canvas.width; 
        }
    });

    // TRAVA DE INTRODUÇÃO: Se o cronômetro da animação não bateu o tempo (280 frames = ~4.5 seg), congela a física do jogo
    if (animacaoOrion.timer < 280) {
        gerenciarIntroOrion();
        return; 
    }

    // --- DAQUI PARA BAIXO SÓ EXECUTA APÓS O FIM DA INTRODUÇÃO ---

    if (jogadorParalizado) {
        timerParalisia--;
        if (timerParalisia <= 0) {
            jogadorParalizado = false;
        }
    }

    // Controles normais da nave
    if (!jogadorParalizado) {
        if (x_jogador.movendoEsquerda && x_jogador.x > 0) x_jogador.x -= x_jogador.velocidad;
        if (x_jogador.movendoDireita && x_jogador.x < canvas.width - x_jogador.largura) x_jogador.x += x_jogador.velocidad;
        if (x_jogador.movendoCima && x_jogador.y > 0) x_jogador.y -= x_jogador.velocidad;
        if (x_jogador.movendoBaixo && x_jogador.y < painel.y - x_jogador.altura) x_jogador.y += x_jogador.velocidad;
    }

    // Movimentação dos tiros amigáveis
    for (let i = tiros.length - 1; i >= 0; i--) {
        tiros[i].y -= tiros[i].vel;
        if (tiros[i].y + 25 < 0) tiros.splice(i, 1);
    }

    // Geração controlada de ondas de batedores até atingir a cota de 50 abates
    if (abatidosOrion < 50 && bossMaeAranha === null) {
        if (inimigosOrion.length < 17 && Math.random() < 0.04) {
            inimigosOrion.push(new Batedor3Orion());
        }
    } else if (bossMaeAranha === null) {
        bossMaeAranha = new MaeAranhaBoss();
        inimigosOrion.length = 0; 
    }

    // Atualização das ações dos batedores comuns
    for (let i = inimigosOrion.length - 1; i >= 0; i--) {
        let aranha = inimigosOrion[i];
        aranha.atualizar();

        if (aranha.y > painel.y) {
            inimigosOrion.splice(i, 1);
            continue;
        }

        for (let j = tiros.length - 1; j >= 0; j--) {
            if (tiros[j].x < aranha.x + aranha.largura &&
                tiros[j].x + tiros[j].largura > aranha.x &&
                tiros[j].y < aranha.y + aranha.altura &&
                tiros[j].y + tiros[j].altura > aranha.y) {
                
                abatidosOrion++;
                inimigosOrion.splice(i, 1);
                tiros.splice(j, 1);
                break;
            }
        }
    }

    // Monitoramento do comportamento do Chefão
    if (bossMaeAranha) {
        bossMaeAranha.atualizar();

        for (let j = tiros.length - 1; j >= 0; j--) {
            if (tiros[j].x < bossMaeAranha.x + bossMaeAranha.largura &&
                tiros[j].x + tiros[j].largura > bossMaeAranha.x &&
                tiros[j].y < bossMaeAranha.y + bossMaeAranha.altura &&
                tiros[j].y + tiros[j].altura > bossMaeAranha.y) {
                
                bossMaeAranha.vida -= 1;
                tiros.splice(j, 1);

                if (bossMaeAranha.vida <= 0) {
                    alert("Vitória Gloriosa! A Mãe Aranha de Orion foi destruída pelo Comandante Mauro!");
                    estadoJogo = "SALA_CONTROLE"; 
                    bossMaeAranha = null;
                    return;
                }
                break;
            }
        }
    }

    // Movimentação de projéteis inimigos
    for (let k = tirosInimigosOrion.length - 1; k >= 0; k--) {
        let tInimigo = tirosInimigosOrion[k];
        tInimigo.y += (tInimigo.velY !== undefined) ? tInimigo.velY : tInimigo.vel;
        if (tInimigo.velX !== undefined) tInimigo.x += tInimigo.velX;

        if (tInimigo.y > painel.y || tInimigo.x < 0 || tInimigo.x > canvas.width) {
            tirosInimigosOrion.splice(k, 1);
            continue;
        }

        if (tInimigo.x < x_jogador.x + x_jogador.largura &&
            tInimigo.x + tInimigo.largura > x_jogador.x &&
            tInimigo.y < x_jogador.y + x_jogador.altura &&
            tInimigo.y + tInimigo.altura > x_jogador.y) {
            
            x_jogador.vida -= 10;
            tirosInimigosOrion.splice(k, 1);

            if (x_jogador.vida <= 0) {
                alert("Sua nave desintegrou no quadrante de Orion! Fim de Jogo.");
                estadoJogo = "SALA_CONTROLE";
            }
        }
    }

    // Comportamento vetorial expansivo das teias do Boss
    for (let m = teiasOrion.length - 1; m >= 0; m--) {
        let teia = teiasOrion[m];
        teia.x += teia.velX;
        teia.y += teia.velY;
        teia.raio += 0.15; 

        if (teia.y > painel.y || teia.x < -50 || teia.x > canvas.width + 50) {
            teiasOrion.splice(m, 1);
            continue;
        }

        let centroNaveX = x_jogador.x + x_jogador.largura / 2;
        let centroNaveY = x_jogador.y + x_jogador.altura / 2;
        let distancia = Math.hypot(centroNaveX - teia.x, centroNaveY - teia.y);

        if (distancia < teia.raio + x_jogador.largura / 3) {
            jogadorParalizado = true;
            timerParalisia = 120; 
            teiasOrion.splice(m, 1); 
            console.log("Comandante Mauro preso na teia!");
        }
    }
}

/**
 * Loop de renderização (desenho) da Missão Orion
 */
function desenharOrion(ctx) {
    // 1. Limpa a tela com o tom escuro do espaço profundo
    ctx.fillStyle = "#020208";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Desenha o fundo estelar móvel
    ctx.fillStyle = "#ffffff";
    estrelasFundo.forEach(est => {
        ctx.fillRect(est.x, est.y, est.tamanho, est.tamanho);
    });

    // INTERCEPTAÇÃO GRÁFICA: Se a intro estiver rodando, desenha ela por cima e barra a jogabilidade
    if (animacaoOrion.timer < 280) {
        desenharIntroOrion(ctx);
        return; 
    }

    // 3. Desenha os tiros disparados (Cianos)
    ctx.fillStyle = "#00ffcc"; 
    tiros.forEach(t => {
        ctx.fillRect(t.x, t.y, t.largura, t.altura);
    });

    // 4. Renderização geométrica das Teias de Aranha do Boss via Canvas
    teiasOrion.forEach(teia => {
        ctx.save();
        ctx.strokeStyle = "rgba(230, 255, 200, 0.75)"; 
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#e6ffc8";
        
        ctx.beginPath();
        ctx.arc(teia.x, teia.y, teia.raio, 0, Math.PI * 2);
        
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            ctx.moveTo(teia.x, teia.y);
            ctx.lineTo(teia.x + Math.cos(a) * teia.raio, teia.y + Math.sin(a) * teia.raio);
        }
        ctx.stroke();
        ctx.restore();
    });

    // 5. Desenha os tiros das forças aracnídeas (Vermelhos)
    ctx.fillStyle = "#ff2222";
    tirosInimigosOrion.forEach(tInim => {
        ctx.fillRect(tInim.x, tInim.y, tInim.largura, tInim.altura);
    });

    // 6. Desenha as hordas de Aranhas Batedoras menores
    inimigosOrion.forEach(aranha => {
        aranha.desenhar(ctx);
    });

    // 7. Desenha o Boss Principal
    if (bossMaeAranha) {
        bossMaeAranha.desenhar(ctx);
    }

    // 8. Desenha a nave do Comandante Mauro
    if (imgNave.complete) {
        ctx.save();
        if (jogadorParalizado && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.4; // Efeito estroboscópico de travamento
        }
        ctx.drawImage(imgNave, x_jogador.x, x_jogador.y, x_jogador.largura, x_jogador.altura);
        ctx.restore();
    }

    // Painel tático superior esquerdo (HUD)
    if (bossMaeAranha === null) {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("Alvos para o Boss: " + abatidosOrion + " / 50", 20, 40);
    }
}
