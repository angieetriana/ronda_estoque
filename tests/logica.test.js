const { estoqueEstaBaixo, formatarData, gerarBadgeHtml, calcularResumo } = require("../frontend/logica.js");

test("testEstoqueEstaBaixo", () => {
  expect(estoqueEstaBaixo({ Quantidade_Atual: 10, Quantidade_Minima: 10 })).toBe(true);
  expect(estoqueEstaBaixo({ Quantidade_Atual: 5, Quantidade_Minima: 10 })).toBe(true);
  expect(estoqueEstaBaixo({ Quantidade_Atual: 15, Quantidade_Minima: 10 })).toBe(false);
});

test("testFormatarData", () => {
  expect(formatarData(null)).toBe("-");
  expect(formatarData("")).toBe("-");
  expect(formatarData(undefined)).toBe("-");

  const resultado = formatarData("2026-09-06T18:00:00.000Z");
  expect(typeof resultado).toBe("string");
  expect(resultado).not.toBe("-");
});

test("testGerarBadgeHtml", () => {
  expect(gerarBadgeHtml(true)).toContain("badge-alerta");
  expect(gerarBadgeHtml(false)).toContain("badge-ok");
});

test("testCalcularResumo", () => {
  const estoque = [
    { Quantidade_Atual: 5, Quantidade_Minima: 10 },
    { Quantidade_Atual: 20, Quantidade_Minima: 10 },
    { Quantidade_Atual: 10, Quantidade_Minima: 10 },
  ];

  expect(calcularResumo(estoque)).toEqual({ totalItens: 3, totalAlerta: 2 });
  expect(calcularResumo([])).toEqual({ totalItens: 0, totalAlerta: 0 });
});
