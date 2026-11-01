// Dados das fichas. Cada perícia é [nome, dado da perícia, dado do atributo], como impresso no PDF.
// cor: f = feltro do prato, m = madeira da moldura, d = dados, n = números dos dados.
// Armas com "arco" no 4º item usam o prato com a zona central de valor x2.
// Para corrigir qualquer valor, edite os arrays abaixo (ordem das perícias = lista N).
const N = ["Acrobacia","Animais","Aptidão","Atletismo","Crime","Disciplina","Enganação","Furtividade","Inspecionar","Intimidar","Intuição","Luta","Medicina","Ocultismo","Ofício","Percepção","Persuasão","Pontaria","Sobrevivência","Vigor"];
const mk = (b, a, ov = {}, nomes = N) => nomes.map((n, i) => [ov[n] || n, b[i], a[i]]);
const ANALISE = { n: "Marcadores de análise", max: 4, k: "analise" };
const IMPETO = { n: "Ímpeto", max: 5, k: "impeto" };
const ERUD = { Aptidão: "Aptidão (Erudição)" };

export const FICHAS = [
  {
    id: "rhiona", cor: { f: "#7d2227", m: "#b9824f", d: "#eab45e", n: "#2b150b" }, n1: "Rhiona", n2: "Mac Tuirenn", cl: "Analista", sub: "Ferreira", foto: "img/rhiona.webp", pv: 22, pd: 12, res: ANALISE,
    at: { Físico: 10, Mente: 6, Emoção: 6 },
    sk: mk([4,4,4,8,4,6,4,4,4,4,4,10,4,4,8,6,6,4,4,8], [10,6,6,10,10,6,6,10,6,6,6,10,6,6,6,6,6,10,6,10], { Ofício: "Ofício (Metalurgia)" }),
    armas: [["Martelo de forja", "Luta", 3, "", "martelo"]],
    hab: [["Análise", "AÇÃO", "Gaste uma ação para receber 2 marcadores (máx. 4). Depois de rolar, cada marcador gasto muda um dado em +1 ou −1. No fim da cena, os não usados se perdem."], ["Leitura de combate", "", "Ao gastar uma ação para se defender, recebe 1 marcador de análise."], ["Segredo do aço", "PASSIVA", "Sabe usar equipamentos marciais. Uma armadura vestida fornece +1 ponto de armadura."]]
  },
  {
    id: "rowan", cor: { f: "#3a2c22", m: "#6f5439", d: "#e0a63d", n: "#241608" }, n1: "Rowan", n2: "Lobo Castanho", cl: "Vigilante", sub: "Adestrador", foto: "img/rowan.webp", pv: 20, pd: 12, res: null,
    at: { Físico: 8, Mente: 8, Emoção: 6 },
    sk: mk([6,6,4,6,4,4,4,6,4,4,4,6,6,4,4,8,4,10,8,6], [8,6,8,8,8,6,6,8,8,6,6,8,8,8,8,8,6,8,8,8]),
    armas: [["Arco curto de teixo", "Pontaria", 1, "arco", "flecha"], ["Lança de javali", "Luta", 2, "", "lanca"]],
    hab: [["Prontidão", "2 PD", "1×/rodada, quando você ou outro ser em alcance curto faz um teste, gaste 2 PD para re-rolar um dado que não seja 1. Em combate, você pode agir na sua fase ou depois."], ["Esquiva", "LIVRE", "1×/rodada, ao sofrer um ataque, faça Acrobacia oposta ao ataque. Se vencer, evita o ataque."], ["Espectro, o lobo", "+d6", "O lobo dá +d6 em ataques corpo a corpo (marque +d6). Se o dado do lobo der 1, ele se machuca e não ajuda mais até o fim da cena."]]
  },
  {
    id: "muirenn", cor: { f: "#5c2d63", m: "#d9c8b0", d: "#ece6f1", n: "#46204f" }, n1: "Muirenn", n2: "da Lua Pálida", cl: "Executor", sub: "Herborista", foto: "img/muirenn.webp", pv: 15, pd: 17, res: IMPETO,
    at: { Físico: 8, Mente: 8, Emoção: 8 },
    sk: mk([4,4,8,6,4,6,4,4,6,6,6,4,8,8,4,4,4,6,8,6], Array(20).fill(8), { Aptidão: "Aptidão (Folclore)" }),
    armas: [["Faca ritualística", "Luta", 0, "", "faca"], ["Pote de vespa", "Sobrevivência", 1, "", "vespas"]],
    hab: [["Ímpeto", "", "Cada falha em teste preenche 1 espaço (máx. 5). 1 espaço: +d4 em um teste · 3: +1 passo em um atributo · 3: ação extra em cenas de conflito. Esvazia no fim da cena."], ["Arsenal de herborista", "AÇÃO", "Itens de uso único. Tônico de urtiga-feroz: +1 passo em Físico por uma cena. Bálsamo de confrei: recupera 2d4 PV. Pote de vespa: Sobrevivência, ataque à distância RA+1; o alvo perde a próxima ação."]]
  },
  {
    id: "cavan", cor: { f: "#6b4a2a", m: "#bf9a63", d: "#ead9ab", n: "#2a1f0c" }, n1: "Cavan", n2: "Irmão · Mosteiro do Olmo Cinzento", cl: "Analista", sub: "Professor", foto: "img/cavan.webp", pv: 15, pd: 15, res: ANALISE,
    at: { Físico: 6, Mente: 10, Emoção: 6 },
    sk: mk([6,4,6,10,4,8,4,4,8,4,6,8,6,6,4,6,4,4,4,6], [6,6,10,6,6,6,6,6,10,6,6,6,10,10,10,10,6,10,6,6], ERUD),
    armas: [["Porrete", "Luta", 1, "", "porrete"]],
    hab: [["Análise", "AÇÃO", "Gaste uma ação para receber 2 marcadores (máx. 4). Depois de rolar, cada marcador gasto muda um dado em +1 ou −1. No fim da cena, os não usados se perdem."], ["Curandeiro", "2 PD", "Ação + 2 PD: teste de Medicina DT 7. Se passar, cura PV iguais à RA do teste. 1× por cena em cada alvo."], ["Mentoria", "", "Ao ajudar alguém, faça o teste da perícia usada contra DT 7. Se passar, o ajudado troca um dado rolado pela sua rolagem alta."]]
  },
  {
    id: "malik", cor: { f: "#1d5b6e", m: "#caa56c", d: "#e5b34f", n: "#0f2f3a" }, n1: "Malik", n2: "ibn Qamar", cl: "Executor", sub: "Explorador", foto: "img/malik.webp", pv: 15, pd: 19, res: IMPETO,
    at: { Físico: 6, Mente: 6, Emoção: 10 },
    sk: mk([4,4,8,6,4,6,4,4,6,4,4,4,4,4,4,10,6,8,6,4], [6,10,6,6,6,10,10,6,6,10,10,6,6,6,6,6,10,6,6,6], ERUD),
    armas: [["Arco composto de Al-Andalus", "Pontaria", 1, "arco", "flecha"]],
    hab: [["Ímpeto", "", "Cada falha em teste preenche 1 espaço (máx. 5). 1 espaço: +d4 em um teste · 3: +1 passo em um atributo · 3: ação extra em cenas de conflito. Esvazia no fim da cena."], ["Ímpeto fervilhante", "PASSIVA", "No início de cada cena, preenche 1 espaço da barra de ímpeto."]]
  },
  {
    id: "sira", cor: { f: "#33357f", m: "#5c4733", d: "#e8bd4a", n: "#171540" }, n1: "Sira", n2: "Cissé", cl: "Vigilante", sub: "Viking", foto: "img/sira.webp", pv: 20, pd: 12, res: null,
    at: { Físico: 8, Mente: 6, Emoção: 8 },
    sk: mk([6,4,6,6,8,4,4,10,4,4,4,8,4,4,4,6,4,4,4,6], [8,8,6,8,8,8,8,8,6,8,8,6,6,6,6,8,8,8,6,8], ERUD),
    armas: [["Machado de batalha nórdico", "Luta", 3, "", "machado"]],
    hab: [["Prontidão", "2 PD", "1×/rodada, quando você ou outro ser em alcance curto faz um teste, gaste 2 PD para re-rolar um dado que não seja 1. Em combate, você pode agir na sua fase ou depois."], ["Antecipação tática", "2 PD", "No início de um combate, gaste 2 PD para ganhar uma rodada em que age antes de todos."], ["Sorrateiro", "3 PD", "Em testes de Crime ou Furtividade, gaste 3 PD para receber +d8 (marque +d8)."]]
  },
  {
    id: "sorcha", cor: { f: "#2b5a3a", m: "#8d6c46", d: "#cf9444", n: "#1c1a0c" }, n1: "Sorcha", n2: "Roth", cl: "Vigilante", sub: "Talentosa", foto: "img/sorcha.webp", pv: 22, pd: 14, res: null,
    at: { Físico: 8, Mente: 6, Emoção: 8 },
    sk: mk([4,4,4,8,4,8,4,4,4,4,6,8,6,4,4,6,4,4,4,8], [8,8,6,8,8,8,8,8,6,8,8,6,6,6,6,8,8,8,6,8], ERUD),
    armas: [["Lança", "Luta", 2, "", "lanca"]],
    hab: [["Prontidão", "2 PD", "1×/rodada, quando você ou outro ser em alcance curto faz um teste, gaste 2 PD para re-rolar um dado que não seja 1. Em combate, você pode agir na sua fase ou depois."], ["Guardiã", "2 PD", "+1 PV por patamar (já na ficha). 1×/rodada, quando um aliado em alcance curto sofre um ataque, gaste 2 PD para se tornar o alvo."], ["Instinto de sobrevivência", "PASSIVA", "Com metade ou menos dos PV máximos, recebe +1 passo em todos os testes."], ["Equipamento", "", "Escudo: se perder um teste oposto de ataque somando 7+, reduz a rolagem baixa do dano. Elmo aberto: 1 de armadura, Percepção −1 passo."]]
  },
  {
    id: "cormac", cor: { f: "#1f3a66", m: "#6d4c33", d: "#d3dae4", n: "#13233f" }, n1: "Cormac", n2: "Coluim", cl: "Executor", sub: "Aristocrata", foto: "img/cormac.webp", pv: 17, pd: 15, res: IMPETO,
    at: { Físico: 8, Mente: 8, Emoção: 6 },
    sk: mk(
      [4,4,6,6,6,6,4,8,4,6,6,4,4,8,4,4,4,6,6,4,8,8],
      [6,8,8,8,8,8,8,6,6,8,8,6,6,8,8,8,8,8,6,8,8,8], {},
      N.flatMap(n => n === "Aptidão" ? ["Aptidão (Erudição)", "Aptidão (Guerra)", "Aptidão (Nobreza)"] : [n])
    ),
    armas: [["Espada forjada em castelo", "Luta", 3, "", "espada"]],
    hab: [["Ímpeto", "", "Cada falha em teste preenche 1 espaço (máx. 5). 1 espaço: +d4 em um teste · 3: +1 passo em um atributo · 3: ação extra em cenas de conflito. Esvazia no fim da cena."], ["Herança", "PASSIVA", "Sua categoria de riqueza aumenta em 1."], ["Plano estratégico", "3 PD", "Ação + 3 PD: Aptidão (Guerra) contra DT 7. Se passar, você e os aliados recebem d6, +d6 a cada 3 pontos acima da DT, usáveis em qualquer teste até o fim da cena."], ["Equipamento", "", "Espada: crítico com dois dados de valor 5+. Cota de malha: 2 de armadura, Furtividade −1 passo."]]
  }
];

// Modelos de inimigos (só o Mestre os vê). Perícia = [nome, dado da perícia, atributo ligado].
// "dados" = dados rolados na ação; "dm" = bônus somado ao RA para o dano.
export const INIMIGOS = [
  {
    id: "crias", nome: "Crias da Floresta", foto: "img/crias.webp", pv: 10,
    at: { Físico: 6, Mente: 4, Emoção: 4 },
    sk: [["Acrobacia", 6, "Físico"], ["Atletismo", 6, "Físico"], ["Luta", 6, "Físico"], ["Percepção", 6, "Mente"]],
    acoes: [
      { n: "Corpo a corpo", d: "Garras 2d6 (dano RA+1).", dados: [6, 6], dm: 1, fx: "garras" },
      { n: "Derrubar", d: "Escolhe um alvo e faz um teste de Luta oposto contra ele. Se vencer, derruba o alvo.", sk: "Luta" }
    ],
    txt: "Humanoides baixos e esguios, com a pele pálida como o luar e úmida como a terra de pântanos. Possuem garras longas e afiadas e olhos grandes e escuros. Se várias crias atacam o mesmo alvo, a primeira pode tentar derrubá-lo, em vez de atacá-lo, para facilitar o ataque das outras."
  }
];
