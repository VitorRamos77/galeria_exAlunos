//Open and close the add profile section
const addProfile = document.querySelector(".modal-overlay");
const enterAddProfile = document.querySelector(".add-profile-button");
const closeAddProfile = document.querySelector(".modal-close-button")

enterAddProfile.addEventListener('click', function(){
    addProfile.style.display='flex';
});

closeAddProfile.addEventListener('click', function(){
    addProfile.style.display='';
});

//Abrir os dados do json 

const alumniGrid = document.querySelector('.alumni-grid');
const resultsInfo = document.querySelector('.results-info');
let cursos = [];

function criarAlumniCard(pessoa) {
  const cardHTML = `
  <div class="alumni-card">
    <div class="card-image-wrapper">
      <div class="card-image-frame">
        <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Ana Silva" class="card-image">
      </div>
    </div>
    <div class="card-content">
      <h3 class="card-title">${pessoa["nome"]}</h3>
      <div class="card-info">
        <div class="card-info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap" aria-hidden="true"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
          <span class="card-info-text">${pessoa["engenharia"]}</span>
        </div>
        <div class="card-info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
          <span class="card-info-text">${pessoa["turma"]}</span>
        </div>
        <div class="card-info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span class="card-info-text">${pessoa["local"]}</span>
        </div>
        <div class="card-info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
          <span class="card-info-text">${pessoa["trabalho"]}</span>
        </div>
      </div>
      <div class="card-socials">
        <div class="card-social-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail social-icon" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
        </div>
        <div class="card-social-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone social-icon" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>
        </div>
        <div class="card-social-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin social-icon" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </div>
      </div>
    </div>
  </div>
  `;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cardHTML.trim();
  return tempDiv.firstElementChild;
}

function exibirDados(usuario) {
    alumniGrid.innerHTML=``;
    for(let profile in usuario){
        alumniGrid.appendChild(criarAlumniCard(usuario[`${profile}`]));
        if(!cursos.includes(usuario[`${profile}`]["engenharia"])){
          cursos.push(usuario[`${profile}`]["engenharia"])
        }
    }
}

// Espera o DOM estar pronto antes de executar o script
document.addEventListener('DOMContentLoaded', function(){
    buscarDados();
});

async function buscarDados() {
    try {
        const resposta = await fetch('dados.json');
        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }
        const dados = await resposta.json();
        exibirDados(dados);
    } catch (erro) {
        console.error('Falha ao buscar dados:', erro);
        alumniGrid.innerText = 'Falha ao carregar dados';
    }
}

function mostrarfiltros(){
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cardHTML.trim();
  return tempDiv.firstElementChild;
  
}
