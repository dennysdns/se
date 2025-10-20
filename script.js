// ----------------------------------------------------
// INICIALIZAÇÃO
// ----------------------------------------------------

// 1. Atualiza o status da rede
networkManager.updateStatus();

// 2. Carrega a biblioteca online padrão
carregarBiblioteca('online', document.getElementById('btn-online'));

// NOVO: 3. Abre o modal de login automaticamente ao carregar a página
abrirModal();
