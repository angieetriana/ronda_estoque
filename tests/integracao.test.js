test("testCarregarEstoqueComSucesso", async () => {
  document.body.innerHTML = `
    <p id="statusCarregamento"></p>
    <span id="totalItens"></span>
    <span id="totalAlerta"></span>
    <table><tbody id="corpoTabela"></tbody></table>
    <button id="btnAtualizar"></button>
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

  const linhas = document.querySelectorAll("#corpoTabela tr");
  expect(linhas.length).toBe(2);
  expect(document.getElementById("totalItens").textContent).toBe("2");
  expect(document.getElementById("totalAlerta").textContent).toBe("1");
  expect(linhas[0].classList.contains("estoque-baixo")).toBe(true);
});

test("testCarregarEstoqueComErro", async () => {
  document.body.innerHTML = `
    <p id="statusCarregamento"></p>
    <span id="totalItens"></span>
    <span id="totalAlerta"></span>
    <table><tbody id="corpoTabela"></tbody></table>
    <button id="btnAtualizar"></button>
  `;

  global.fetch = jest.fn().mockRejectedValue(new Error("Falha de rede"));

  jest.resetModules();
  require("../frontend/logica.js");
  require("../frontend/script.js");

  await new Promise(resolve => setTimeout(resolve, 0));

  expect(document.getElementById("statusCarregamento").textContent).toMatch(/Erro/);
  expect(document.querySelectorAll("#corpoTabela tr").length).toBe(0);
});

test("testBotaoAtualizarRecarregaDados", async () => {
  document.body.innerHTML = `
    <p id="statusCarregamento"></p>
    <span id="totalItens"></span>
    <span id="totalAlerta"></span>
    <table><tbody id="corpoTabela"></tbody></table>
    <button id="btnAtualizar"></button>
  `;

  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve([]),
  });

  jest.resetModules();
  require("../frontend/logica.js");
  require("../frontend/script.js");

  await new Promise(resolve => setTimeout(resolve, 0));

  document.getElementById("btnAtualizar").click();
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(global.fetch).toHaveBeenCalledTimes(2);
});
