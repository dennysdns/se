// ... (resto do script.js acima)

// ----------------------------------------------------
// BUSCADORES
// ----------------------------------------------------
function buscarNaWeb() {
    const termo = document.getElementById('campo-busca').value.toLowerCase().trim();
    const listaMusicas = document.getElementById('lista-musicas');
    listaMusicas.innerHTML = ''; // Limpa a lista antes de buscar
    
    // Remove o botão ativo de navegação
    document.querySelectorAll('.nav-buttons button').forEach(btn => btn.classList.remove('active'));

    // 1. CHECAGEM DE REDE
    if (!networkManager.isOnline) {
         listaMusicas.innerHTML = '<p style="text-align: center; margin-top: 20px; color: #777;">Você precisa de conexão para buscar na Web.</p>';
         return;
    }
    
    // 2. CHECAGEM DE TERMO DE BUSCA
    if (termo.length < 2) {
        // Se a busca estiver vazia, apenas mostra a lista inteira da Web (Explorar)
        listaMusicas.innerHTML = '<h3>Catálogo Web Completo (Exemplo)</h3>';
        
        // Se não houver termo, mostra o catálogo Web Grande inteiro (simulando "Explorar")
        const resultadosCompletos = BIBLIOTECA_WEB_GRANDE.filter(f => !f.baixada);
        
        if (resultadosCompletos.length === 0) {
            listaMusicas.innerHTML = '<p style="text-align: center; margin-top: 20px; color: #777;">Nenhum item disponível no catálogo Web.</p>';
        } else {
             // Reutiliza o renderizador de resultados
             renderizarResultadosBusca(resultadosCompletos, 'web', listaMusicas);
        }
        return;
    }
    
    // 3. EXECUÇÃO DA BUSCA (Filtra pelo termo)
    const resultadosFiltrados = BIBLIOTECA_WEB_GRANDE.filter(faixa => 
        faixa.titulo.toLowerCase().includes(termo) ||
        faixa.artista.toLowerCase().includes(termo) ||
        (faixa.album && faixa.album.toLowerCase().includes(termo)) ||
        (faixa.tipo && faixa.tipo.toLowerCase().includes(termo))
    ).filter(f => !f.baixada); // A busca na web só mostra o que não está baixado

    listaMusicas.innerHTML = `<h3>Resultados da Web para "${termo}" (${resultadosFiltrados.length} encontrados)</h3>`;

    if (resultadosFiltrados.length === 0) {
        listaMusicas.innerHTML += '<p style="text-align: center; margin-top: 20px; color: #777;">Nenhum resultado encontrado na Web.</p>';
        return;
    }

    // 4. RENDERIZAÇÃO
    renderizarResultadosBusca(resultadosFiltrados, 'web', listaMusicas);
}

// NOVO: Função auxiliar para evitar repetição de código
function renderizarResultadosBusca(resultados, modoOrigem, container) {
     resultados.forEach((faixa, index) => {
        // Encontra o ID correto no BIBLIOTECA_WEB_GRANDE para montar a playlist (índice)
        const indiceBusca = BIBLIOTECA_WEB_GRANDE.findIndex(f => f.id === faixa.id);
        
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
        container.appendChild(item);
    });
}
