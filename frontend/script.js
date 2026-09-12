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

    let totalAlerta = 0;

    estoque.forEach(item => {
      const linha = document.createElement("tr");

      const estoqueBaixo = item.Quantidade_Atual <= item.Quantidade_Minima;
      if (estoqueBaixo) {
        linha.classList.add("estoque-baixo");
        totalAlerta++;
      }

      const dataFormatada = item.Ultima_Atualizacao
        ? new Date(item.Ultima_Atualizacao).toLocaleString("pt-BR")
        : "-";

      const badge = estoqueBaixo
        ? `<span class="badge badge-alerta">Baixo</span>`
        : `<span class="badge badge-ok">OK</span>`;

      linha.innerHTML = `
        <td>${item.Item}</td>
        <td>${item.Unidade_Medida}</td>
        <td>${item.Quantidade_Atual}</td>
        <td>${item.Quantidade_Minima}</td>
        <td>${dataFormatada}</td>
        <td>${badge}</td>
      `;

      corpoTabela.appendChild(linha);
    });

    totalItensEl.textContent = estoque.length;
    totalAlertaEl.textContent = totalAlerta;

    statusEl.textContent = `Última consulta: ${new Date().toLocaleTimeString("pt-BR")}`;
  } catch (erro) {
    statusEl.textContent = "Erro ao carregar dados do estoque.";
    console.error(erro);
  }
}

document.getElementById("btnAtualizar").addEventListener("click", carregarEstoque);

carregarEstoque();
