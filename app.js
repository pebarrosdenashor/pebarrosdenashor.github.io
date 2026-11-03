import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";

/* =========================================================
   Ficha de Ordem Paranormal — extensão para Owlbear Rodeo
   ========================================================= */

const NS = "io.github.pebarrosdenashor.ficha-op";
const CHANNEL = NS + "/sync";
const MODAL_ID = NS + "/modal";
const IS_MODAL = new URLSearchParams(location.search).has("modal");

/* ---------- Dados fixos do sistema ---------- */
const ATTRS = [["FOR", "Força"], ["AGI", "Agilidade"], ["INT", "Intelecto"], ["VIG", "Vigor"], ["PRE", "Presença"]];
// [nome, atributo, marcas]  + penalidade de carga, * somente treinada
const PERICIAS = [
  ["Acrobacia", "AGI", "+"], ["Adestramento", "PRE", "*"], ["Artes", "PRE", "*"], ["Atletismo", "FOR", ""],
  ["Atualidades", "INT", ""], ["Ciências", "INT", "*"], ["Crime", "AGI", "*+"], ["Diplomacia", "PRE", ""],
  ["Enganação", "PRE", ""], ["Fortitude", "VIG", ""], ["Furtividade", "AGI", "+"], ["Iniciativa", "AGI", ""],
  ["Intimidação", "PRE", ""], ["Intuição", "PRE", ""], ["Investigação", "INT", ""], ["Luta", "FOR", ""],
  ["Medicina", "INT", ""], ["Ocultismo", "INT", "*"], ["Percepção", "PRE", ""], ["Pilotagem", "AGI", "*"],
  ["Pontaria", "AGI", ""], ["Profissão", "INT", "*"], ["Reflexos", "AGI", ""], ["Religião", "PRE", "*"],
  ["Sobrevivência", "INT", ""], ["Tática", "INT", "*"], ["Tecnologia", "INT", "*"], ["Vontade", "PRE", ""],
];
const TREINO = [[0, "—"], [5, "Treinado"], [10, "Veterano"], [15, "Expert"]];
const CLASSES = ["Combatente", "Especialista", "Ocultista"];
const NEX_OPTS = [...Array.from({ length: 19 }, (_, i) => (i + 1) * 5), 99];
const TIPOS_DANO = ["Balístico", "Cortante", "Impacto", "Perfurante", "Sangue", "Morte", "Conhecimento", "Energia", "Medo", "Mental", "Frio", "Fogo", "Químico", "Eletricidade"];
const ALCANCES = ["Corpo a Corpo", "Curto", "Médio", "Longo", "Extremo", "Ilimitado"];
const ELEMENTOS = ["Conhecimento", "Energia", "Medo", "Morte", "Sangue"];
const EXECUCOES = ["Padrão", "Movimento", "Completa", "Reação", "Livre"];
const ALC_RITUAL = ["Pessoal", "Toque", "Curto", "Médio", "Longo", "Extremo", "Ilimitado"];
const RES_PERICIA = ["—", "Fortitude", "Vontade", "Reflexos"];
const RES_EFEITO = ["—", "Anula", "Desacredita", "Parcial", "Reduz à Metade"];
const PATENTES = ["Mundano", "Recruta", "Operador", "Agente Especial", "Oficial de Operações", "Agente de Elite"];
const CREDITO = ["Baixo", "Médio", "Alto", "Ilimitado"];
const CATS = [[0, "0"], [1, "I"], [2, "II"], [3, "III"], [4, "IV"]];
const ITEM_LISTS = ["armas", "municoes", "protecoes", "gerais", "amaldicoados"];

