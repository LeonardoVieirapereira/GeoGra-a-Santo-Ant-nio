// Função para alternar e salvar o tema no localStorage
function alternarTema() {
  const body = document.body;
  
  body.classList.toggle('dark-theme');

  if (body.classList.contains('dark-theme')) {
    localStorage.setItem('tema', 'escuro');
  } else {
    localStorage.setItem('tema', 'claro');
  }
}

// Associa o evento de clique ao botão assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', alternarTema);
  }
});
