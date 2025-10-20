// MÚSICAS E CATÁLOGOS DE EXEMPLO (usando links MP3 públicos para funcionar)
const BIBLIOTECA_ONLINE = [
    { id: 1, titulo: "Hit do Momento", artista: "Pop Star A", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", baixada: false, album: "A Era Digital", capa: "cover_A.jpg" },
    { id: 2, titulo: "Sinfonia Digital", artista: "Clássicos Dev", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", baixada: false, album: "Bits & Bytes", capa: "cover_B.jpg" },
    { id: 3, titulo: "Groove Responsivo", artista: "Mobile Beat", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", baixada: false, album: "A Era Digital", capa: "cover_A.jpg" },
];
let BIBLIOTECA_OFFLINE = []; 

// Catálogo Simulado para Busca Web (Simula vasto acervo externo)
const BIBLIOTECA_WEB_GRANDE = [
    ...BIBLIOTECA_ONLINE.map(f => ({ ...f, id: f.id + 100, titulo: f.titulo + " (Web)" })),
    { id: 104, titulo: "Web Search Result 1", artista: "Internet Band", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", album: "Grandes Descobertas", tipo: "mp3", capa: "cover_web1.jpg" },
    { id: 105, titulo: "Playlist do Verão", artista: "Vários", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", album: "Playlist", tipo: "playlist", capa: "cover_playlist.jpg" },
    { id: 106, titulo: "Álbum Completo", artista: "The Coders", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", album: "The Final Commit", tipo: "album", capa: "cover_album.jpg" },
];

let playlistAtual = [];
let indiceAtual = -1;

// ----------------------------------------------------
// 1. MÓDULO DE GERENCIAMENTO DE REDE
// ----------------------------------------------------
const networkManager = {
    isOnline: navigator.onLine,
    updateStatus: () => {
        networkManager.isOnline = navigator.onLine;
        const indicador = document.getElementById('indicador-conexao');
        indicador.textContent = networkManager.isOnline ? 'Online' : 'Offline';
        indicador.classList.toggle('status-online', networkManager.isOnline);
        
        const activeBtn = document.querySelector('.nav-buttons button.active');
        if (activeBtn) {
            carregarBiblioteca(activeBtn.id.replace('btn-', ''), activeBtn);
        }
    }
};

window.addEventListener('online', networkManager.updateStatus);
window.addEventListener('offline', networkManager.updateStatus);

// ----------------------------------------------------
// 5. MECANISMO DE REPRODUÇÃO (LÓGICA E PLAYLIST)
// ----------------------------------------------------
let isPlaying = false;
const player = document.getElementById('player-audio-simples');
const playPauseBtn = document.getElementById('play-pause-btn');

function reproduzirFaixa(id, modoOrigem) {
    let faixaParaTocar = 
        BIBLIOTECA_OFFLINE.find(f => f.id === id) || 
        BIBLIOTECA_ONLINE.find(f => f.id === id) || 
        BIBLIOTECA_WEB_GRANDE.find(f => f.id === id);

    if (!faixaParaTocar) {
        alert("Faixa não encontrada.");
        return;
    }

    let url = '';
    let fonte = '';
    
    // Lógica de prioridade: Offline > Online (Web ou Local)
    if (faixaParaTocar.baixada) {
        url = faixaParaTocar.url; 
        fonte = 'OFFLINE';
    } else if (networkManager.isOnline) {
        url = faixaParaTocar.url;
        fonte = 'ONLINE';
    } else {
         alert("Sem conexão para tocar esta faixa online. Baixe-a primeiro.");
         return;
    }

    player.src = url;
    player.play();
    isPlaying = true;
    
    document.getElementById('current-titulo').textContent = faixaParaTocar.titulo;
    document.getElementById('current-artista').textContent = `${faixaParaTocar.artista} (${fonte})`;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

player.addEventListener('ended', () => {
    if (indiceAtual < playlistAtual.length - 1) {
        indiceAtual++;
        const proximaFaixa = playlistAtual[indiceAtual];
        reproduzirFaixa(proximaFaixa.id, 'web'); 
    } else {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.getElementById('current-titulo').textContent = "Playlist Finalizada";
        document.getElementById('current-artista').textContent = "";
    }
});

function togglePlayPause() {
    if (player.src) {
        if (isPlaying) {
            player.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            player.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    }
}

function tocarPlaylist(lista, startIndex) {
    playlistAtual = lista;
    indiceAtual = startIndex;
    
    const faixa = playlistAtual[indiceAtual];
    const modo = faixa.baixada ? 'offline' : 'web'; 
    
    reproduzirFaixa(faixa.id, modo);
}

// ----------------------------------------------------
// BUSCADORES
// ----------------------------------------------------
function buscarNaWeb() {
    const termo = document.getElementById('campo-busca').value.toLowerCase().trim();
    const listaMusicas = document.getElementById('lista-musicas');
    listaMusicas.innerHTML = ''; 
    
    document.querySelectorAll('.nav-buttons button').forEach(btn => btn.classList.remove('active'));

    if (!networkManager.isOnline) {
         listaMusicas.innerHTML = '<p style="text-align: center; margin-top: 20px; color: #777;">Você precisa de conexão para buscar na Web.</p>';
         return;
    }
    
    if (termo.length < 2) {
        listaMusicas.innerHTML = '<p style="text-align: center; margin-top: 20px; color: #777;">Digite pelo menos 2 letras para buscar na Web.</p>';
        return;
    }

    // SIMULAÇÃO DE PESQUISA NA WEB
    const resultados = BIBLIOTECA_WEB_GRANDE.filter(faixa => 
        faixa.titulo.toLowerCase().includes(termo) ||
        faixa.artista.toLowerCase().includes(termo) ||
        (faixa.album && faixa.album.toLowerCase().includes(termo)) ||
        (faixa.tipo && faixa.tipo.toLowerCase().includes(termo))
    );

    listaMusicas.innerHTML = `<h3>Resultados da Web para "${termo}" (${resultados.length} encontrados)</h3>`;

    if (resultados.length === 0) {
        listaMusicas.innerHTML += '<p style="text-align: center; margin-top: 20px; color: #777;">Nenhum resultado encontrado na Web.</p>';
        return;
    }

    resultados.forEach((faixa, index) => {
        const tipo = faixa.tipo ? faixa.tipo.toUpperCase() : 'MÚSICA';
        const album = faixa.album ? faixa.album : 'Desconhecido';
        
        const item = document.createElement('div');
        item.className = 'faixa-item';
        item.innerHTML = `
            <div style="width: 40px; height: 40px; background-color: #333; margin-right: 10px; flex-shrink: 0; border-radius: 5px; background-image: url(${faixa.capa || 'placeholder.jpg'}); background-size: cover;"></div>
            <div class="faixa-info">
                <div class="faixa-titulo">${faixa.titulo}</div>
                <div class="faixa-artista">${faixa.artista} (${tipo} - ${album})</div>
            </div>
            <div class="faixa-botoes">
                <button class="btn-ouvir" onclick="tocarPlaylist(resultados, ${index})"><i class="fas fa-headphones"></i> Ouvir</button>
                ${!faixa.baixada ? `<button onclick="baixarFaixaWeb(${faixa.id})"><i class="fas fa-download"></i></button>` : ''}
            </div>
        `;
        listaMusicas.appendChild(item);
    });
}

function realizarBuscaLocal() {
    const termo = document.getElementById('campo-busca').value.toLowerCase().trim();
    const listaMusicas = document.getElementById('lista-musicas');
    listaMusicas.innerHTML = ''; 
    
    document.querySelectorAll('.nav-buttons button').forEach(btn => btn.classList.remove('active'));

    if (termo.length < 2) {
        listaMusicas.innerHTML = '<p style="text-align: center; margin-top: 20px; color: #777;">Digite pelo menos 2 letras para buscar localmente.</p>';
        return;
    }
    
    // Busca nas bibliotecas locais (ONLINE E OFFLINE)
    const todasFaixas = [...BIBLIOTECA_ONLINE, ...BIBLIOTECA_OFFLINE];
    const resultados = todasFaixas.filter(faixa => 
        faixa.titulo.toLowerCase().includes(termo) ||
        faixa.artista.toLowerCase().includes(termo)
    );

    listaMusicas.innerHTML = `<h3>Resultados Locais (${resultados.length} encontrados)</h3>`;
    if (resultados.length === 0) {
        listaMusicas.innerHTML += '<p style="text-align: center; margin-top: 20px; color: #777;">Nenhum resultado local encontrado.</p>';
        return;
    }
    
    // Renderiza o resultado local
    resultados.forEach((faixa, index) => {
        const modo = faixa.baixada ? 'offline' : 'online';
        const item = document.createElement('div');
        item.className = 'faixa-item';
        item.innerHTML = `
            <div class="faixa-info">
                <div class="faixa-titulo">${faixa.titulo} <small style="color: #777;">(${modo.toUpperCase()})</small></div>
                <div class="faixa-artista">${faixa.artista}</div>
            </div>
            <div class="faixa-botoes">
                <button class="btn-ouvir" onclick="tocarPlaylist(resultados, ${index})"><i class="fas fa-headphones"></i> Ouvir</button>
                ${!faixa.baixada ? `<button onclick="baixarFaixaLocal(${faixa.id})"><i class="fas fa-download"></i></button>` : ''}
            </div>
        `;
        listaMusicas.appendChild(item);
    });
}

// ----------------------------------------------------
// 2. e 3. MÓDULOS ONLINE/OFFLINE + RENDERIZAÇÃO
// ----------------------------------------------------
function carregarBiblioteca(modo, button) {
    document.getElementById('campo-busca').value = ''; 
    
    document.querySelectorAll('.nav-buttons button').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
    
    const listaMusicas = document.getElementById('lista-musicas');
    listaMusicas.innerHTML = ''; 

    let fonteDados = [];
    let tituloSecao = "";

    if (modo === 'online') {
        if (networkManager.isOnline) {
            const todasOnline = [...BIBLIOTECA_ONLINE, ...BIBLIOTECA_WEB_GRANDE.filter(f => !f.baixada && !BIBLIOTECA_ONLINE.some(b => b.id === f.id))];
            fonteDados = todasOnline.filter(f => !f.baixada);
            tituloSecao = "Catálogo Online (Streaming)";
        } else {
            listaMusicas.innerHTML = '<p style="text-align: center; margin-top: 20px; color: #777;">Sem conexão para ver o catálogo online.</p>';
            return;
        }
    } else { // modo === 'offline'
        fonteDados = BIBLIOTECA_OFFLINE;
        tituloSecao = "Músicas Baixadas";
    }
    
    if (fonteDados.length === 0) {
        listaMusicas.innerHTML = `<p style="text-align: center; margin-top: 20px; color: #777;">Nenhuma música nesta seção.</p>`;
        return;
    }

    listaMusicas.innerHTML = `<h3>${tituloSecao}</h3>`;
    
    fonteDados.forEach((faixa, index) => {
        const modoAtual = faixa.baixada ? 'offline' : 'online';
        const item = document.createElement('div');
        item.className = 'faixa-item';
        item.innerHTML = `
            <div class="faixa-info">
                <div class="faixa-titulo">${faixa.titulo}</div>
                <div class="faixa-artista">${faixa.artista}</div>
            </div>
            <div class="faixa-botoes">
                <button class="btn-ouvir" onclick="tocarPlaylist(fonteDados, ${index})"><i class="fas fa-headphones"></i> Ouvir</button>
                ${modoAtual === 'online' ? `<button onclick="baixarFaixaLocal(${faixa.id})"><i class="fas fa-download"></i></button>` : `<button onclick="removerFaixa(${faixa.id})"><i class="fas fa-trash"></i></button>`}
            </div>
        `;
        listaMusicas.appendChild(item);
    });
}

// ----------------------------------------------------
// 4. MÓDULO DE CACHE/DOWNLOAD
// ----------------------------------------------------
function baixarFaixaLocal(id) {
    if (!networkManager.isOnline) { alert("Conecte-se à internet para baixar esta faixa."); return; }
    const faixaIndex = BIBLIOTECA_ONLINE.findIndex(f => f.id === id);
    const faixa = BIBLIOTECA_ONLINE[faixaIndex];
    if (faixa.baixada) return;
    faixa.baixada = true;
    BIBLIOTECA_OFFLINE.push({ ...faixa, url_local: faixa.url });
    BIBLIOTECA_ONLINE.splice(faixaIndex, 1); 
    alert(`"${faixa.titulo}" baixada e disponível OFFLINE!`);
    carregarBiblioteca('online', document.getElementById('btn-online')); 
}

function baixarFaixaWeb(id) {
     if (!networkManager.isOnline) { alert("Conecte-se à internet para baixar esta faixa."); return; }
    const faixaIndex = BIBLIOTECA_WEB_GRANDE.findIndex(f => f.id === id);
    const faixa = BIBLIOTECA_WEB_GRANDE[faixaIndex];
    if (!faixa || faixa.baixada) return;
    faixa.baixada = true;
    BIBLIOTECA_OFFLINE.push({ ...faixa, url_local: faixa.url });
    alert(`"${faixa.titulo}" (da Web) baixada e disponível OFFLINE!`);
    buscarNaWeb(); 
}

function removerFaixa(id) {
    const faixaIndex = BIBLIOTECA_OFFLINE.findIndex(f => f.id === id);
    if (faixaIndex === -1) return;
    const faixaRemovida = BIBLIOTECA_OFFLINE[faixaIndex];
    BIBLIOTECA_OFFLINE.splice(faixaIndex, 1);
    faixaRemovida.baixada = false;
    delete faixaRemovida.url_local;

    if (faixaRemovida.id < 100) {
         BIBLIOTECA_ONLINE.push(faixaRemovida);
    } else {
         const webIndex = BIBLIOTECA_WEB_GRANDE.findIndex(f => f.id === faixaRemovida.id);
         if (webIndex !== -1) {
             BIBLIOTECA_WEB_GRANDE[webIndex].baixada = false;
         }
    }
    alert(`"${faixaRemovida.titulo}" removida dos downloads.`);
    carregarBiblioteca('offline', document.getElementById('btn-offline'));
}

// ----------------------------------------------------
// INICIALIZAÇÃO
// ----------------------------------------------------
networkManager.updateStatus();
carregarBiblioteca('online', document.getElementById('btn-online'));