/* ---------- Esquemas das listas (ataques, rituais, itens…) ---------- */
const F = (k, label, type = "text", extra = {}) => ({ k, label, type, ...extra });
const nomeCat = (v) => (CATS.find((c) => String(c[0]) === String(v)) || CATS[0])[1];
const SCHEMAS = {
  ataques: {
    title: "ataque",
    fields: [
      F("nome", "Nome", "text", { wide: true }), F("dano", "Dano (dados)", "text", { ph: "1d8" }),
      F("tipo", "Tipo de dano", "select", { opts: TIPOS_DANO }),
      F("critico", "Crítico (1–20)", "num", { min: 1, max: 20, def: 20 }), F("mult", "Multiplicador", "num", { min: 1, max: 9, def: 2 }),
      F("bonus", "Bônus de ataque", "num", { def: 0 }), F("alcance", "Alcance", "select", { opts: ALCANCES }),
      F("pericia", "Perícia base", "select", { opts: ["—", ...PERICIAS.map((p) => p[0])] }),
      F("attrDano", "Atributo de dano", "select", { opts: ["Nenhum", ...ATTRS.map((a) => a[1])] }),
      F("adicionais", "Danos adicionais", "dmglist"), F("img", "Imagem", "img"), F("desc", "Descrição", "textarea"),
    ],
    info: (it) => [it.dano, it.tipo].filter(Boolean).join(" · "),
  },
  habilidades: {
    title: "habilidade",
    fields: [F("nome", "Nome", "text", { wide: true }), F("img", "Imagem", "img"), F("desc", "Descrição", "textarea")],
    info: () => "",
  },
  rituais: {
    title: "ritual",
    fields: [
      F("nome", "Nome", "text", { wide: true }), F("elemento", "Elemento", "select", { opts: ELEMENTOS }),
      F("circulo", "Círculo", "select", { opts: [1, 2, 3, 4].map((n) => [n, n + "º"]) }),
      F("execucao", "Execução", "select", { opts: EXECUCOES }), F("alcance", "Alcance", "select", { opts: ALC_RITUAL }),
      F("area", "Área / Alvo", "text"), F("duracao", "Duração", "text"),
      F("resPericia", "Resistência (perícia)", "select", { opts: RES_PERICIA }),
      F("resEfeito", "Resistência (efeito)", "select", { opts: RES_EFEITO }),
      F("dados", "Dados", "text"), F("dadosDiscente", "Dados — Discente", "text"), F("dadosVerdadeiro", "Dados — Verdadeiro", "text"),
      F("img", "Imagem", "img"), F("desc", "Descrição", "textarea"),
      F("descDiscente", "Descrição — Discente", "textarea"), F("descVerdadeiro", "Descrição — Verdadeiro", "textarea"),
    ],
    info: (it) => `${it.elemento || ""} ${it.circulo ? it.circulo + "º" : ""}`,
  },
  armas: {
    title: "arma",
    fields: [
      F("nome", "Nome", "text", { wide: true }),
      F("prof", "Proficiência", "select", { opts: ["Arma Simples", "Arma Tática", "Arma Pesada"] }),
      F("tipo", "Tipo", "select", { opts: ["Corpo a Corpo", "Arma de Arremesso", "Arma de Disparo", "Arma de Fogo"] }),
      F("empunhadura", "Empunhadura", "select", { opts: ["Leve", "Uma Mão", "Duas Mãos"] }),
      F("tipoDano", "Tipo de dano", "select", { opts: TIPOS_DANO }),
      F("dano", "Dano (dados)", "text", { ph: "1d6" }), F("danoFixo", "Dano fixo (+)", "num", { def: 0 }),
      F("dano2", "Dano secundário (dados)", "text"), F("dano2Fixo", "Dano secundário fixo (+)", "num", { def: 0 }),
      F("critico", "Crítico (1–20)", "num", { min: 1, max: 20, def: 20 }), F("mult", "Multiplicador", "num", { min: 1, max: 9, def: 2 }),
      F("alcance", "Alcance", "select", { opts: ALCANCES }), F("categoria", "Categoria", "select", { opts: CATS }),
      F("espacos", "Espaços", "num", { def: 1, min: 0 }),
      F("melhorias", "Melhorias", "strlist"), F("img", "Imagem", "img"), F("desc", "Descrição", "textarea"),
    ],
    info: (it) => [dmgTxt(it.dano, it.danoFixo), it.tipoDano, "Cat. " + nomeCat(it.categoria)].filter(Boolean).join(" · "),
  },
  municoes: {
    title: "munição",
    fields: [
      F("nome", "Nome", "text", { wide: true }), F("categoria", "Categoria", "select", { opts: CATS }),
      F("espacos", "Espaços", "num", { def: 1, min: 0 }), F("img", "Imagem", "img"), F("desc", "Descrição", "textarea"),
    ],
    info: (it) => "Cat. " + nomeCat(it.categoria),
  },
  protecoes: {
    title: "proteção",
    fields: [
      F("nome", "Nome", "text", { wide: true }), F("defesa", "Defesa", "num", { def: 0 }),
      F("categoria", "Categoria", "select", { opts: CATS }), F("espacos", "Espaços", "num", { def: 1, min: 0 }),
      F("melhorias", "Melhorias", "strlist"), F("img", "Imagem", "img"), F("desc", "Descrição", "textarea"),
    ],
    info: (it) => `+${num(it.defesa)} Def · Cat. ${nomeCat(it.categoria)}`,
  },
  gerais: {
    title: "item geral",
    fields: [
      F("nome", "Nome", "text", { wide: true }),
      F("tipo", "Tipo", "select", { opts: ["Acessórios", "Explosivos", "Itens Operacionais", "Itens Paranormais"] }),
      F("categoria", "Categoria", "select", { opts: CATS }), F("espacos", "Espaços", "num", { def: 1, min: 0 }),
      F("melhorias", "Melhorias", "strlist"), F("img", "Imagem", "img"), F("desc", "Descrição", "textarea"),
    ],
    info: (it) => `${it.tipo || ""} · Cat. ${nomeCat(it.categoria)}`,
  },
  amaldicoados: {
    title: "item amaldiçoado",
    fields: [
      F("nome", "Nome", "text", { wide: true }),
      F("elemento", "Elemento", "select", { opts: ["Sangue", "Morte", "Energia", "Conhecimento", "Medo", "Varia"] }),
      F("categoria", "Categoria", "select", { opts: CATS }), F("espacos", "Espaços", "num", { def: 1, min: 0 }),
      F("img", "Imagem", "img"), F("desc", "Descrição", "textarea"),
    ],
    info: (it) => `${it.elemento || ""} · Cat. ${nomeCat(it.categoria)}`,
  },
};
const LIST_PATHS = { ataques: "ataques", habilidades: "habilidades", rituais: "rituais.lista", armas: "armas", municoes: "municoes", protecoes: "protecoes", gerais: "gerais", amaldicoados: "amaldicoados" };

/* ---------- Utilidades ---------- */
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (n) => (n >= 0 ? "+" + n : String(n));
function dmgTxt(d, fixo) { const f = num(fixo); return d ? d + (f ? (f > 0 ? "+" : "") + f : "") : (f ? String(f) : ""); }
function getPath(o, p) { return p.split(".").reduce((a, k) => (a == null ? a : a[k]), o); }
function setPath(o, p, v) {
  const ks = p.split("."); const last = ks.pop();
  const t = ks.reduce((a, k) => (a[k] ??= {}), o); t[last] = v;
}
function delPath(o, p) {
  const ks = p.split("."); const idx = Number(ks.pop()); const arr = getPath(o, ks.join("."));
  if (Array.isArray(arr)) arr.splice(idx, 1);
}
function normOpts(opts) { return opts.map((o) => (Array.isArray(o) ? o : [o, o])); }

