document.addEventListener('DOMContentLoaded', () => {

  // === SELETORES (Unificados de ambos os códigos) ===
  
  // Filtros e Display (Snippet 1)
  const cardsContainer = document.querySelector('.cards');
  const curso_atual = document.querySelector('.filtro_curso');
  const ano_atual = document.querySelector('.filtro_ano');
  const nome_atual = document.querySelector('.filtro_nome');
  const num_resultados = document.querySelector('.results-info');

  // Modal "Adicionar Perfil" (Snippet 2)
  const addModal = document.getElementById('modal'); // Modal do formulário
  const openAddBtn = document.querySelector('.add-btn');
  const closeAddBtn = addModal.querySelector('.close-btn');
  const cancelAddBtn = document.getElementById('cancel-btn');
  const addForm = addModal.querySelector('form');

  // Modal "Ver Perfil" (Snippet 2)
  // Assumindo que este modal existe no HTML com o ID "profileModal"
  const profileModal = document.getElementById('profileModal'); 
  const closeProfileBtn = document.getElementById('closeProfile');

  // === VARIÁVEIS GLOBAIS ===
  let num_pessoas_mostradas = 0;
  let num_total = 0;
  let dadosAlumni = []; // Armazena todos os perfis (do JSON e novos)

  // === FUNÇÕES DE CRIAÇÃO E DISPLAY (Snippet 1) ===

  /**
   * Cria o elemento HTML para um card de alumni.
   * @param {object} pessoa - O objeto com dados do perfil.
   * @returns {HTMLElement} O elemento do card.
   */
  function criarAlumniCard(pessoa) {
    const cardHTML = `
    <div 
      class="card"
      data-nome="${pessoa['nome']}"
      data-curso="${pessoa['curso']}"
      data-ano="${pessoa['ano']}"
      data-cidade="${pessoa['cidade']}"
      data-empresa="${pessoa['empresa']}"
      data-cargo="${pessoa['cargo']}"
      data-email="${pessoa['email']}"
      data-telefone="${pessoa['telefone']}"
      data-linkedin="${pessoa['linkedin']}"
      data-bio="${pessoa['bio']}"
      data-habilidades="${pessoa['habilidades']}"
      data-experiencia="${pessoa['experiencia']}"
    >
      <img src="${pessoa['foto'] || 'https://via.placeholder.com/100'}" alt="Foto de ${pessoa['nome']}" class="profile-pic" />
      <h3>${pessoa['nome']}</h3>
      <p><i data-lucide="graduation-cap"></i> ${pessoa['curso']}</p>
      <p><i data-lucide="calendar"></i> Turma de ${pessoa['ano']}</p>
      <p><i data-lucide="map-pin"></i> ${pessoa['cidade']}</p>
      <p><i data-lucide="building"></i> ${pessoa['empresa']}</p>
      <div class="icons">
        <button><i data-lucide="mail"></i></button>
        <button><i data-lucide="phone"></i></button>
        <button><i data-lucide="linkedin"></i></button>
      </div>
    </div>
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHTML.trim();
    return tempDiv.firstElementChild;
  }

  /**
   * Filtra e exibe os cards no container com base nos filtros globais.
   * Usa a variável global 'dadosAlumni'.
   */
  function exibirDados() {
    cardsContainer.innerHTML = ``;
    num_pessoas_mostradas = 0;
    
    const cursoFiltro = curso_atual.value;
    const anoFiltro = ano_atual.value;
    const nomeFiltro = nome_atual.value.toLowerCase();

    // Filtra usando os dados globais
    for (const profile of dadosAlumni) {
      const nomeMatch = profile['nome'].toLowerCase().includes(nomeFiltro);
      const cursoMatch = (cursoFiltro === 'padrao' || cursoFiltro === profile['curso']);
      const anoMatch = (anoFiltro === 'padrao' || anoFiltro === profile['ano']);

      if (nomeMatch && cursoMatch && anoMatch) {
        const cardElement = criarAlumniCard(profile);
        cardsContainer.appendChild(cardElement);
        aplicarEventoCard(cardElement); // Aplica o clique para abrir o modal de perfil
        num_pessoas_mostradas += 1;
      }
    }
    
    num_resultados.innerHTML = `Mostrando ${num_pessoas_mostradas} de ${num_total} ex-alunos`;
    lucide.createIcons(); // Renderiza os ícones (importante!)
  }

  /**
   * Busca os dados iniciais do JSON.
   */
  async function buscarDados() {
    try {
      const resposta = await fetch('dados.json');
      if (!resposta.ok) {
        throw new Error(`Erro na requisição: ${resposta.status}`);
      }
      const dados = await resposta.json();
      
      dadosAlumni = dados; // Salva os dados globalmente
      num_total = dadosAlumni.length; // Define o número total

      exibirDados(); // Exibe os dados iniciais

      // Adiciona os listeners dos filtros
      curso_atual.addEventListener('change', exibirDados);
      ano_atual.addEventListener('change', exibirDados);
      nome_atual.addEventListener('keyup', exibirDados);

    } catch (erro) {
      console.error('Falha ao buscar dados:', erro);
      // Onde você tem a falha (ex: num 'catch' de um 'fetch')
      cardsContainer.classList.add('error-state'); // Adiciona a nova classe
      cardsContainer.innerHTML = `
        <i data-lucide="search-slash"></i>
        <p>Falha ao carregar dados</p>
      `;
      lucide.createIcons(); // Recria o ícone
    }
  }

  // === FUNÇÕES DOS MODAIS (Snippet 2) ===

  // --- Modal "Adicionar Perfil" ---
  function abrirAddModal() {
    addModal.style.display = 'flex';
  }

  function fecharAddModal() {
    addModal.style.display = 'none';
    addForm.reset();
  }

  /**
   * Manipula o envio do formulário de adicionar perfil.
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    // Coleta dados do formulário
    const novoPerfil = {
      nome: document.getElementById("name").value,
      curso: document.getElementById("course").value,
      ano: document.getElementById("year").value,
      cidade: document.getElementById("city").value,
      empresa: document.getElementById("company").value || "—",
      cargo: document.getElementById("role").value || "—",
      email: document.getElementById("email").value || "—",
      telefone: document.getElementById("phone").value || "—",
      linkedin: document.getElementById("linkedin").value || "—",
      bio: document.getElementById("bio").value || "Sem biografia.",
      habilidades: "", // O form não coleta isso
      experiencia: "Experiência não especificada", // O form não coleta isso
      foto: "https://via.placeholder.com/100" // Foto placeholder
    };

    // Adiciona o novo perfil aos dados globais
    dadosAlumni.push(novoPerfil);
    num_total = dadosAlumni.length; // Atualiza a contagem total

    // Redesenha a lista de cards (aplicando filtros)
    exibirDados();
    
    fecharAddModal();
  }

  // --- Modal "Ver Perfil" ---

  /**
   * Preenche e exibe o modal de perfil com dados de um card.
   * @param {HTMLElement} card - O elemento do card que foi clicado.
   */
  function abrirModalPerfil(card) {
    // Preenche informações do modal
    document.getElementById("modalName").textContent = card.dataset.nome;
    document.getElementById("modalHeadline").textContent = `${card.dataset.cargo} na ${card.dataset.empresa}`;
    document.getElementById("modalCourse").textContent = `${card.dataset.curso} • Turma de ${card.dataset.ano}`;
    document.getElementById("modalCity").textContent = card.dataset.cidade;
    document.getElementById("modalExperience").textContent = card.dataset.experiencia;
    document.getElementById("modalBio").textContent = card.dataset.bio;
    document.getElementById("modalEmail").textContent = card.dataset.email;
    document.getElementById("modalPhone").textContent = card.dataset.telefone;
    document.getElementById("modalLinkedin").textContent = card.dataset.linkedin;
    document.getElementById("modalCompany").textContent = card.dataset.empresa;
    document.getElementById("modalPosition").textContent = card.dataset.cargo;

    // Atualiza imagem
    const modalPhoto = profileModal.querySelector(".profile-header img");
    const cardImg = card.querySelector("img");
    modalPhoto.src = cardImg ? cardImg.src : "https://via.placeholder.com/100";

    // Atualiza habilidades
    const skillsContainer = document.getElementById("modalSkills");
    skillsContainer.innerHTML = "";
    if (card.dataset.habilidades && card.dataset.habilidades.trim() !== "") {
      card.dataset.habilidades.split(",").forEach((skill) => {
        const span = document.createElement("span");
        span.classList.add("skill-tag");
        span.textContent = skill.trim();
        skillsContainer.appendChild(span);
      });
    }

    profileModal.classList.add("show");
  }

  function fecharModalPerfil() {
    profileModal.classList.remove("show");
  }

  /**
   * Adiciona o listener de clique a um card para abrir o modal de perfil.
   * @param {HTMLElement} card - O elemento do card.
   */
  function aplicarEventoCard(card) {
    card.addEventListener("click", () => abrirModalPerfil(card));
  }

  // === INICIALIZAÇÃO ===
  
  lucide.createIcons(); // Chamada inicial para ícones estáticos
  
  // Listeners do Modal "Adicionar Perfil"
  openAddBtn.addEventListener('click', abrirAddModal);
  closeAddBtn.addEventListener('click', fecharAddModal);
  cancelAddBtn.addEventListener('click', fecharAddModal);
  window.addEventListener('click', (e) => {
    if (e.target === addModal) fecharAddModal();
  });
  addForm.addEventListener('submit', handleFormSubmit);

  // Listeners do Modal "Ver Perfil"
  closeProfileBtn.addEventListener('click', fecharModalPerfil);
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) fecharModalPerfil();
  });

  // Busca os dados iniciais do JSON e configura os filtros
  buscarDados();
});