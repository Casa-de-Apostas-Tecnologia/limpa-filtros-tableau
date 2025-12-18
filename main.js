
const RESET_RULES = [
  { name: "Par_AffiliateID", type: "STRING", value: "" },
  { name: "Data_Inicio", type: "DATE", value: "2026-01-01" },
  { name: "Data_Fim", type: "DATE", value: "2026-01-01" }
];

/* ================================ */

function coerceValue(type, raw) {
  switch (type) {
    case "INTEGER": return parseInt(raw, 10);
    case "FLOAT": return parseFloat(raw);
    case "BOOLEAN": return raw === true || raw === "true";
    case "DATE": return new Date(raw); 
    case "DATETIME": return new Date(String(raw).replace(" ", "T"));
    default: return raw; 
  }
}

async function clearParameters() {
  const dashboard = tableau.extensions.dashboardContent.dashboard;
  const params = await dashboard.getParametersAsync();
  const paramMap = new Map(params.map(p => [p.name, p]));

  for (const rule of RESET_RULES) {
    const param = paramMap.get(rule.name);

    if (!param) {
      console.warn(`Parâmetro não encontrado: ${rule.name}`);
      continue;
    }

    const value = coerceValue(rule.type, rule.value);
    await param.changeValueAsync(value);
  }
}

(async function init() {
  await tableau.extensions.initializeAsync();

  const btn = document.getElementById("btnClear");
  if (btn) {
    btn.addEventListener("click", () => {
      clearParameters().catch(err => console.error(err));
    });
  }
})();