/* ---------- Ficha nova ---------- */
function newItem(schema) {
  const it = { id: uid() };
  for (const f of schema.fields) {
    if (f.type === "strlist" || f.type === "dmglist") it[f.k] = [];
    else if (f.type === "num") it[f.k] = f.def ?? 0;
    else if (f.type === "select") it[f.k] = normOpts(f.opts)[0][0];
    else it[f.k] = "";
  }
  return it;
}
function newSheet() {
  const per = {};
  for (const [n, a] of PERICIAS) per[n] = { attr: a, treino: 0, outros: 0 };
  return {
    id: uid(), owner: { id: me.id, name: me.name }, updatedAt: Date.now(),
    header: { img: "", personagem: "Novo agente", jogador: me.name || "", origem: "", classe: "Combatente" },
    attrs: { FOR: 1, AGI: 1, INT: 1, VIG: 1, PRE: 1 },
    nex: 5, pdBonus: 0, desloc: 9,
    pv: { atual: 20, max: 20 }, pd: { atual: 6, max: 6 },
    defesa: { equip: 0, outros: 0 },
    resistencias: "", proficiencias: "",
    pericias: per,
    ataques: [], habilidades: [], rituais: { dt: 10, lista: [] },
    equip: { prestigio: 0, patente: "Recruta", limites: [0, 2, 0, 0, 0], credito: "Baixo", cargaMod: 0 },
    armas: [], municoes: [], protecoes: [], gerais: [], amaldicoados: [],
    notas: { anotacoes: "", aparencia: "", personalidade: "", historico: "", objetivo: "" },
  };
}
// Garante que fichas antigas ganhem campos novos em futuras versões
function upgrade(s) {
  const base = newSheet();
  for (const k of Object.keys(base)) if (s[k] === undefined) s[k] = base[k];
  for (const [n, a] of PERICIAS) if (!s.pericias[n]) s.pericias[n] = { attr: a, treino: 0, outros: 0 };
  for (const k of ["header", "equip", "notas", "defesa", "rituais"]) s[k] = { ...base[k], ...s[k] };
  return s;
}

/* ---------- Estado ---------- */
let obrOk = false;
let role = "PLAYER";
let me = { id: "local", name: "" };
let storeKey = NS + ":local";
let store = { own: {}, others: {}, currentId: null };
let tab = "principal";
const openCards = new Set();
let pendingImgPath = null;
let renderPending = false;

const isGM = () => role === "GM";
function allVisible() {
  const list = Object.values(store.own).map((s) => ({ s, own: true }));
  if (isGM()) for (const s of Object.values(store.others)) list.push({ s, own: false });
  return list;
}
function cur() {
  const id = store.currentId;
  return store.own[id] || (isGM() ? store.others[id] : null) || null;
}
function isOwnCurrent() { return !!store.own[store.currentId]; }

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(storeKey) || "null");
    if (raw && raw.own) store = { own: raw.own, others: raw.others || {}, currentId: raw.currentId };
  } catch (e) { /* armazenamento indisponível */ }
  for (const s of [...Object.values(store.own), ...Object.values(store.others)]) upgrade(s);
}
function persist() {
  try { localStorage.setItem(storeKey, JSON.stringify(store)); }
  catch (e) { toast("Não foi possível salvar: o armazenamento do navegador está cheio. Use imagens menores ou remova algumas."); }
}

/* ---------- Sincronização (broadcast em partes de ≤16 KB) ---------- */
const CHUNK = 5000;
const partial = {};
const syncTimers = {};

async function send(msg) {
  if (!obrOk) return;
  const s = JSON.stringify(msg);
  const n = Math.max(1, Math.ceil(s.length / CHUNK));
  const m = uid();
  for (let i = 0; i < n; i++) {
    try { await OBR.broadcast.sendMessage(CHANNEL, { m, i, n, d: s.slice(i * CHUNK, (i + 1) * CHUNK) }); }
    catch (e) { console.warn("Falha ao enviar", e); return; }
    if (n > 1) await sleep(70);
  }
}
function scheduleSync(sheet) {
  clearTimeout(syncTimers[sheet.id]);
  syncTimers[sheet.id] = setTimeout(() => send({ t: "sheet", sheet }), 1200);
}
function onChunk(data) {
  if (!data || !data.m) return;
  const p = (partial[data.m] ||= { n: data.n, parts: [], got: 0, at: Date.now() });
  if (p.parts[data.i] === undefined) { p.parts[data.i] = data.d; p.got++; }
  if (p.got === p.n) {
    delete partial[data.m];
    try { handle(JSON.parse(p.parts.join(""))); } catch (e) { console.warn("Mensagem inválida", e); }
  }
  for (const [k, v] of Object.entries(partial)) if (Date.now() - v.at > 60000) delete partial[k];
}
function handle(msg) {
  if (msg.t === "sheet") {
    const s = upgrade(msg.sheet);
    if (store.own[s.id]) { // mestre editou uma ficha minha
      if (num(s.updatedAt) <= num(store.own[s.id].updatedAt)) return;
      store.own[s.id] = s;
    } else if (isGM()) {
      const old = store.others[s.id];
      if (old && num(s.updatedAt) <= num(old.updatedAt)) return;
      store.others[s.id] = s;
    } else return;
    persist(); softRender();
  } else if (msg.t === "request") {
    pushAllOwn();
  } else if (msg.t === "delete") {
    if (store.own[msg.id] || store.others[msg.id]) {
      delete store.own[msg.id]; delete store.others[msg.id];
      if (store.currentId === msg.id) store.currentId = null;
      persist(); softRender();
    }
  } else if (msg.t === "roll") {
    if (obrOk) OBR.notification.show(msg.text);
  }
}
async function pushAllOwn() {
  for (const s of Object.values(store.own)) await send({ t: "sheet", sheet: s });
}

function touch() {
  const s = cur(); if (!s) return;
  s.updatedAt = Date.now();
  if (isOwnCurrent() && me.name) s.owner = { id: me.id, name: me.name };
  persist(); scheduleSync(s);
}

