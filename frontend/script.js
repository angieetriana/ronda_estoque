const URL_API = "https://script.google.com/macros/s/AKfycbw2z0cqPg2wvxG6Kso4SMlr7EUwG8XceBCZR-T7KsakL_hvBWiOeGTgF3Ehc0naO9ZxSQ/exec";

async function carregarEstoque() {
  const statusEl = document.getElementById("statusCarregamento");
  const corpoTabela = document.getElementById("corpoTabela");
  const totalItensEl = document.getElementById("totalItens");
  const totalAlertaEl = document.getElementById("totalAlerta");

  statusEl.textContent = "Carregando dados...";
  corpoTabela.innerHTML = "";

  try {
    const resposta = await fetch(URL_API);
    const estoque = await resposta.json();

    estoque.forEach(item => {
      const linha = document.createElement("tr");
      const baixo = estoqueEstaBaixo(item);

      if (baixo) {
        linha.classList.add("estoque-baixo");
      }

      linha.innerHTML = `
        <td>${item.Item}</td>
        <td>${item.Unidade_Medida}</td>
        <td>${item.Quantidade_Atual}</td>
        <td>${item.Quantidade_Minima}</td>
        <td>${formatarData(item.Ultima_Atualizacao)}</td>
        <td>${gerarBadgeHtml(baixo)}</td>
      `;

      corpoTabela.appendChild(linha);
    });

    const resumo = calcularResumo(estoque);
    totalItensEl.textContent = resumo.totalItens;
    totalAlertaEl.textContent = resumo.totalAlerta;

    statusEl.textContent = `Última consulta: ${new Date().toLocaleTimeString("pt-BR")}`;
  } catch (erro) {
    statusEl.textContent = "Erro ao carregar dados do estoque.";
    console.error(erro);
  }
}

document.getElementById("btnAtualizar").addEventListener("click", carregarEstoque);

carregarEstoque();
