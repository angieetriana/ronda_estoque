const URL_API = "https://script.google.com/macros/s/AKfycbw2z0cqPg2wvxG6Kso4SMlr7EUwG8XceBCZR-T7KsakL_hvBWiOeGTgF3Ehc0naO9ZxSQ/exec";

let ultimoEstoqueCarregado = [];
let filtroAtivo = "todos";

async function carregarEstoque() {
  const statusEl = document.getElementById("statusCarregamento");
  const bannerEl = document.getElementById("bannerStatus");
  const bannerTextoEl = document.getElementById("bannerTexto");
  const totalItensEl = document.getElementById("totalItens");
  const totalAlertaEl = document.getElementById("totalAlerta");
  const percentualOkEl = document.getElementById("percentualOk");

  const botaoAtualizar = document.getElementById("btnAtualizar");

  statusEl.textContent = "Carregando dados...";
  bannerEl.hidden = true;
  botaoAtualizar.disabled = true;
  botaoAtualizar.textContent = "Atualizando...";

  try {
    const resposta = await fetch(URL_API);
    const estoque = await resposta.json();

    ultimoEstoqueCarregado = estoque;

    const resumo = calcularResumo(estoque);
    totalItensEl.textContent = resumo.totalItens;
    totalAlertaEl.textContent = resumo.totalAlerta;

    const totalOk = resumo.totalItens - resumo.totalAlerta;
    const percentual = resumo.totalItens > 0
      ? Math.round((totalOk / resumo.totalItens) * 100)
      : 0;
    percentualOkEl.textContent = `${percentual}%`;

    document.getElementById("contagemTodos").textContent = `(${resumo.totalItens})`;
    document.getElementById("contagemBaixo").textContent = `(${resumo.totalAlerta})`;
    document.getElementById("contagemOk").textContent = `(${totalOk})`;

    renderizarLista(estoque, filtroAtivo);
    renderizarNomesAlerta(estoque);

    const horario = new Date().toLocaleTimeString("pt-BR");
    statusEl.textContent = `Última consulta: ${horario}`;
    bannerTextoEl.textContent = `Dados atualizados às ${horario}`;
    bannerEl.hidden = false;
  } catch (erro) {
    statusEl.textContent = "Erro ao carregar dados do estoque.";
    console.error(erro);
  } finally {
    botaoAtualizar.disabled = false;
    botaoAtualizar.textContent = "↻ Atualizar";
  }
}

function renderizarLista(estoque, filtro) {
  const listaEl = document.getElementById("listaItens");
  listaEl.innerHTML = "";

  const itensFiltrados = estoque.filter(item => {
    const baixo = estoqueEstaBaixo(item);
    if (filtro === "baixo") return baixo;
    if (filtro === "ok") return !baixo;
    return true;
  });

  itensFiltrados.forEach((item, indice) => {
    const baixo = estoqueEstaBaixo(item);
    const card = document.createElement("div");
    card.className = baixo ? "card-item card-item-alerta" : "card-item";

    card.innerHTML = `
      <span class="card-item-tag">#${indice + 1}</span>
      <h3 class="card-item-titulo">${item.Unidade_Medida} · ${item.Item}</h3>
      ${gerarBadgeHtml(baixo)}
      <p class="card-item-detalhe">Mínimo: ${item.Quantidade_Minima} · Atualizado em ${formatarData(item.Ultima_Atualizacao)}</p>
      <span class="card-item-valor ${baixo ? "valor-alerta" : ""}">${item.Quantidade_Atual}</span>
    `;

    listaEl.appendChild(card);
  });
}

function renderizarNomesAlerta(estoque) {
  const listaEl = document.getElementById("listaAlertaNomes");
  const itensBaixo = estoque.filter(estoqueEstaBaixo);

  if (itensBaixo.length === 0) {
    listaEl.innerHTML = "<li>Nenhum item em alerta</li>";
    return;
  }

  listaEl.innerHTML = "";
  itensBaixo.forEach(item => {
    const linha = document.createElement("li");
    linha.textContent = item.Item;
    listaEl.appendChild(linha);
  });
}

document.getElementById("cardAlerta").addEventListener("click", () => {
  const cardEl = document.getElementById("cardAlerta");
  const listaEl = document.getElementById("listaAlertaNomes");
  listaEl.hidden = !listaEl.hidden;
  cardEl.classList.toggle("aberto");
});

document.getElementById("btnAtualizar").addEventListener("click", carregarEstoque);

document.querySelectorAll(".aba").forEach(botao => {
  botao.addEventListener("click", () => {
    document.querySelectorAll(".aba").forEach(b => b.classList.remove("aba-ativa"));
    botao.classList.add("aba-ativa");
    filtroAtivo = botao.dataset.filtro;
    renderizarLista(ultimoEstoqueCarregado, filtroAtivo);
    document.getElementById("listaItens").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

carregarEstoque();