/* ---------- Cálculos ---------- */
function attrVal(s, a) { return clamp(num(s.attrs[a]), 0, 5); }
function periciaBonus(s, n) { const p = s.pericias[n]; return p ? num(p.treino) + num(p.outros) : 0; }
function pdLimiteBase(s) { return Math.round(num(s.nex) / 5); }
function defProtecoes(s) { return s.protecoes.reduce((a, p) => a + num(p.defesa), 0); }
function defesaTotal(s) { return 10 + attrVal(s, "AGI") + defProtecoes(s) + num(s.defesa.equip) + num(s.defesa.outros); }
function allItems(s) { return ITEM_LISTS.flatMap((k) => s[k]); }
function cargaAtual(s) { return allItems(s).reduce((a, it) => a + num(it.espacos), 0); }
function cargaMax(s) { return 5 * attrVal(s, "FOR") + num(s.equip.cargaMod); }
function catCount(s, c) { return allItems(s).filter((it) => num(it.categoria) === c).length; }

const CALC = {
  pdBase: (s) => pdLimiteBase(s),
  pdTotal: (s) => pdLimiteBase(s) + num(s.pdBonus),
  blocos: (s) => `${+(num(s.desloc) / 1.5).toFixed(1)} blocos`,
  agi: (s) => attrVal(s, "AGI"),
  defProt: (s) => defProtecoes(s),
  defesa: (s) => defesaTotal(s),
  bloqueio: (s) => periciaBonus(s, "Fortitude"),
  esquiva: (s) => defesaTotal(s) + periciaBonus(s, "Reflexos"),
  carga: (s) => cargaAtual(s),
  cargaMax: (s) => cargaMax(s),
  cat: (s, c) => catCount(s, Number(c)),
  pbonus: (s, n) => fmt(periciaBonus(s, n)),
  pdice: (s, n) => { const v = attrVal(s, s.pericias[n].attr); return v > 0 ? `${v}d20` : "2d20↓"; },
  pvfill: (s) => pct(s.pv), pdfill: (s) => pct(s.pd),
  sumName: (s, p) => getPath(s, p + ".nome") || "(sem nome)",
  sumInfo: (s, p, key) => SCHEMAS[key].info(getPath(s, p) || {}),
  title: (s) => s.header.personagem || "(sem nome)",
};
function pct(b) { const m = num(b.max); return m > 0 ? clamp((num(b.atual) / m) * 100, 0, 100) : 0; }

function refreshDerived() {
  const s = cur(); if (!s) return;
  document.querySelectorAll("[data-calc]").forEach((el) => {
    const [fn, ...args] = el.dataset.calc.split("|");
    const v = CALC[fn]?.(s, ...args);
    if (fn === "pvfill" || fn === "pdfill") el.style.width = v + "%";
    else el.textContent = v;
  });
  const over = cargaAtual(s) > cargaMax(s);
  document.querySelectorAll(".carga-num").forEach((el) => el.classList.toggle("over", over));
  document.querySelectorAll("[data-catcount]").forEach((el) => {
    const c = Number(el.dataset.catcount);
    el.classList.toggle("over", c > 0 && catCount(s, c) > num(s.equip.limites[c]));
  });
}

