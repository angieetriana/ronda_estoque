/**
 * @jest-environment jsdom
 */

test("testCarregarEstoqueComSucesso", async () => {
  // 1. Monta o HTML mínimo que o script.js espera encontrar na página
  document.body.innerHTML = `
    <p id="statusCarregamento"></p>
    <span id="totalItens"></span>
    <div id="cardAlerta">
      <span id="totalAlerta"></span>
      <ul id="listaAlertaNomes" hidden></ul>
    </div>
    <span id="percentualOk"></span>
    <div id="bannerStatus" hidden><span id="bannerTexto"></span></div>
    <div id="listaItens"></div>
    <button id="btnAtualizar"></button>
    <div class="abas">
      <button class="aba aba-ativa" data-filtro="todos"></button>
      <button class="aba" data-filtro="baixo"></button>
      <button class="aba" data-filtro="ok"></button>
    </div>
  `;

  // 2. Substitui o fetch real por um mock que devolve dados falsos de estoque
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve([
      { Item: "Arroz", Unidade_Medida: "KG", Quantidade_Atual: 5, Quantidade_Minima: 10, Ultima_Atualizacao: "2026-09-06T18:00:00.000Z" },
      { Item: "Feijão", Unidade_Medida: "KG", Quantidade_Atual: 20, Quantidade_Minima: 10, Ultima_Atualizacao: "2026-09-06T18:00:00.000Z" },
    ]),
  });

  // 3. Carrega os scripts reais do projeto (eles rodam carregarEstoque() sozinhos)
  jest.resetModules();
  require("../frontend/logica.js");
  require("../frontend/script.js");

  // 4. Espera a Promise interna do fetch/render terminar
  await new Promise(resolve => setTimeout(resolve, 0));

  // 5. Verifica se os cards e o resumo foram preenchidos corretamente
  const cards = document.querySelectorAll("#listaItens .card-item");
  expect(cards.length).toBe(2);
  expect(document.getElementById("totalItens").textContent).toBe("2");
  expect(document.getElementById("totalAlerta").textContent).toBe("1");
  expect(document.getElementById("percentualOk").textContent).toBe("50%");
  expect(cards[0].classList.contains("card-item-alerta")).toBe(true);
});

test("testCarregarEstoqueComErro", async () => {
  document.body.innerHTML = `
    <p id="statusCarregamento"></p>
    <span id="totalItens"></span>
    <div id="cardAlerta">
      <span id="totalAlerta"></span>
      <ul id="listaAlertaNomes" hidden></ul>
    </div>
    <span id="percentualOk"></span>
    <div id="bannerStatus" hidden><span id="bannerTexto"></span></div>
    <div id="listaItens"></div>
    <button id="btnAtualizar"></button>
    <div class="abas">
      <button class="aba aba-ativa" data-filtro="todos"></button>
      <button class="aba" data-filtro="baixo"></button>
      <button class="aba" data-filtro="ok"></button>
    </div>
  `;

  // Simula a API fora do ar / falha de rede
  global.fetch = jest.fn().mockRejectedValue(new Error("Falha de rede"));

  jest.resetModules();
  require("../frontend/logica.js");
  require("../frontend/script.js");

  await new Promise(resolve => setTimeout(resolve, 0));

  expect(document.getElementById("statusCarregamento").textContent).toMatch(/Erro/);
  expect(document.querySelectorAll("#listaItens .card-item").length).toBe(0);
});

