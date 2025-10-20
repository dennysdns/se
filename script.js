// ... (Dentro da seção de INICIALIZAÇÃO) ...

document.getElementById('btn-online').addEventListener('click', function() {
    if (loggedInSpotify) {
        // Agora este alert usará https://open.spotify.com/
        alert(`Simulando a navegação para: ${SPOTIFY_LIKED_SONGS_URL}\n\n*A navegação foi simulada porque o player está em modo demonstração.`);
        carregarBiblioteca('online', this); 
    } else {
        carregarBiblioteca('online', this);
        abrirModal();
    }
});