/* ---------- Componentes HTML ---------- */
function inp(path, val, type = "text", extra = "") {
  return `<input data-path="${path}" data-type="${type}" type="${type === "num" ? "number" : "text"}" value="${esc(val)}" ${extra}>`;
}
function sel(path, val, opts, extra = "") {
  return `<select data-path="${path}" ${extra}>${normOpts(opts).map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(val) ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
}
function ta(path, val, rows = 3) { return `<textarea data-path="${path}" rows="${rows}">${esc(val)}</textarea>`; }
function imgField(path, val) {
  const isUrl = /^https?:/i.test(val || "");
  return `<div class="imgbox">${val ? `<img src="${esc(val)}" alt="">` : `<span class="empty">Sem imagem</span>`}
    <div class="imgbtns"><button data-imgup="${path}">Enviar</button>${val ? `<button data-imgdel="${path}" class="danger">Remover</button>` : ""}</div></div>
    <input class="imgurl" data-path="${path}" data-rerender="1" placeholder="…ou cole o link de uma imagem" value="${isUrl ? esc(val) : ""}">`;
}
function delBtn(path, label = "✕") { return `<button class="icon danger" data-del="${path}" title="Remover">${label}</button>`; }

function fieldHTML(f, p, val) {
  const wide = f.wide || ["textarea", "img", "strlist", "dmglist"].includes(f.type) ? "wide" : "";
  let body = "";
  if (f.type === "text") body = inp(p, val, "text", f.ph ? `placeholder="${esc(f.ph)}"` : "");
  else if (f.type === "num") body = inp(p, val, "num", `${f.min != null ? `min="${f.min}"` : ""} ${f.max != null ? `max="${f.max}"` : ""}`);
  else if (f.type === "select") body = sel(p, val, f.opts);
  else if (f.type === "textarea") body = ta(p, val, 4);
  else if (f.type === "img") body = imgField(p, val);
  else if (f.type === "strlist") {
    body = `<div class="sublist">${(val || []).map((m, j) => `<div class="row">${inp(`${p}.${j}`, m)}${delBtn(`${p}.${j}`)}</div>`).join("")}
      <button class="add" data-addstr="${p}">+ melhoria</button></div>`;
  } else if (f.type === "dmglist") {
    body = `<div class="sublist">${(val || []).map((d, j) => `<div class="row">${inp(`${p}.${j}.dano`, d.dano, "text", 'placeholder="1d6"')}${sel(`${p}.${j}.tipo`, d.tipo, TIPOS_DANO)}${delBtn(`${p}.${j}`)}</div>`).join("")}
      <button class="add" data-adddmg="${p}">+ dano adicional</button></div>`;
  }
  return `<label class="${wide}">${esc(f.label)}${body}</label>`;
}
function listHTML(key) {
  const s = cur(); const base = LIST_PATHS[key]; const sc = SCHEMAS[key]; const arr = getPath(s, base);
  return `${arr.map((it, i) => {
    const p = `${base}.${i}`;
    return `<details class="item" data-id="${it.id}" ${openCards.has(it.id) ? "open" : ""}>
      <summary><span class="sum-name" data-calc="sumName|${p}"></span><span class="sum-info" data-calc="sumInfo|${p}|${key}"></span>${delBtn(p)}</summary>
      <div class="fields">${sc.fields.map((f) => fieldHTML(f, `${p}.${f.k}`, it[f.k])).join("")}</div></details>`;
  }).join("") || `<p class="muted">Nada adicionado ainda.</p>`}
  <button class="add" data-add="${key}">+ Adicionar ${sc.title}</button>`;
}

/* ---------- Abas ---------- */
const TABS = [["principal", "Principal"], ["pericias", "Perícias"], ["combate", "Combate"], ["habilidades", "Habilidades"], ["rituais", "Rituais"], ["inventario", "Inventário"], ["notas", "Notas"]];

function tabPrincipal(s) {
  const pos = { AGI: [50, 15], INT: [86, 41], VIG: [73, 84], PRE: [27, 84], FOR: [14, 41] };
  const pts = ["AGI", "INT", "VIG", "PRE", "FOR"].map((a) => `${pos[a][0] * 2.9},${pos[a][1] * 2.7}`).join(" ");
  return `
  <section class="card header">
    <div class="portrait">${imgField("header.img", s.header.img)}</div>
    <div class="hfields">
      <label class="wide">Personagem ${inp("header.personagem", s.header.personagem)}</label>
      <label>Jogador ${inp("header.jogador", s.header.jogador)}</label>
      <label>Origem ${inp("header.origem", s.header.origem)}</label>
      <label class="wide">Classe ${sel("header.classe", s.header.classe, CLASSES)}</label>
    </div>
  </section>

  <section class="card">
    <h3>Atributos <span class="muted">clique na sigla para rolar</span></h3>
    <div class="penta">
      <svg viewBox="0 0 290 270"><polygon points="${pts}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/></svg>
      <div class="center">ATRIBUTOS</div>
      ${ATTRS.map(([a, n]) => `<div class="attr" style="left:${pos[a][0]}%;top:${pos[a][1]}%">
        <input data-path="attrs.${a}" data-type="num" data-min="0" data-max="5" type="number" min="0" max="5" value="${attrVal(s, a)}">
        <span class="nm">${n}</span><button class="ab" data-rollattr="${a}">${a}</button></div>`).join("")}
    </div>
  </section>

  <section class="card grid3">
    <label>NEX ${sel("nex", s.nex, NEX_OPTS.map((n) => [n, n + "%"]))}</label>
    <label>Limite de PD por rodada
      <div class="row"><span class="calc small" data-calc="pdBase"></span><span class="muted">+</span>${inp("pdBonus", s.pdBonus, "num", 'title="Bônus"')}<span class="muted">=</span><span class="calc" data-calc="pdTotal"></span></div>
    </label>
    <label>Deslocamento
      <div class="row">${inp("desloc", s.desloc, "num", 'step="1.5" min="0"')}<span class="muted">m</span></div>
      <span class="muted" data-calc="blocos"></span>
    </label>
  </section>

  <section class="card">
    ${barHTML("pv", "Pontos de Vida", s.pv)}
    ${barHTML("pd", "Determinação", s.pd)}
  </section>

  <section class="card">
    <h3>Defesa</h3>
    <div class="defline">
      <label>Base<div class="calc small">10</div></label>
      <label>Agilidade<div class="calc small" data-calc="agi"></div></label>
      <label>Proteções<div class="calc small" data-calc="defProt"></div></label>
      <label>Equip. ${inp("defesa.equip", s.defesa.equip, "num")}</label>
      <label>Outros ${inp("defesa.outros", s.defesa.outros, "num")}</label>
    </div>
    <div class="grid3" style="margin-top:10px">
      <label>Defesa<div class="calc" data-calc="defesa"></div></label>
      <label>Bloqueio <span class="muted" style="text-transform:none">(Fortitude)</span><div class="calc" data-calc="bloqueio"></div></label>
      <label>Esquiva <span class="muted" style="text-transform:none">(Def. + Reflexos)</span><div class="calc" data-calc="esquiva"></div></label>
    </div>
  </section>

  <section class="card grid2">
    <label>Resistências ${ta("resistencias", s.resistencias)}</label>
    <label>Proficiências ${ta("proficiencias", s.proficiencias)}</label>
  </section>`;
}
function barHTML(k, title, b) {
  return `<div class="bar ${k}">
    <div class="head"><span>${title}</span><span class="row">
      <button class="icon" data-step="${k}.atual" data-delta="-5">−5</button><button class="icon" data-step="${k}.atual" data-delta="-1">−1</button>
      <button class="icon" data-step="${k}.atual" data-delta="1">+1</button><button class="icon" data-step="${k}.atual" data-delta="5">+5</button></span></div>
    <div class="track"><div class="fill" data-calc="${k}fill"></div>
      <div class="vals">${inp(`${k}.atual`, b.atual, "num")}<span>/</span>${inp(`${k}.max`, b.max, "num")}</div></div>
  </div>`;
}
function tabPericias(s) {
  const attrOpts = ATTRS.map(([a]) => [a, a]);
  return `<section class="card"><h3>Perícias</h3>
  <table class="pericias"><thead><tr><th></th><th>Perícia</th><th>Dados</th><th>Bônus</th><th>Treino</th><th>Outros</th></tr></thead><tbody>
  ${PERICIAS.map(([n, , m]) => { const p = s.pericias[n]; return `<tr>
    <td><button class="roll" data-rollper="${esc(n)}" title="Rolar ${esc(n)}">🎲</button></td>
    <td class="nome">${esc(n)}${m}</td>
    <td>${sel(`pericias.${n}.attr`, p.attr, attrOpts)}<div class="dice" data-calc="pdice|${n}"></div></td>
    <td class="bon" data-calc="pbonus|${n}"></td>
    <td>${sel(`pericias.${n}.treino`, p.treino, TREINO, 'data-type="num"')}</td>
    <td style="width:52px">${inp(`pericias.${n}.outros`, p.outros, "num")}</td></tr>`; }).join("")}
  </tbody></table>
  <p class="muted">+ Penalidade de carga. * Somente treinada. Atributo 0: rola 2d20 e fica com o menor.</p></section>`;
}
function tabInventario(s) {
  return `<section class="card">
    <h3>Equipamento</h3>
    <div class="grid3">
      <label>Prestígio ${inp("equip.prestigio", s.equip.prestigio, "num")}</label>
      <label>Patente ${sel("equip.patente", s.equip.patente, PATENTES)}</label>
      <label>Crédito ${sel("equip.credito", s.equip.credito, CREDITO)}</label>
    </div>
    <div class="section-title">Itens por categoria</div>
    <table class="cats"><thead><tr><th></th>${CATS.map(([, l]) => `<th>${l}</th>`).join("")}</tr></thead><tbody>
      <tr><th>Limite</th>${CATS.map(([c]) => `<td>${c === 0 ? `<span class="muted">sem limite</span>` : inp(`equip.limites.${c}`, s.equip.limites[c], "num", 'min="0"')}</td>`).join("")}</tr>
      <tr><th>No inventário</th>${CATS.map(([c]) => `<td class="calc small" data-catcount="${c}" data-calc="cat|${c}"></td>`).join("")}</tr>
    </tbody></table>
    <div class="section-title">Carga</div>
    <div class="defline" style="grid-template-columns:repeat(4,1fr)">
      <label>Carregada<div class="calc carga-num" data-calc="carga"></div></label>
      <label>Força × 5<div class="calc small" data-calc="cargaMax"></div></label>
      <label>Modificador ${inp("equip.cargaMod", s.equip.cargaMod, "num")}</label>
      <label class="muted" style="text-transform:none;justify-content:center">Carga máx. = 5 × FOR + mod.</label>
    </div>
  </section>
  <div class="section-title">Armas</div>${listHTML("armas")}
  <div class="section-title">Munições</div>${listHTML("municoes")}
  <div class="section-title">Proteções</div>${listHTML("protecoes")}
  <div class="section-title">Itens gerais</div>${listHTML("gerais")}
  <div class="section-title">Itens amaldiçoados</div>${listHTML("amaldicoados")}`;
}
function tabNotas(s) {
  const N = [["anotacoes", "Anotações pessoais"], ["aparencia", "Aparência"], ["personalidade", "Personalidade"], ["historico", "Histórico"], ["objetivo", "Objetivo"]];
  return N.map(([k, l]) => `<section class="card"><h3>${l}</h3>${ta(`notas.${k}`, s.notas[k], 5)}</section>`).join("");
}
function tabContent(s) {
  switch (tab) {
    case "principal": return tabPrincipal(s);
    case "pericias": return tabPericias(s);
    case "combate": return `<div class="section-title">Ataques</div>${listHTML("ataques")}`;
    case "habilidades": return `<div class="section-title">Habilidades</div>${listHTML("habilidades")}`;
    case "rituais": return `<section class="card"><label>DT dos rituais ${inp("rituais.dt", s.rituais.dt, "num")}</label></section>
      <div class="section-title">Rituais</div>${listHTML("rituais")}`;
    case "inventario": return tabInventario(s);
    case "notas": return tabNotas(s);
  }
  return "";
}

/* ---------- Render ---------- */
const app = document.getElementById("app");

function render() {
  renderPending = false;
  const vis = allVisible();
  if (!cur() && vis.length) store.currentId = vis[0].s.id;
  const s = cur();
  const scroll = window.scrollY;

  const opts = (list) => list.map(({ s: x }) => `<option value="${x.id}" ${x.id === store.currentId ? "selected" : ""}>${esc(x.header.personagem || "(sem nome)")}${isGM() && x.owner?.name ? " — " + esc(x.owner.name) : ""}</option>`).join("");
  const own = vis.filter((v) => v.own), others = vis.filter((v) => !v.own);
  const selector = vis.length
    ? `<select id="sheetSel">${isGM() ? `<optgroup label="Minhas fichas">${opts(own)}</optgroup><optgroup label="Fichas dos jogadores">${opts(others)}</optgroup>` : opts(own)}</select>`
    : `<span class="muted" style="flex:1">Nenhuma ficha</span>`;

  const top = `<div class="topbar">
    <span class="role ${isGM() ? "gm" : ""}">${isGM() ? "Mestre" : "Jogador"}</span>
    ${selector}
    <button class="icon" id="btnNew" title="Nova ficha">＋</button>
    <button class="icon" id="btnMenu" title="Mais opções">⋯</button>
    ${obrOk ? `<button class="icon" id="btnModal" title="${IS_MODAL ? "Fechar" : "Abrir em tela grande"}">${IS_MODAL ? "✕" : "⤢"}</button>` : ""}
  </div>`;

  if (!s) {
    app.innerHTML = top + `<div class="empty-state"><h2>Ordem Paranormal</h2><p>Crie a ficha do seu agente para começar.</p>
      <button class="primary" id="btnNew2">Criar ficha</button>${isGM() ? `<p class="muted">Como mestre, as fichas dos jogadores aparecem aqui assim que eles as criarem ou abrirem a extensão.</p>` : ""}</div>`;
    return;
  }
  const ownerNote = !isOwnCurrent() ? `<p class="owner-note">Ficha de <b>${esc(s.owner?.name || "jogador")}</b> — suas alterações são enviadas a ele.</p>` : "";
  app.innerHTML = top + ownerNote +
    `<nav class="tabs">${TABS.map(([k, l]) => `<button data-tab="${k}" class="${k === tab ? "on" : ""}">${l}</button>`).join("")}</nav>
     <main>${tabContent(s)}</main>`;
  refreshDerived();
  window.scrollTo(0, scroll);
}
// Re-render sem atrapalhar quem está digitando
function softRender() {
  const a = document.activeElement;
  if (a && app.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) { renderPending = true; return; }
  render();
}
app.addEventListener("focusout", () => { if (renderPending) setTimeout(() => { if (renderPending) softRender(); }, 50); });

/* ---------- Eventos ---------- */
app.addEventListener("input", (e) => {
  const el = e.target; const p = el.dataset.path; const s = cur();
  if (el.id === "sheetSel") return;
  if (!p || !s) return;
  let v = el.value;
  if (el.dataset.type === "num" || (el.tagName === "SELECT" && /^(nex|pericias\..*\.treino|.*\.categoria|.*\.circulo)$/.test(p))) {
    v = el.value === "" ? 0 : Number(el.value);
    if (el.dataset.min != null) v = clamp(v, Number(el.dataset.min), Number(el.dataset.max));
  }
  setPath(s, p, v);
  touch(); refreshDerived();
});
app.addEventListener("change", (e) => {
  const el = e.target;
  if (el.id === "sheetSel") { store.currentId = el.value; persist(); render(); return; }
  if (el.dataset.min != null) el.value = clamp(num(el.value), Number(el.dataset.min), Number(el.dataset.max));
  if (el.dataset.rerender) render();
});
app.addEventListener("toggle", (e) => {
  const d = e.target; if (!d.matches?.("details.item")) return;
  d.open ? openCards.add(d.dataset.id) : openCards.delete(d.dataset.id);
}, true);

app.addEventListener("click", async (e) => {
  const b = e.target.closest("button"); if (!b) return;
  const s = cur(); const d = b.dataset;

  if (b.id === "btnNew" || b.id === "btnNew2") {
    const n = newSheet(); store.own[n.id] = n; store.currentId = n.id; tab = "principal";
    persist(); scheduleSync(n); render(); return;
  }
  if (b.id === "btnMenu") return menuDialog();
  if (b.id === "btnModal") {
    if (IS_MODAL) OBR.modal.close(MODAL_ID);
    else OBR.modal.open({ id: MODAL_ID, url: new URL("index.html?modal=1", location.href).href, width: 900, height: 1000 });
    return;
  }
  if (d.tab) { tab = d.tab; render(); window.scrollTo(0, 0); return; }
  if (!s) return;

  if (d.add) {
    e.preventDefault();
    const it = newItem(SCHEMAS[d.add]); getPath(s, LIST_PATHS[d.add]).push(it); openCards.add(it.id);
    touch(); render(); return;
  }
  if (d.addstr) { getPath(s, d.addstr).push(""); touch(); render(); return; }
  if (d.adddmg) { getPath(s, d.adddmg).push({ dano: "", tipo: TIPOS_DANO[0] }); touch(); render(); return; }
  if (d.del) {
    e.preventDefault(); e.stopPropagation();
    if (!b.classList.contains("confirm")) { // clique duplo para confirmar
      b.classList.add("confirm"); b.textContent = "Remover?";
      setTimeout(() => { if (b.isConnected) { b.classList.remove("confirm"); b.textContent = "✕"; } }, 2500);
      return;
    }
    delPath(s, d.del); touch(); render(); return;
  }
  if (d.step) {
    const v = num(getPath(s, d.step)) + Number(d.delta);
    setPath(s, d.step, v); touch(); render(); return;
  }
  if (d.imgup) { pendingImgPath = d.imgup; document.getElementById("filePick").click(); return; }
  if (d.imgdel) { setPath(s, d.imgdel, ""); touch(); render(); return; }
  if (d.rollper) return rollPericia(s, d.rollper);
  if (d.rollattr) return rollAttr(s, d.rollattr);
});

/* ---------- Imagens (reduzidas para caber no envio) ---------- */
document.getElementById("filePick").addEventListener("change", async (e) => {
  const file = e.target.files[0]; e.target.value = "";
  if (!file || !pendingImgPath || !cur()) return;
  try {
    const url = await shrinkImage(file, 280, 0.72);
    setPath(cur(), pendingImgPath, url); touch(); render();
  } catch { toast("Não consegui abrir essa imagem."); }
});
function shrinkImage(file, max, q) {
  return new Promise((res, rej) => {
    const img = new Image(); const r = new FileReader();
    r.onload = () => { img.src = r.result; };
    r.onerror = rej;
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const ctx = c.getContext("2d"); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL("image/jpeg", q));
    };
    img.onerror = rej;
    r.readAsDataURL(file);
  });
}

/* ---------- Rolagens ---------- */
const d20 = () => 1 + Math.floor(Math.random() * 20);
function rollTest(v) {
  const n = v > 0 ? v : 2; const dice = Array.from({ length: n }, d20);
  return { dice, pick: v > 0 ? Math.max(...dice) : Math.min(...dice) };
}
function announce(text) {
  if (obrOk) { OBR.notification.show(text); send({ t: "roll", text }); } else toast(text);
}
function rollPericia(s, n) {
  const p = s.pericias[n]; const { dice, pick } = rollTest(attrVal(s, p.attr)); const b = periciaBonus(s, n);
  announce(`${s.header.personagem} — ${n}: [${dice.join(", ")}] → ${pick} ${fmt(b)} = ${pick + b}`);
}
function rollAttr(s, a) {
  const { dice, pick } = rollTest(attrVal(s, a));
  announce(`${s.header.personagem} — teste de ${a}: [${dice.join(", ")}] → ${pick}`);
}

/* ---------- Menu: exportar / importar / apagar ---------- */
function dialog(html) {
  const wrap = document.createElement("div"); wrap.className = "dialog";
  wrap.innerHTML = `<div class="box">${html}</div>`;
  wrap.addEventListener("click", (e) => { if (e.target === wrap || e.target.dataset.close != null) wrap.remove(); });
  document.body.appendChild(wrap); return wrap;
}
function menuDialog() {
  const s = cur();
  const w = dialog(`<h3>Opções</h3>
    ${s ? `<button id="mExport">Exportar esta ficha (backup)</button>` : ""}
    <button id="mImport">Importar ficha (.json)</button>
    ${isGM() ? `<button id="mSync">Pedir fichas aos jogadores conectados</button>` : ""}
    ${s ? `<button id="mDup">Duplicar esta ficha</button><button id="mDel" class="danger">Apagar esta ficha</button>` : ""}
    <button data-close>Fechar</button>`);
  w.querySelector("#mExport")?.addEventListener("click", () => { w.remove(); exportDialog(s); });
  w.querySelector("#mImport").addEventListener("click", () => { w.remove(); importDialog(); });
  w.querySelector("#mSync")?.addEventListener("click", () => { send({ t: "request" }); toast("Pedido enviado."); w.remove(); });
  w.querySelector("#mDup")?.addEventListener("click", () => {
    const c = upgrade(JSON.parse(JSON.stringify(s))); c.id = uid(); c.owner = { id: me.id, name: me.name };
    c.header.personagem += " (cópia)"; store.own[c.id] = c; store.currentId = c.id; persist(); scheduleSync(c); w.remove(); render();
  });
  const del = w.querySelector("#mDel");
  del?.addEventListener("click", () => {
    if (!del.classList.contains("confirm")) { del.classList.add("confirm"); del.textContent = `Confirmar: apagar "${s.header.personagem}"?`; return; }
    delete store.own[s.id]; delete store.others[s.id]; store.currentId = null;
    persist(); send({ t: "delete", id: s.id }); w.remove(); render();
  });
}
function exportDialog(s) {
  const json = JSON.stringify(s);
  const w = dialog(`<h3>Exportar ficha</h3><p class="muted">Guarde este texto (ou o arquivo) como backup. Para restaurar, use “Importar”.</p>
    <textarea readonly>${esc(json)}</textarea><div class="row"><button id="eDown" class="primary">Baixar arquivo</button><button id="eCopy">Copiar</button><button data-close>Fechar</button></div>`);
  w.querySelector("#eDown").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    a.download = (s.header.personagem || "ficha").replace(/[^\w\-]+/g, "_") + ".json"; a.click();
  });
  w.querySelector("#eCopy").addEventListener("click", async () => {
    const t = w.querySelector("textarea"); t.select();
    try { await navigator.clipboard.writeText(json); toast("Copiado!"); } catch { document.execCommand("copy"); }
  });
}
function importDialog() {
  const w = dialog(`<h3>Importar ficha</h3><p class="muted">Cole o texto exportado ou escolha um arquivo .json.</p>
    <textarea id="iText" placeholder="{ … }"></textarea>
    <div class="row"><button id="iFile">Escolher arquivo</button><button id="iGo" class="primary">Importar</button><button data-close>Cancelar</button></div>`);
  const go = (txt) => {
    try {
      const s = upgrade(JSON.parse(txt)); s.id = uid(); s.owner = { id: me.id, name: me.name }; s.updatedAt = Date.now();
      store.own[s.id] = s; store.currentId = s.id; persist(); scheduleSync(s); w.remove(); render(); toast("Ficha importada.");
    } catch { toast("Esse texto não é uma ficha válida."); }
  };
  w.querySelector("#iGo").addEventListener("click", () => go(w.querySelector("#iText").value));
  const pick = document.getElementById("jsonPick");
  w.querySelector("#iFile").addEventListener("click", () => {
    pick.onchange = async () => { const f = pick.files[0]; pick.value = ""; if (f) go(await f.text()); };
    pick.click();
  });
}
let toastTimer;
function toast(text) {
  document.querySelector(".toast")?.remove();
  const t = document.createElement("div"); t.className = "toast"; t.textContent = text; document.body.appendChild(t);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 4000);
}

// Mantém a janela pequena e a tela grande sincronizadas
window.addEventListener("storage", (e) => {
  if (e.key !== storeKey) return;
  const keepId = store.currentId; load(); store.currentId = keepId; softRender();
});

/* ---------- Inicialização ---------- */
async function start() {
  if (OBR.isAvailable) {
    OBR.onReady(async () => {
      obrOk = true;
      storeKey = `${NS}:${OBR.room.id}`;
      [role, me.id, me.name] = await Promise.all([OBR.player.getRole(), OBR.player.getId(), OBR.player.getName()]);
      load(); render();
      OBR.broadcast.onMessage(CHANNEL, (ev) => onChunk(ev.data));
      OBR.player.onChange((p) => {
        const changedRole = p.role !== role; role = p.role; me.name = p.name;
        if (changedRole) { if (isGM()) send({ t: "request" }); render(); }
      });
      if (isGM()) {
        send({ t: "request" });
        let known = new Set();
        OBR.party.onChange((players) => {
          const ids = new Set(players.map((p) => p.id));
          const novo = [...ids].some((id) => !known.has(id)); known = ids;
          if (novo && isGM()) setTimeout(() => send({ t: "request" }), 1500);
        });
      } else pushAllOwn();
    });
  } else {
    // Fora do Owlbear (teste local no navegador)
    me = { id: "local", name: "Teste" };
    load(); render();
  }
}
start();
