export default [
  {
    files: ["frontend/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        console: "readonly",
        module: "readonly",
        global: "readonly",
        // Definidas em logica.js e usadas em script.js — no navegador as duas
        // <script> tags compartilham o mesmo escopo global, então isso não é
        // um erro real de variável indefinida.
        estoqueEstaBaixo: "readonly",
        formatarData: "readonly",
        gerarBadgeHtml: "readonly",
        calcularResumo: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