test("testBotaoAtualizarRecarregaDados", async () => {
  document.body.innerHTML = `
    <p id="statusCarregamento"></p>
    <span id="totalItens"></span>
    <div id="cardAlerta">
      <span id="totalAlerta"></span>
      <ul id="listaAlertaNomes" hidden></ul>
    </div>
    <span id="percentualOk"></span>
    <div id="bannerStatus" hidden><span id="bannerTexto"></span></div>
    <div id="listaItens"></div>
    <button id="btnAtualizar"></button>
    <div class="abas">
      <button class="aba aba-ativa" data-filtro="todos"></button>
      <button class="aba" data-filtro="baixo"></button>
      <button class="aba" data-filtro="ok"></button>
    </div>
  `;

  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve([]),
  });

  jest.resetModules();
  require("../frontend/logica.js");
  require("../frontend/script.js");

  // Primeira chamada acontece sozinha, ao carregar a página
  await new Promise(resolve => setTimeout(resolve, 0));

  // Clicar no botão deve disparar uma segunda chamada ao fetch
  document.getElementById("btnAtualizar").click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test("testFiltroDeAbasExibeSomenteItensDoFiltro", async () => {
  document.body.innerHTML = `
    <p id="statusCarregamento"></p>
    <span id="totalItens"></span>
    <div id="cardAlerta">
      <span id="totalAlerta"></span>
      <ul id="listaAlertaNomes" hidden></ul>
    </div>
    <span id="percentualOk"></span>
    <div id="bannerStatus" hidden><span id="bannerTexto"></span></div>
    <div id="listaItens"></div>
    <button id="btnAtualizar"></button>
    <div class="abas">
      <button class="aba aba-ativa" data-filtro="todos"></button>
      <button class="aba" data-filtro="baixo"></button>
      <button class="aba" data-filtro="ok"></button>
    </div>
  `;

  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve([
      { Item: "Arroz", Unidade_Medida: "KG", Quantidade_Atual: 5, Quantidade_Minima: 10, Ultima_Atualizacao: "2026-09-06T18:00:00.000Z" },
      { Item: "Feijão", Unidade_Medida: "KG", Quantidade_Atual: 20, Quantidade_Minima: 10, Ultima_Atualizacao: "2026-09-06T18:00:00.000Z" },
    ]),
  });

  jest.resetModules();
  require("../frontend/logica.js");
  require("../frontend/script.js");

  await new Promise(resolve => setTimeout(resolve, 0));

  const abaBaixo = document.querySelector('[data-filtro="baixo"]');
  abaBaixo.click();

  const cards = document.querySelectorAll("#listaItens .card-item");
  expect(cards.length).toBe(1);
  expect(cards[0].classList.contains("card-item-alerta")).toBe(true);
  expect(abaBaixo.classList.contains("aba-ativa")).toBe(true);
});

test("testCardAlertaExpandeEMostraNomesDosItensBaixos", async () => {
  document.body.innerHTML = `
    <p id="statusCarregamento"></p>
    <span id="totalItens"></span>
    <div id="cardAlerta">
      <span id="totalAlerta"></span>
      <ul id="listaAlertaNomes" hidden></ul>
    </div>
    <span id="percentualOk"></span>
    <div id="bannerStatus" hidden><span id="bannerTexto"></span></div>
    <div id="listaItens"></div>
    <button id="btnAtualizar"></button>
    <div class="abas">
      <button class="aba aba-ativa" data-filtro="todos"></button>
      <button class="aba" data-filtro="baixo"></button>
      <button class="aba" data-filtro="ok"></button>
    </div>
  `;

  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve([
      { Item: "Arroz", Unidade_Medida: "KG", Quantidade_Atual: 5, Quantidade_Minima: 10, Ultima_Atualizacao: "2026-09-06T18:00:00.000Z" },
      { Item: "Feijão", Unidade_Medida: "KG", Quantidade_Atual: 20, Quantidade_Minima: 10, Ultima_Atualizacao: "2026-09-06T18:00:00.000Z" },
    ]),
  });

  jest.resetModules();
  require("../frontend/logica.js");
  require("../frontend/script.js");

  await new Promise(resolve => setTimeout(resolve, 0));

  const listaAlertaEl = document.getElementById("listaAlertaNomes");
  expect(listaAlertaEl.hidden).toBe(true);
  expect(listaAlertaEl.textContent).toContain("Arroz");
  expect(listaAlertaEl.textContent).not.toContain("Feijão");

  document.getElementById("cardAlerta").click();
  expect(listaAlertaEl.hidden).toBe(false);

  document.getElementById("cardAlerta").click();
  expect(listaAlertaEl.hidden).toBe(true);
});
