document.addEventListener('DOMContentLoaded', () => {
  // ====== SELETORES (com fallback classe/id) ======
  const cardsContainer = document.querySelector('.cards');
  const curso_atual = document.querySelector('.filtro_curso') || document.getElementById('filterCourse');
  const ano_atual   = document.querySelector('.filtro_ano')   || document.getElementById('filterYear');
  const nome_atual  = document.querySelector('.filtro_nome')  || document.getElementById('searchName');
  const num_resultados = document.querySelector('.results-info') || document.getElementById('resultsInfo');

  // Modal "Adicionar Perfil"
  const addModal     = document.getElementById('modal');
  const openAddBtn   = document.querySelector('.add-btn');
  const closeAddBtn  = addModal.querySelector('.close-btn') || document.getElementById('closeAdd');
  const cancelAddBtn = document.getElementById('cancel-btn');
  const addForm      = addModal.querySelector('form') || document.getElementById('addForm');

  // Modal "Ver Perfil"
  const profileModal   = document.getElementById('profileModal');
  const closeProfileBtn= document.getElementById('closeProfile');

  // ====== VARIÁVEIS GLOBAIS ======
  let num_pessoas_mostradas = 0;
  let num_total = 0;
  let dadosAlumni = [];
  // Agora será um OBJETO indexado por "UF" e por "Nome do Estado"
  let cidadesPorEstado = {};

  // ====== HELPERS: UF -> Nome ======
  const UF_NOME = {
    AC:"Acre", AL:"Alagoas", AP:"Amapá", AM:"Amazonas", BA:"Bahia",
    CE:"Ceará", DF:"Distrito Federal", ES:"Espírito Santo", GO:"Goiás",
    MA:"Maranhão", MT:"Mato Grosso", MS:"Mato Grosso do Sul", MG:"Minas Gerais",
    PA:"Pará", PB:"Paraíba", PR:"Paraná", PE:"Pernambuco", PI:"Piauí",
    RJ:"Rio de Janeiro", RN:"Rio Grande do Norte", RS:"Rio Grande do Sul",
    RO:"Rondônia", RR:"Roraima", SC:"Santa Catarina", SP:"São Paulo",
    SE:"Sergipe", TO:"Tocantins"
  };

  // Indexa o array [{uf, nome, cidades}] em um objeto { UF: [...], Nome: [...] }
  function indexarCidades(arr) {
    const map = {};
    arr.forEach(({ uf, nome, cidades }) => {
      map[uf] = cidades;
      map[nome] = cidades;
    });
    return map;
  }

  function getCidadesDoUF(uf) {
    const chaveUF   = uf;
    const chaveNome = UF_NOME[uf];
    const lista = cidadesPorEstado[chaveUF] ?? cidadesPorEstado[chaveNome];
    return Array.isArray(lista) ? lista : [];
  }

  // ====== CRIAÇÃO DE CARD ======
  function criarAlumniCard(pessoa) {
    const cardHTML = `
      <div 
        class="card"
        data-nome="${pessoa.nome}"
        data-apelido="${pessoa.apelido || ''}"
        data-nascimento="${pessoa.nascimento || ''}"
        data-curso="${pessoa.curso}"
        data-ano="${pessoa.ano}"
        data-estado="${pessoa.estado || ''}"
        data-cidade="${pessoa.cidade || ''}"
        data-empresa="${pessoa.empresa || '—'}"
        data-cargo="${pessoa.cargo || 'Prefiro não informar'}"
        data-email="${pessoa.email || '—'}"
        data-telefone="${pessoa.telefone || '—'}"
        data-paisfone="${pessoa.paisfone || '+55'}"
        data-linkedin="${pessoa.linkedin || '—'}"
        data-bio="${pessoa.bio || 'Sem biografia.'}"
        data-habilidades="${pessoa.habilidades || ''}"
        data-experiencia="${pessoa.experiencia || 'Experiência não especificada'}"
      >
        <img src="${pessoa.foto || 'https://via.placeholder.com/100'}" alt="Foto de ${pessoa.nome}" class="profile-pic" />
        <h3>${pessoa.nome}</h3>
        <p><i data-lucide="graduation-cap"></i> ${pessoa.curso}</p>
        <p><i data-lucide="calendar"></i> Turma de ${pessoa.ano}</p>
        <p><i data-lucide="map-pin"></i> ${pessoa.cidade || '—'}, ${pessoa.estado || '—'}</p>
        <p><i data-lucide="building"></i> ${pessoa.empresa || '—'}</p>
        <div class="icons">
          <button title="Email"><i data-lucide="mail"></i></button>
          <button title="Telefone"><i data-lucide="phone"></i></button>
          <button title="LinkedIn"><i data-lucide="linkedin"></i></button>
        </div>
      </div>`;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHTML.trim();
    return tempDiv.firstElementChild;
  }

  // ====== EXIBIÇÃO (com filtros) ======
  function exibirDados() {
    cardsContainer.innerHTML = ``;
    num_pessoas_mostradas = 0;

    const cursoFiltro = (curso_atual && curso_atual.value !== undefined) ? (curso_atual.value || 'padrao') : 'padrao';
    const anoFiltro   = (ano_atual   && ano_atual.value   !== undefined) ? (ano_atual.value   || 'padrao') : 'padrao';
    const nomeFiltro  = (nome_atual  && nome_atual.value  !== undefined) ? nome_atual.value.toLowerCase() : '';

    for (const profile of dadosAlumni) {
      const nomeMatch  = profile.nome.toLowerCase().includes(nomeFiltro);
      const cursoMatch = (cursoFiltro === 'padrao' || cursoFiltro === profile.curso);
      const anoMatch   = (anoFiltro   === 'padrao' || anoFiltro   === profile.ano);

      if (nomeMatch && cursoMatch && anoMatch) {
        const cardElement = criarAlumniCard(profile);
        cardsContainer.appendChild(cardElement);
        aplicarEventoCard(cardElement);
        num_pessoas_mostradas += 1;
      }
    }

    if (num_resultados) {
      num_resultados.innerHTML = `Mostrando ${num_pessoas_mostradas} de ${num_total} ex-alunos`;
    }
    lucide.createIcons();
  }

  // ====== BUSCA DOS JSONs ======
  async function carregarJSONs() {
    try {
      const [dadosResp, cidadesResp] = await Promise.all([
        fetch('dados.json'),
        fetch('estados-cidades.json')
      ]);

      if (!dadosResp.ok || !cidadesResp.ok) {
        throw new Error('Erro ao carregar um dos arquivos JSON.');
      }

      dadosAlumni = await dadosResp.json();
      const cidadesArray = await cidadesResp.json();
      cidadesPorEstado = indexarCidades(cidadesArray); // indexa array => objeto
      num_total = dadosAlumni.length;

      // Popular filtro de anos (se existir #filterYear)
      if (ano_atual && ano_atual.tagName === 'SELECT') {
        const anos = Array.from(new Set(dadosAlumni.map(a => a.ano))).sort();
        ano_atual.innerHTML = `<option value="">Todos os Anos</option>` +
                              anos.map(y => `<option value="${y}">${y}</option>`).join('');
      }

      exibirDados();
    } catch (erro) {
      console.error('Erro ao carregar JSONs:', erro);
      cardsContainer.classList.add('error-state');
      cardsContainer.innerHTML = `
        <i data-lucide="alert-triangle"></i>
        <p>Falha ao carregar dados dos ex-alunos ou cidades.</p>
      `;
      lucide.createIcons();
    }
  }

  // ====== FORMULÁRIO: Estado → Cidade ======
 // ====== FORMULÁRIO: Estado → Cidade (com toggle de required) ======
function configurarFormulario() {
  const estadoSelect = document.getElementById('state');
  const cityGroup    = document.getElementById('cityGroup');      // contém <label> + <select id="city">
  const cityFreeGrp  = document.getElementById('cityFreeGroup');  // contém <label> + <input id="cityFree">

  if (!estadoSelect || !cityGroup || !cityFreeGrp) return;

  function aplicarEstado(uf) {
    const citySelect = cityGroup.querySelector('#city');
    const cityFree   = cityFreeGrp.querySelector('#cityFree');

    if (uf === 'EXT') {
      // Mostrar input livre e garantir que apenas ele seja required
      cityGroup.classList.add('hidden');
      cityFreeGrp.classList.remove('hidden');

      if (citySelect) {
        citySelect.required = false;
        citySelect.disabled = true; // evita validação
      }
      if (cityFree) {
        cityFree.required = true;
        cityFree.disabled = false;
      }
      return;
    }

    // Estado BR → popular select e torná-lo o único required
    cityFreeGrp.classList.add('hidden');
    if (cityFree) {
      cityFree.required = false;
      cityFree.disabled = true;
    }
    cityGroup.classList.remove('hidden');

    const cidades = getCidadesDoUF(uf).slice().sort((a,b) => a.localeCompare(b, 'pt-BR'));

    // recria o select para limpar opções antigas
    const sel = document.createElement('select');
    sel.id = 'city';
    sel.required = true;
    sel.disabled = false;
    sel.innerHTML = `<option value="" disabled selected>Selecione a cidade</option>` +
      cidades.map(c => `<option value="${c}">${c}</option>`).join('');

    const label = document.createElement('label');
    label.setAttribute('for', 'city');
    label.textContent = 'Cidade *';

    cityGroup.replaceChildren(label, sel);
  }

  // Aplica uma vez ao abrir o modal (caso já tenha valor)
  aplicarEstado(estadoSelect.value || '');

  // E aplica sempre que mudar
  estadoSelect.addEventListener('change', () => aplicarEstado(estadoSelect.value));
}

  // ====== MÁSCARAS DE TELEFONE ======
  function configurarMascarasTelefone() {
  const phoneCountry = document.getElementById('phoneCountry');
  const phoneInput   = document.getElementById('phone');
  if (!phoneCountry || !phoneInput) return;

  // Formatos base para países (podem ser expandidos)
  const padroes = {
    '+1'   : '000 000-0000',    // EUA
    '+1-CA': '000 000-0000',    // Canadá
    '+44'  : '0000 000000',     // UK
    '+351' : '000 000 000',     // PT
    '+34'  : '000 000 000',     // ES
    '+33'  : '00 00 00 00 00',  // FR
    '+49'  : '0000 0000000',    // DE
    '+39'  : '000 000 0000',    // IT
    '+81'  : '000-0000-0000',   // JP
    '+82'  : '000-0000-0000',   // KR
    '+86'  : '000-0000-0000',   // CN
    '+91'  : '00000 00000',     // IN
    '+52'  : '000 000 0000',    // MX
    '+57'  : '000 000 0000',    // CO
    '+56'  : '0000 0000',       // CL
    '+54'  : '0000 000000',     // AR
    '+598' : '0000 0000',       // UY
    '+595' : '0000 000000',     // PY
    '+244' : '000 000 000',     // AO
    '+258' : '00 000 0000',     // MZ
    '+264' : '000 000 0000',    // NA
    '+353' : '000 000 0000',    // IE
    '+47'  : '000 00 000',      // NO
    '+46'  : '000-000 00 00',   // SE
    '+41'  : '00 000 00 00',    // CH
    '+420' : '000 000 000',     // CZ
    '+48'  : '000 000 000',     // PL
    '+7'   : '000 000-00-00',   // RU
    '+971' : '0 000 0000',      // UAE
    '+972' : '0-0000-0000',     // IL
    '+90'  : '000 000 00 00',   // TR
    '+61'  : '0000 000 000',    // AU
    '+64'  : '000 000 0000',    // NZ
    '+964' : '000 000 0000',    // IQ
    '+966' : '000 000 0000',    // SA
    '+20'  : '0000 000 000',    // EG
    '+212' : '0000-000000',     // MA
    '+27'  : '000 000 0000'     // ZA
  };

  // Aplica a máscara dada uma string de dígitos e um formato (0 = dígito)
  function aplicarMascara(digitos, mascara) {
    const only = digitos.replace(/\D/g, '');
    let out = '';
    let i = 0;
    for (const ch of mascara) {
      if (ch === '0') {
        if (i < only.length) out += only[i++];
        else break;
      } else {
        if (i < only.length) out += ch;
      }
    }
    return out;
  }

  // Máscara dinâmica para o Brasil (com DDD):
  // 10 dígitos => (00) 0000-0000  |  11 dígitos => (00) 00000-0000
  function formatarBrasil(valorAtual) {
    const dig = valorAtual.replace(/\D/g, '');
    const mascara = dig.length > 10 ? '(00) 00000-0000' : '(00) 0000-0000';
    const placeholder = '(xx) xxxxx-xxxx'; // exibe sempre o de celular
    return {
      valor: aplicarMascara(dig, mascara),
      placeholder
    };
  }

  function setPlaceholderEFormatacao() {
    if (phoneCountry.value === '+55') {
      const { valor, placeholder } = formatarBrasil(phoneInput.value);
      phoneInput.placeholder = placeholder;
      phoneInput.value = valor;
      return;
    }
    const mascara = padroes[phoneCountry.value] || '000000000';
    phoneInput.placeholder = mascara.replace(/0/g, 'x');
    phoneInput.value = aplicarMascara(phoneInput.value, mascara);
  }

  phoneCountry.addEventListener('change', setPlaceholderEFormatacao);
  phoneInput.addEventListener('input', setPlaceholderEFormatacao);
  setPlaceholderEFormatacao();
}

  // ====== PREVIEW DE FOTO ======
  function configurarFotoPreview() {
    const input = document.getElementById('photoInput');
    const preview = document.getElementById('photoPreview');
    if (!input || !preview) return;

    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        preview.style.backgroundImage = `url(${reader.result})`;
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundPosition = 'center';
        preview.innerHTML = '';
      };
      reader.readAsDataURL(file);
    });
  }

  // ====== ENVIO DO FORMULÁRIO ======
  function configurarEnvioFormulario() {
    if (!addForm) return;
    // Evita múltiplos listeners em hot reloads
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isFora = document.getElementById('state').value === 'EXT';
      const cidadeValor = isFora ? (document.getElementById('cityFree')?.value || '—')
                                 : (document.getElementById('city')?.value || '—');

      const novoPerfil = {
        nome: document.getElementById("name").value,
        apelido: document.getElementById("nickname").value,
        nascimento: document.getElementById("birthday")?.value || '',
        curso: document.getElementById("course").value,
        ano: document.getElementById("year").value,
        estado: document.getElementById("state").value,
        cidade: cidadeValor,
        empresa: document.getElementById("company").value || "—",
        cargo: document.getElementById("role").value || "Prefiro não informar",
        email: document.getElementById("email").value || "—",
        paisfone: document.getElementById("phoneCountry").value || "+55",
        telefone: document.getElementById("phone").value || "—",
        linkedin: document.getElementById("linkedin").value || "—",
        bio: document.getElementById("bio").value || "Sem biografia.",
        habilidades: "",
        experiencia: "Experiência não especificada",
        foto: "https://via.placeholder.com/100"
      };

      // Adiciona ao array principal
      dadosAlumni.push(novoPerfil);
      num_total = dadosAlumni.length;

      // Atualiza dropdown de anos se necessário
      if (ano_atual && ano_atual.tagName === 'SELECT') {
        const valores = Array.from(ano_atual.options).map(o => o.value).filter(Boolean);
        if (!valores.includes(novoPerfil.ano)) {
          ano_atual.insertAdjacentHTML('beforeend', `<option value="${novoPerfil.ano}">${novoPerfil.ano}</option>`);
        }
      }

      exibirDados();
      fecharAddModal();
      addForm.reset();
      lucide.createIcons();
    });
  }

  // ====== FILTROS ======
  function configurarFiltros() {
    if (curso_atual) curso_atual.addEventListener('change', exibirDados);
    if (ano_atual)   ano_atual.addEventListener('change', exibirDados);
    if (nome_atual)  nome_atual.addEventListener('keyup',  exibirDados);
  }

  // ====== MODAIS ======
  function abrirAddModal() { addModal.style.display = 'flex'; }
  function fecharAddModal() { addModal.style.display = 'none'; addForm && addForm.reset && addForm.reset(); }

  openAddBtn && openAddBtn.addEventListener('click', abrirAddModal);
  closeAddBtn && closeAddBtn.addEventListener('click', fecharAddModal);
  cancelAddBtn && cancelAddBtn.addEventListener('click', fecharAddModal);
  window.addEventListener('click', (e) => { if (e.target === addModal) fecharAddModal(); });

  function abrirModalPerfil(card) {
    document.getElementById("modalName").textContent = card.dataset.nome;
    document.getElementById("modalHeadline").textContent = `${card.dataset.cargo} na ${card.dataset.empresa}`;
    document.getElementById("modalCourse").textContent = `${card.dataset.curso} • Turma de ${card.dataset.ano}`;
    document.getElementById("modalCity").textContent = `${card.dataset.cidade || '—'}, ${card.dataset.estado || '—'}`;
    document.getElementById("modalExperience").textContent = card.dataset.experiencia || 'Experiência não especificada';
    document.getElementById("modalBio").textContent = card.dataset.bio || 'Sem biografia.';
    document.getElementById("modalEmail").textContent = card.dataset.email || '—';
    document.getElementById("modalPhone").textContent = `(${card.dataset.paisfone || '+55'}) ${card.dataset.telefone || '—'}`;
    document.getElementById("modalLinkedin").textContent = card.dataset.linkedin || '—';
    document.getElementById("modalCompany").textContent = card.dataset.empresa || '—';
    document.getElementById("modalPosition").textContent = card.dataset.cargo || 'Prefiro não informar';

    const modalPhoto = profileModal.querySelector(".profile-header img");
    const cardImg = card.querySelector("img");
    modalPhoto.src = cardImg ? cardImg.src : "https://via.placeholder.com/100";

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
  function fecharModalPerfil() { profileModal.classList.remove("show"); }
  function aplicarEventoCard(card) { card.addEventListener("click", () => abrirModalPerfil(card)); }
  closeProfileBtn && closeProfileBtn.addEventListener('click', fecharModalPerfil);
  profileModal.addEventListener('click', (e) => { if (e.target === profileModal) fecharModalPerfil(); });

  // ====== SETUP IMEDIATO (não depende do fetch) ======
  configurarEnvioFormulario();     // <— conecta o submit já na largada
  configurarFormulario();
  configurarMascarasTelefone();
  configurarFotoPreview();
  configurarFiltros();

  // ====== START ======
  lucide.createIcons();
  carregarJSONs();
});
