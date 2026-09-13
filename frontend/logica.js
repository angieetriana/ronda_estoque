function estoqueEstaBaixo(item) {
  return item.Quantidade_Atual <= item.Quantidade_Minima;
}

function formatarData(valorIso) {
  if (!valorIso) {
    return "-";
  }
  return new Date(valorIso).toLocaleString("pt-BR");
}

function gerarBadgeHtml(baixo) {
  return baixo
    ? '<span class="badge badge-alerta">Baixo</span>'
    : '<span class="badge badge-ok">OK</span>';
}

function calcularResumo(estoque) {
  const totalItens = estoque.length;
  const totalAlerta = estoque.filter(estoqueEstaBaixo).length;
  return { totalItens, totalAlerta };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { estoqueEstaBaixo, formatarData, gerarBadgeHtml, calcularResumo };

  // Em Node/Jest cada require() tem seu próprio escopo de módulo, diferente do
  // navegador (onde <script> tags compartilham o mesmo escopo global). Expor
  // aqui replica, só para os testes, o comportamento real do navegador.
  if (typeof global !== "undefined") {
    global.estoqueEstaBaixo = estoqueEstaBaixo;
    global.formatarData = formatarData;
    global.gerarBadgeHtml = gerarBadgeHtml;
    global.calcularResumo = calcularResumo;
  }
}
