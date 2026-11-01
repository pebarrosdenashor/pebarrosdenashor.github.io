// Dados das fichas. Cada perícia é [nome, dado da perícia, dado do atributo], como impresso no PDF.
// Para corrigir qualquer valor, edite os arrays abaixo (ordem das perícias = lista N).
const N = ["Acrobacia","Animais","Aptidão","Atletismo","Crime","Disciplina","Enganação","Furtividade","Inspecionar","Intimidar","Intuição","Luta","Medicina","Ocultismo","Ofício","Percepção","Persuasão","Pontaria","Sobrevivência","Vigor"];
const mk = (b, a, ov = {}, nomes = N) => nomes.map((n, i) => [ov[n] || n, b[i], a[i]]);
const ANALISE = { n: "Marcadores de análise", max: 4, k: "analise" };
const IMPETO = { n: "Ímpeto", max: 5, k: "impeto" };
const ERUD = { Aptidão: "Aptidão (Erudição)" };

export const FICHAS = [
  {
    id: "rhiona", nome: "Rhiona Mac Tuirenn", cls: "Analista · Ferreira", pv: 22, pd: 12, res: ANALISE,
    at: { Físico: 10, Mente: 6, Emoção: 6 },
    sk: mk([4,4,4,8,4,6,4,4,4,4,4,10,4,4,8,6,6,4,4,8], [10,6,6,10,10,6,6,10,6,6,6,10,6,6,6,6,6,10,6,10], { Ofício: "Ofício (Metalurgia)" }),
    armas: [["Martelo de forja", "Luta", 3]],
    nota: "Análise: ação para +2 marcadores (máx. 4); cada marcador muda um dado em ±1 após rolar. Leitura de combate: ao se defender, ganha 1 marcador. Armadura vestida dá +1 ponto."
  },
  {
    id: "rowan", nome: "Rowan Lobo Castanho", cls: "Vigilante · Adestrador", pv: 20, pd: 12, res: null,
    at: { Físico: 8, Mente: 8, Emoção: 6 },
    sk: mk([6,6,4,6,4,4,4,6,4,4,4,6,6,4,4,8,4,10,8,6], [8,6,8,8,8,6,6,8,8,6,6,8,8,8,8,8,6,8,8,8]),
    armas: [["Arco curto de teixo", "Pontaria", 1], ["Lança de javali", "Luta", 2]],
    nota: "Prontidão: 2 PD para re-rolar um dado que não seja 1. Esquiva: Acrobacia oposta ao ataque (1×/rodada). Espectro, o lobo: marque +d6 em ataques corpo a corpo; se o dado do lobo der 1, ele se machuca até o fim da cena."
  },
  {
    id: "muirenn", nome: "Muirenn da Lua Pálida", cls: "Executor · Herborista", pv: 15, pd: 17, res: IMPETO,
    at: { Físico: 8, Mente: 8, Emoção: 8 },
    sk: mk([4,4,8,6,4,6,4,4,6,6,6,4,8,8,4,4,4,6,8,6], Array(20).fill(8), { Aptidão: "Aptidão (Folclore)" }),
    armas: [["Faca ritualística", "Luta", 0], ["Pote de vespa", "Sobrevivência", 1]],
    nota: "Ímpeto: cada falha em teste enche 1 espaço. 1 espaço = +d4 em um teste (marque +d4); 3 espaços = +1 passo em um atributo ou ação extra. Bálsamo de confrei cura 2d4 PV."
  },
  {
    id: "cavan", nome: "Irmão Cavan", cls: "Analista · Professor", pv: 15, pd: 15, res: ANALISE,
    at: { Físico: 6, Mente: 10, Emoção: 6 },
    sk: mk([6,4,6,10,4,8,4,4,8,4,6,8,6,6,4,6,4,4,4,6], [6,6,10,6,6,6,6,6,10,6,6,6,10,10,10,10,6,10,6,6], ERUD),
    armas: [["Porrete", "Luta", 1]],
    nota: "Curandeiro: ação + 2 PD, Medicina DT 7; se passar, cura PV iguais à RA (1×/cena por alvo). Mentoria: ao ajudar, teste DT 7 para o aliado trocar um dado pela rolagem alta. Análise como Rhiona."
  },
  {
    id: "malik", nome: "Malik ibn Qamar", cls: "Executor · Explorador", pv: 15, pd: 19, res: IMPETO,
    at: { Físico: 6, Mente: 6, Emoção: 10 },
    sk: mk([4,4,8,6,4,6,4,4,6,4,4,4,4,4,4,10,6,8,6,4], [6,10,6,6,6,10,10,6,6,10,10,6,6,6,6,6,10,6,6,6], ERUD),
    armas: [["Arco composto de Al-Andalus", "Pontaria", 1]],
    nota: "Ímpeto fervilhante: começa cada cena com 1 espaço de ímpeto. 1 espaço = +d4; 3 espaços = +1 passo em atributo ou ação extra."
  },
  {
    id: "sira", nome: "Sira Cissé", cls: "Vigilante · Viking", pv: 20, pd: 12, res: null,
    at: { Físico: 8, Mente: 6, Emoção: 8 },
    sk: mk([6,4,6,6,8,4,4,10,4,4,4,8,4,4,4,6,4,4,4,6], [8,8,6,8,8,8,8,8,6,8,8,6,6,6,6,8,8,8,6,8], ERUD),
    armas: [["Machado de batalha nórdico", "Luta", 3]],
    nota: "Prontidão: 2 PD para re-rolar. Antecipação tática: 2 PD no início do combate para agir primeiro. Sorrateiro: em Crime/Furtividade, 3 PD para +d8 (marque +d8)."
  },
  {
    id: "sorcha", nome: "Sorcha Roth", cls: "Vigilante · Talentosa", pv: 22, pd: 14, res: null,
    at: { Físico: 8, Mente: 6, Emoção: 8 },
    sk: mk([4,4,4,8,4,8,4,4,4,4,6,8,6,4,4,6,4,4,4,8], [8,8,6,8,8,8,8,8,6,8,8,6,6,6,6,8,8,8,6,8], ERUD),
    armas: [["Lança", "Luta", 2]],
    nota: "Guardiã: 2 PD para virar o alvo de um ataque contra aliado em alcance curto. Instinto de sobrevivência: com metade ou menos dos PV, +1 passo em todos os testes. Elmo aberto reduz Percepção em 1 passo."
  },
  {
    id: "cormac", nome: "Cormac Coluim", cls: "Executor · Aristocrata", pv: 17, pd: 15, res: IMPETO,
    at: { Físico: 8, Mente: 8, Emoção: 6 },
    sk: mk(
      [4,4,6,6,6,6,4,8,4,6,6,4,4,8,4,4,4,6,6,4,8,8],
      [6,8,8,8,8,8,8,6,6,8,8,6,6,8,8,8,8,8,6,8,8,8], {},
      N.flatMap(n => n === "Aptidão" ? ["Aptidão (Erudição)", "Aptidão (Guerra)", "Aptidão (Nobreza)"] : [n])
    ),
    armas: [["Espada forjada em castelo", "Luta", 3]],
    nota: "Ímpeto como Muirenn. Plano estratégico: ação + 3 PD, Aptidão (Guerra) DT 7; aliados recebem d6 (+d6 a cada 3 pontos acima da DT). Espada: crítico com dois dados de valor 5+."
  }
];
