// Seleciona elementos
const modal = document.getElementById('modal');
const openBtn = document.querySelector('.add-btn');
const closeBtn = document.querySelector('.close-btn');

// Abre o modal ao clicar no botão
openBtn.addEventListener('click', () => {
  modal.style.display = 'flex'; // mostra o modal
});

// Fecha ao clicar no X
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fecha ao clicar fora da caixa
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

document.addEventListener("DOMContentLoaded", () => {
      lucide.createIcons();
    });

const cancelBtn = document.getElementById('cancel-btn');

// Fecha o modal ao clicar em "Cancelar"
cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});





document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const cards = document.querySelectorAll(".card");
  const modal = document.querySelector(".profile-modal");
  const modalContent = document.querySelector(".profile-modal-content");
  const closeBtn = document.getElementById("closeProfile");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      modal.classList.add("show");

      // Atualiza dados do modal com base nos data-attributes
      document.getElementById("modalName").textContent = card.dataset.nome;
      document.getElementById("modalHeadline").textContent =
        `${card.dataset.cargo} na ${card.dataset.empresa}`;
      document.getElementById("modalCourse").textContent =
        `${card.dataset.curso} • Turma de ${card.dataset.ano}`;
      document.getElementById("modalCity").textContent = card.dataset.cidade;
      document.getElementById("modalExperience").textContent = card.dataset.experiencia;
      document.getElementById("modalBio").textContent = card.dataset.bio;
      document.getElementById("modalEmail").textContent = card.dataset.email;
      document.getElementById("modalPhone").textContent = card.dataset.telefone;
      document.getElementById("modalLinkedin").textContent = card.dataset.linkedin;
      document.getElementById("modalCompany").textContent = card.dataset.empresa;
      document.getElementById("modalPosition").textContent = card.dataset.cargo;

      // Atualiza imagem
      const modalPhoto = modalContent.querySelector(".profile-header img");
      const cardImg = card.querySelector("img");
      modalPhoto.src = cardImg ? cardImg.src : "https://via.placeholder.com/100";

      // Atualiza habilidades
      const skillsContainer = document.getElementById("modalSkills");
      skillsContainer.innerHTML = "";
      if (card.dataset.habilidades) {
        card.dataset.habilidades.split(",").forEach(skill => {
          const span = document.createElement("span");
          span.classList.add("skill-tag");
          span.textContent = skill.trim();
          skillsContainer.appendChild(span);
        });
      }
    });
  });

  // Fecha o modal
  closeBtn.addEventListener("click", () => modal.classList.remove("show"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("show");
  });
});


