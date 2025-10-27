//Abrir os dados do json 
const cards = document.querySelector('.cards'); //Onde ficam os cards
const curso_atual= document.querySelector('.filtro_curso'); //Filtro de qual é o curso atual
const ano_atual= document.querySelector('.filtro_ano'); //Filtro de qual é o ano atual
const nome_atual= document.querySelector('.filtro_nome'); //Filtro de qual é o nome atual
const num_resultados= document.querySelector('.results-info'); //Texto que exibe o numero de resultados mostrados e o total
let num_pessoas_mostradas = 0; //numero atual de pessoas ostradas
let num_total = 0; //numero total de pessoas carregadas

function criarAlumniCard(pessoa) { //Função que gera um card de pessoa com base os dados recebidos
  const cardHTML = `
  <div class="card">
        <img src="https://via.placeholder.com/100" alt="Foto do ex-aluno" class="profile-pic" />
        <h3>${pessoa['nome']}</h3>
        <p><i data-lucide="graduation-cap"></i> ${pessoa['engenharia']}</p>
        <p><i data-lucide="calendar"></i> Turma de ${pessoa['turma']}</p>
        <p><i data-lucide="map-pin"></i> ${pessoa['local']}</p>
        <p><i data-lucide="building"></i> ${pessoa['trabalho']}</p>
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

function exibirDados(usuario) { //Função que exibe os dados considerando os filtros
  cards.innerHTML=``;
  num_pessoas_mostradas=0;
  for(let profile in usuario){
      if((curso_atual.value === usuario[profile]['engenharia'] || curso_atual.value === 'padrao') && (ano_atual.value === usuario[profile]['turma'] || ano_atual.value === 'padrao') &&(usuario[profile]['nome'].toLowerCase().includes(nome_atual.value.toLowerCase()) )) {
        cards.appendChild(criarAlumniCard(usuario[profile]));
        num_pessoas_mostradas+=1;
      }
    }
  num_resultados.innerHTML=`Mostrando ${num_pessoas_mostradas} de ${num_total} ex-alunos`
}

async function buscarDados() { //Função que recebe os dados e mantém a exibição de acordo com os filtros
  try {
    const resposta = await fetch('dados.json');
    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`)
    }
    const dados = await resposta.json();
    for(let pessoa in dados){
      num_total+=1;
    }
    exibirDados(dados);
    curso_atual.addEventListener('change', function() {exibirDados(dados);});
    ano_atual.addEventListener('change', function(){exibirDados(dados);});
    nome_atual.addEventListener('keyup', function(){exibirDados(dados);});
  } catch (erro) {
    console.error('Falha ao buscar dados:', erro);
    cards.innerText = 'Falha ao carregar dados';
  }
}

// Espera o DOM estar pronto antes de executar o script
document.addEventListener('DOMContentLoaded', function(){
    buscarDados();
});