document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // Atualiza automaticamente o conteúdo visível dos cards
  document.querySelectorAll(".card").forEach(card => {
    const nome = card.dataset.nome || "Nome do Ex-Aluno";
    const curso = card.dataset.curso || "Curso";
    const ano = card.dataset.ano || "XXXX";
    const cidade = card.dataset.cidade || "Cidade";
    const empresa = card.dataset.empresa || "Empresa";

    // Atualiza os elementos internos do card
    card.querySelector("h3").textContent = nome;
    card.querySelector("p:nth-of-type(1)").innerHTML = `<i data-lucide="graduation-cap"></i> ${curso}`;
    card.querySelector("p:nth-of-type(2)").innerHTML = `<i data-lucide="calendar"></i> Turma de ${ano}`;
    card.querySelector("p:nth-of-type(3)").innerHTML = `<i data-lucide="map-pin"></i> ${cidade}`;
    card.querySelector("p:nth-of-type(4)").innerHTML = `<i data-lucide="building"></i> ${empresa}`;
  });

  // Recria os ícones após atualizar o HTML dinamicamente
  lucide.createIcons();
});

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // ===== Seletores gerais =====
  const addBtn = document.querySelector(".add-btn");
  const modal = document.getElementById("modal");
  const closeModalBtn = document.querySelector(".close-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const profileModal = document.getElementById("profileModal");
  const closeProfile = document.getElementById("closeProfile");
  const form = modal.querySelector("form");
  const cardsContainer = document.querySelector(".cards");

  // ===== Abre o modal de adicionar perfil =====
  addBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // ===== Fecha o modal de adicionar perfil =====
  function closeAddModal() {
    modal.style.display = "none";
  }
  closeModalBtn.addEventListener("click", closeAddModal);
  cancelBtn.addEventListener("click", closeAddModal);

  // Fecha modal ao clicar fora
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeAddModal();
  });

  // ===== Criação dinâmica de cards =====
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Coleta dados do formulário
    const nome = document.getElementById("name").value;
    const curso = document.getElementById("course").value;
    const ano = document.getElementById("year").value;
    const cidade = document.getElementById("city").value;
    const empresa = document.getElementById("company").value || "—";
    const cargo = document.getElementById("role").value || "—";
    const email = document.getElementById("email").value || "—";
    const telefone = document.getElementById("phone").value || "—";
    const linkedin = document.getElementById("linkedin").value || "—";
    const bio = document.getElementById("bio").value || "Sem biografia.";
    const habilidades = []; // será ajustado depois (ex: campo adicional futuro)
    const experiencia = "Experiência não especificada";

    // Cria o card
    const novoCard = document.createElement("div");
    novoCard.classList.add("card");

    // Define os atributos de dados (usados no modal de perfil)
    Object.assign(novoCard.dataset, {
      nome,
      curso,
      ano,
      cidade,
      empresa,
      cargo,
      email,
      telefone,
      linkedin,
      bio,
      habilidades: habilidades.join(","),
      experiencia,
    });

    // HTML do card
    novoCard.innerHTML = `
      <img src="https://via.placeholder.com/100" alt="Foto do ex-aluno" class="profile-pic" />
      <h3>${nome}</h3>
      <p><i data-lucide="graduation-cap"></i> ${curso}</p>
      <p><i data-lucide="calendar"></i> Turma de ${ano}</p>
      <p><i data-lucide="map-pin"></i> ${cidade}</p>
      <p><i data-lucide="building"></i> ${empresa}</p>
      <div class="icons">
        <button><i data-lucide="mail"></i></button>
        <button><i data-lucide="phone"></i></button>
        <button><i data-lucide="linkedin"></i></button>
      </div>
    `;

    // Adiciona o card à página
    cardsContainer.appendChild(novoCard);
    lucide.createIcons();

    // Reaplica o evento de clique para abrir o modal de perfil
    aplicarEventoCard(novoCard);

    // Fecha o modal e limpa o formulário
    form.reset();
    closeAddModal();
  });

  // ===== Função que abre o modal de perfil com os dados do card =====
  function abrirModalPerfil(card) {
    profileModal.classList.add("show");

    // Preenche informações do modal
    document.getElementById("modalName").textContent = card.dataset.nome;
    document.getElementById("modalHeadline").textContent =
      `${card.dataset.cargo} na ${card.dataset.empresa}`;
    document.getElementById("modalCourse").textContent =
      `${card.dataset.curso} • Turma de ${card.dataset.ano}`;
    document.getElementById("modalCity").textContent = card.dataset.cidade;
    document.getElementById("modalExperience").textContent =
      card.dataset.experiencia;
    document.getElementById("modalBio").textContent = card.dataset.bio;
    document.getElementById("modalEmail").textContent = card.dataset.email;
    document.getElementById("modalPhone").textContent = card.dataset.telefone;
    document.getElementById("modalLinkedin").textContent =
      card.dataset.linkedin;
    document.getElementById("modalCompany").textContent = card.dataset.empresa;
    document.getElementById("modalPosition").textContent = card.dataset.cargo;

    // Atualiza habilidades
    const skillsContainer = document.getElementById("modalSkills");
    skillsContainer.innerHTML = "";
    if (card.dataset.habilidades) {
      card.dataset.habilidades.split(",").forEach((skill) => {
        const span = document.createElement("span");
        span.classList.add("skill-tag");
        span.textContent = skill.trim();
        skillsContainer.appendChild(span);
      });
    }
  }

  // ===== Fecha o modal de perfil =====
  function fecharModalPerfil() {
    profileModal.classList.remove("show");
  }
  closeProfile.addEventListener("click", fecharModalPerfil);
  profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) fecharModalPerfil();
  });

  // ===== Adiciona evento aos cards existentes =====
  function aplicarEventoCard(card) {
    card.addEventListener("click", () => abrirModalPerfil(card));
  }

  // Aplica a todos os cards carregados inicialmente
  document.querySelectorAll(".card").forEach(aplicarEventoCard);
});
