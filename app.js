const KEY = "vestia-items-v1";
const FAV = "vestia-favs-v1";
const FEEDBACK = "vestia-feedback-v1";
const USAGE = "vestia-usage-v1";

let page = "home";
let excluded = new Set();

const $ = s => document.querySelector(s);

const read = (key, fallback = []) => {
  try {
    return JSON.parse(
      localStorage.getItem(key) ||
      JSON.stringify(fallback)
    );
  } catch {
    return fallback;
  }
};

const items = () => read(KEY);
const favs = () => read(FAV);
const feedback = () => read(FEEDBACK);
const usage = () => read(USAGE);

function write(key, value) {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}

function esc(text) {
  return String(text || "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character])
  );
}

/* =========================
   COMPATIBILIDAD V0.2
========================= */

function normalize(item) {
  return {
    ...item,

    pattern:
      item.pattern ||
      "Liso",

    season:
      item.season ||
      "Todo el año",

    availability:
      item.availability ||
      "Disponible",

    formality:
      item.formality ||
      item.style ||
      "Casual"
  };
}

/* =========================
   NAVEGACIÓN
========================= */

function nav() {
  const options = [
    ["home", "⌂", "Inicio"],
    ["wardrobe", "♢", "Armario"],
    ["outfit", "✦", "Outfit"],
    ["favorites", "♡", "Favoritos"]
  ];

  return `
    <div class="nav">
      <div class="navin">

        ${options.map(option => `
          <button
            data-page="${option[0]}"
            class="${page === option[0] ? "active" : ""}"
          >
            <b>${option[1]}</b>
            ${option[2]}
          </button>
        `).join("")}

      </div>
    </div>
  `;
}

function layout(content) {
  $("#app").innerHTML = `
    <main class="shell">
      ${content}
    </main>

    ${nav()}
  `;

  document
    .querySelectorAll("[data-page]")
    .forEach(button => {

      button.onclick = () => {
        page = button.dataset.page;
        render();
      };

    });
}

/* =========================
   INICIO
========================= */

function home() {
  const clothes = items();

  layout(`
    <div class="brand">
      Vestia
    </div>

    <div class="tag">
      Tu armario. Mejor combinado.
    </div>

    <section class="hero">

      <span class="chip">
        Vestia v0.3
      </span>

      <h1>
        Vestirte bien,<br>
        con lo que ya tienes.
      </h1>

      <p>
        Ahora Vestia considera clima,
        disponibilidad, formalidad
        y tus gustos.
      </p>

      <button
        class="btn"
        id="create"
      >
        ✦ Crear mi outfit
      </button>

    </section>

    <div class="grid">

      <div class="card">
        <div class="stat">
          ${clothes.length}
        </div>

        <div class="label">
          prendas guardadas
        </div>
      </div>

      <div class="card">
        <div class="stat">
          ${favs().length}
        </div>

        <div class="label">
          outfits favoritos
        </div>
      </div>

    </div>

    <h3 class="sectiontitle">
      Tu armario
    </h3>

    <div class="card">

      <strong>
        Prepara tu ropa
      </strong>

      <p class="hint">
        Agrega prendas o edita las existentes
        para indicar patrón, temporada
        y disponibilidad.
      </p>

      <button
        class="btn alt"
        id="add"
      >
        + Agregar prenda
      </button>

    </div>
  `);

  $("#create").onclick = () => {
    page = "outfit";
    render();
  };

  $("#add").onclick = () => {
    itemForm();
  };
}

/* =========================
   ARMARIO
========================= */

function wardrobe() {

  const clothes =
    items().map(normalize);

  layout(`
    <div class="top">

      <h2>
        Mi armario
      </h2>

      <button
        class="btn"
        id="add"
        style="
          width:auto;
          margin:0;
          padding:11px 14px
        "
      >
        + Agregar
      </button>

    </div>

    ${
      clothes.length

      ? `
        <div class="wardrobe">

          ${clothes.map(item => `

            <div class="item">

              <img
                src="${item.photo}"
                alt="${esc(item.name)}"
              >

              <div class="meta">

                <strong>
                  ${esc(item.name)}
                </strong>

                <small>
                  ${esc(item.type)}
                  ·
                  ${esc(item.color)}
                  ·
                  ${esc(item.formality)}
                </small>

                <small>
                  ${esc(item.pattern)}
                  ·
                  ${esc(item.season)}
                  ·
                  ${esc(item.availability)}
                </small>

                <div
                  style="
                    display:flex;
                    gap:10px
                  "
                >

                  <button
                    data-edit="${item.id}"
                    style="
                      border:0;
                      background:none;
                      padding:8px 0
                    "
                  >
                    Editar
                  </button>

                  <button
                    data-del="${item.id}"
                    style="
                      border:0;
                      background:none;
                      color:#9a3e3e;
                      padding:8px 0
                    "
                  >
                    Eliminar
                  </button>

                </div>

              </div>
            </div>

          `).join("")}

        </div>
      `

      : `
        <div class="empty">

          <div style="font-size:42px">
            ♢
          </div>

          <h3>
            Tu armario está vacío
          </h3>

          <p>
            Agrega tus primeras prendas.
          </p>

        </div>
      `
    }
  `);

  $("#add").onclick = () => {
    itemForm();
  };

  document
    .querySelectorAll("[data-edit]")
    .forEach(button => {

      button.onclick = () => {
        itemForm(
          Number(button.dataset.edit)
        );
      };

    });

  document
    .querySelectorAll("[data-del]")
    .forEach(button => {

      button.onclick = () => {

        const updated =
          items().filter(
            item =>
              String(item.id) !==
              button.dataset.del
          );

        write(KEY, updated);

        wardrobe();
      };

    });
}

/* =========================
   OPCIONES DE PRENDA
========================= */

const COLORS = [
  "Negro",
  "Blanco",
  "Gris",
  "Azul",
  "Azul marino",
  "Beige",
  "Caqui",
  "Crema",
  "Café",
  "Vino / Burdeos",
  "Verde",
  "Verde olivo",
  "Rojo",
  "Rosa",
  "Morado",
  "Amarillo",
  "Naranja",
  "Otro"
];

const TYPES = [
  "Camisa",
  "Playera",
  "Polo",
  "Suéter",
  "Chamarra",
  "Saco",
  "Abrigo",
  "Pantalón",
  "Jeans",
  "Short",
  "Tenis",
  "Zapatos",
  "Botas"
];

const FORMALITIES = [
  "Deportivo",
  "Muy casual",
  "Casual",
  "Smart casual",
  "Formal"
];

function options(list, selected) {
  return list.map(value => `
    <option
      ${value === selected ? "selected" : ""}
    >
      ${value}
    </option>
  `).join("");
}

/* =========================
   AGREGAR / EDITAR
========================= */

function itemForm(id = null) {

  const old =
    id
      ? normalize(
          items().find(
            item => item.id === id
          ) || {}
        )
      : null;

  let imageData =
    old?.photo || "";

  layout(`
    <div class="top">

      <h2>
        ${old ? "Editar" : "Nueva"} prenda
      </h2>

    </div>

    <div class="card">

      <img
        id="preview"
        class="preview"
        ${
          imageData
            ? `src="${imageData}"
               style="display:block"`
            : ""
        }
      >

      <label class="photo">

        📷<br>

        <b>
          ${
            old
              ? "Cambiar foto"
              : "Tomar o elegir foto"
          }
        </b>

        <input
          id="photo"
          type="file"
          accept="image/*"
          capture="environment"
        >

      </label>

      <label>
        Nombre
      </label>

      <input
        id="name"
        value="${esc(old?.name || "")}"
        placeholder="Ej. Camisa azul"
      >

      <label>
        Tipo
      </label>

      <select id="type">
        ${options(
          TYPES,
          old?.type
        )}
      </select>

      <label>
        Color principal
      </label>

      <select id="color">
        ${options(
          COLORS,
          old?.color
        )}
      </select>

      <label>
        Patrón
      </label>

      <select id="pattern">

        ${options(
          [
            "Liso",
            "Rayas",
            "Cuadros",
            "Estampado",
            "Otro"
          ],
          old?.pattern || "Liso"
        )}

      </select>

      <label>
        Temporada
      </label>

      <select id="season">

        ${options(
          [
            "Calor",
            "Templado",
            "Frío",
            "Todo el año"
          ],
          old?.season ||
          "Todo el año"
        )}

      </select>

      <label>
        Formalidad
      </label>

      <select id="formality">

        ${options(
          FORMALITIES,
          old?.formality ||
          old?.style ||
          "Casual"
        )}

      </select>

      <label>
        Disponibilidad
      </label>

      <select id="availability">

        ${options(
          [
            "Disponible",
            "En lavado"
          ],
          old?.availability ||
          "Disponible"
        )}

      </select>

      <button
        class="btn"
        id="save"
      >
        Guardar prenda
      </button>

      <button
        class="btn alt"
        id="cancel"
      >
        Cancelar
      </button>

    </div>
  `);

  $("#photo").onchange = event => {

    const file =
      event.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = () => {

      imageData =
        reader.result;

      $("#preview").src =
        imageData;

      $("#preview").style.display =
        "block";
    };

    reader.readAsDataURL(file);
  };

  $("#save").onclick = () => {

    const name =
      $("#name").value.trim();

    if (!imageData || !name) {

      alert(
        "Agrega una foto y un nombre."
      );

      return;
    }

    let clothes =
      items();

    const object = {

      id:
        old?.id ||
        Date.now(),

      photo:
        imageData,

      name,

      type:
        $("#type").value,

      color:
        $("#color").value,

      pattern:
        $("#pattern").value,

      season:
        $("#season").value,

      formality:
        $("#formality").value,

      style:
        $("#formality").value,

      availability:
        $("#availability").value
    };

    if (old) {

      clothes =
        clothes.map(item =>
          item.id === old.id
            ? object
            : item
        );

    } else {

      clothes.push(object);
    }

    try {

      write(
        KEY,
        clothes
      );

      page =
        "wardrobe";

      render();

    } catch {

      alert(
        "No hay suficiente espacio. " +
        "Prueba con una foto más pequeña."
      );
    }
  };

  $("#cancel").onclick = () => {
    page = "wardrobe";
    render();
  };
}

/* =========================
   CATEGORÍAS
========================= */

const TOPS = [
  "Camisa",
  "Playera",
  "Polo",
  "Suéter"
];

const OUTERS = [
  "Chamarra",
  "Saco",
  "Abrigo"
];

const BOTTOMS = [
  "Pantalón",
  "Jeans",
  "Short"
];

const SHOES = [
  "Tenis",
  "Zapatos",
  "Botas"
];

/* =========================
   COLOR
========================= */

const NEUTRALS = [
  "Negro",
  "Blanco",
  "Gris",
  "Beige",
  "Crema",
  "Caqui"
];

const COLOR_FRIENDS = {

  "Negro": [
    "Blanco",
    "Gris",
    "Beige",
    "Crema",
    "Azul",
    "Azul marino",
    "Vino / Burdeos",
    "Verde olivo"
  ],

  "Blanco": [
    "Negro",
    "Gris",
    "Azul",
    "Azul marino",
    "Beige",
    "Caqui",
    "Café",
    "Vino / Burdeos",
    "Verde olivo",
    "Rojo"
  ],

  "Azul marino": [
    "Blanco",
    "Gris",
    "Beige",
    "Caqui",
    "Crema",
    "Café",
    "Vino / Burdeos",
    "Verde olivo"
  ],

  "Beige": [
    "Negro",
    "Blanco",
    "Azul",
    "Azul marino",
    "Café",
    "Vino / Burdeos",
    "Verde olivo"
  ],

  "Vino / Burdeos": [
    "Negro",
    "Blanco",
    "Gris",
    "Beige",
    "Caqui",
    "Crema",
    "Azul marino"
  ],

  "Verde olivo": [
    "Negro",
    "Blanco",
    "Beige",
    "Caqui",
    "Crema",
    "Café",
    "Azul marino"
  ]
};

function colorScore(a, b) {

  if (a === b)
    return 3;

  if (
    NEUTRALS.includes(a) ||
    NEUTRALS.includes(b)
  )
    return 7;

  if (
    COLOR_FRIENDS[a]?.includes(b) ||
    COLOR_FRIENDS[b]?.includes(a)
  )
    return 10;

  return 1;
}

/* =========================
   CLIMA
========================= */

function seasonScore(
  season,
  climate
) {

  if (
    season === "Todo el año" ||
    season === climate
  )
    return 10;

  if (
    climate === "Templado"
  )
    return 4;

  return -8;
}

/* =========================
   FORMALIDAD
========================= */

const LEVEL = {
  "Deportivo": 0,
  "Muy casual": 1,
  "Casual": 2,
  "Smart casual": 3,
  "Formal": 4
};

function formalScore(
  itemStyle,
  requested
) {

  const difference =
    Math.abs(
      (LEVEL[itemStyle] ?? 2) -
      (LEVEL[requested] ?? 2)
    );

  if (difference === 0)
    return 12;

  if (difference === 1)
    return 5;

  return -6;
}

/* =========================
   OCASIÓN
========================= */

function occasionScore(
  pieces,
  occasion
) {

  const types =
    pieces.map(
      item => item.type
    );

  const formalities =
    pieces.map(
      item => item.formality
    );

  if (
    occasion === "Trabajo"
  ) {

    return (
      (
        formalities.some(
          style =>
            [
              "Smart casual",
              "Formal"
            ].includes(style)
        )
          ? 10
          : 0
      )

      +

      (
        types.some(
          type =>
            [
              "Camisa",
              "Polo",
              "Saco"
            ].includes(type)
        )
          ? 5
          : 0
      )
    );
  }

  if (
    occasion === "Cita"
  ) {

    return formalities.includes(
      "Smart casual"
    )
      ? 9
      : 3;
  }

  if (
    occasion ===
    "Salida con amigos"
  ) {

    return formalities.some(
      style =>
        [
          "Muy casual",
          "Casual"
        ].includes(style)
    )
      ? 8
      : 2;
  }

  if (
    occasion === "Evento"
  ) {

    return (
      (
        formalities.includes(
          "Formal"
        )
          ? 12
          : 0
      )

      +

      (
        types.includes(
          "Zapatos"
        )
          ? 6
          : 0
      )
    );
  }

  return 4;
}

/* =========================
   APRENDIZAJE
========================= */

function historyScore(pieces) {

  const ids =
    pieces.map(
      item =>
        String(item.id)
    );

  const reactions =
    feedback();

  const used =
    usage();

  let score = 0;

  reactions.forEach(record => {

    const overlap =
      (record.pieces || [])
        .filter(id =>
          ids.includes(
            String(id)
          )
        )
        .length;

    if (overlap) {

      score +=
        (
          record.reaction === "like"
            ? 3
            : -4
        )
        * overlap;
    }
  });

  ids.forEach(id => {

    score -= Math.min(
      8,
      (used[id] || 0) * 2
    );

  });

  return score;
}

/* =========================
   PUNTUACIÓN TOTAL
========================= */

function totalScore(
  pieces,
  style,
  occasion,
  climate
) {

  let score = 35;

  pieces.forEach(item => {

    score +=
      formalScore(
        item.formality,
        style
      );

    score +=
      seasonScore(
        item.season,
        climate
      );
  });

  for (
    let i = 0;
    i < pieces.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < pieces.length;
      j++
    ) {

      score +=
        colorScore(
          pieces[i].color,
          pieces[j].color
        );
    }
  }

  score +=
    occasionScore(
      pieces,
      occasion
    );

  score +=
    historyScore(
      pieces
    );

  return score;
}

/* =========================
   EXPLICACIÓN
========================= */

function explain(
  pieces,
  style,
  occasion,
  climate
) {

  const colors =
    pieces.map(
      item => item.color
    );

  const neutralColors =
    colors.filter(
      color =>
        NEUTRALS.includes(
          color
        )
    );

  let text = "";

  if (
    neutralColors.length
  ) {

    text +=
      `Los tonos ${neutralColors.join(" y ")} ` +
      "ayudan a equilibrar el conjunto. ";

  } else {

    text +=
      "Los colores seleccionados mantienen " +
      "un contraste moderado. ";
  }

  text +=
    `La formalidad se acerca a ${style.toLowerCase()} ` +
    `y las prendas son adecuadas para clima ${climate.toLowerCase()}.`;

  if (
    pieces.some(
      item =>
        OUTERS.includes(
          item.type
        )
    )
  ) {

    text +=
      " La capa exterior añade versatilidad " +
      "sin sustituir la prenda superior.";
  }

  return text;
}

function rating(score) {

  if (score >= 120)
    return "Excelente combinación";

  if (score >= 95)
    return "Muy buena combinación";

  if (score >= 75)
    return "Buena combinación";

  return "Opción diferente";
}

/* =========================
   RECOMENDACIONES
========================= */

function recommendations(
  style,
  occasion,
  climate
) {

  const clothes =
    items()
      .map(normalize)
      .filter(item =>
        item.availability !==
        "En lavado"

        &&

        !excluded.has(
          String(item.id)
        )
      );

  const tops =
    clothes.filter(item =>
      TOPS.includes(
        item.type
      )
    );

  const bottoms =
    clothes.filter(item =>
      BOTTOMS.includes(
        item.type
      )
    );

  const shoes =
    clothes.filter(item =>
      SHOES.includes(
        item.type
      )
    );

  const outers =
    clothes.filter(item =>
      OUTERS.includes(
        item.type
      )
    );

  if (
    !tops.length ||
    !bottoms.length ||
    !shoes.length
  ) {

    return [];
  }

  const combinations = [];

  tops.forEach(top => {

    bottoms.forEach(bottom => {

      shoes.forEach(shoe => {

        const basic = [
          top,
          bottom,
          shoe
        ];

        combinations.push({
          pieces: basic,

          score:
            totalScore(
              basic,
              style,
              occasion,
              climate
            )
        });

        outers.forEach(
          outer => {

            const layered = [
              top,
              bottom,
              shoe,
              outer
            ];

            combinations.push({
              pieces:
                layered,

              score:
                totalScore(
                  layered,
                  style,
                  occasion,
                  climate
                )
            });
          }
        );
      });
    });
  });

  combinations.sort(
    (a, b) =>
      b.score - a.score
  );

  const seen =
    new Set();

  const results =
    [];

  for (
    const combination
    of combinations
  ) {

    const signature =
      combination.pieces
        .map(item => item.id)
        .sort()
        .join("-");

    if (
      !seen.has(signature)
    ) {

      seen.add(signature);

      results.push(
        combination
      );
    }

    if (
      results.length === 3
    )
      break;
  }

  return results;
}

/* =========================
   CREAR OUTFIT
========================= */

function outfit() {

  const available =
    items()
      .map(normalize)
      .filter(item =>
        item.availability !==
        "En lavado"
      );

  layout(`
    <div class="top">

      <h2>
        ¿Qué me pongo?
      </h2>

    </div>

    <div class="card">

      <label>
        ¿Para qué ocasión?
      </label>

      <select id="occasion">

        ${options(
          [
            "Un día normal",
            "Trabajo",
            "Cita",
            "Salida con amigos",
            "Evento"
          ],
          "Trabajo"
        )}

      </select>

      <label>
        ¿Qué estilo buscas?
      </label>

      <select id="ostyle">

        ${options(
          FORMALITIES,
          "Casual"
        )}

      </select>

      <label>
        ¿Cómo está el clima?
      </label>

      <select id="climate">

        ${options(
          [
            "Calor",
            "Templado",
            "Frío"
          ],
          "Templado"
        )}

      </select>

      <button
        class="btn"
        id="go"
      >
        ✦ Crear mis outfits
      </button>

    </div>

    <div class="card">

      <strong>
        🚫 No quiero usar hoy
      </strong>

      <p class="hint">
        Toca una prenda para excluirla
        solo de esta búsqueda.
      </p>

      <div
        style="
          display:flex;
          gap:7px;
          flex-wrap:wrap
        "
      >

        ${available.map(item => `

          <button
            class="chip"
            data-exclude="${item.id}"
            style="
              border:1px solid #ddd
            "
          >
            ${esc(item.name)}
          </button>

        `).join("")}

      </div>

    </div>

    <div id="result"></div>
  `);

  document
    .querySelectorAll(
      "[data-exclude]"
    )
    .forEach(button => {

      const id =
        button.dataset.exclude;

      if (
        excluded.has(id)
      ) {

        button.style.opacity =
          ".45";
      }

      button.onclick = () => {

        if (
          excluded.has(id)
        ) {

          excluded.delete(id);

        } else {

          excluded.add(id);
        }

        button.style.opacity =
          excluded.has(id)
            ? ".45"
            : "1";
      };
    });

  $("#go").onclick = () => {

    showResults(
      $("#ostyle").value,
      $("#occasion").value,
      $("#climate").value
    );
  };
}

/* =========================
   RESULTADOS
========================= */

function showResults(
  style,
  occasion,
  climate
) {

  const results =
    recommendations(
      style,
      occasion,
      climate
    );

  const box =
    $("#result");

  if (
    !results.length
  ) {

    box.innerHTML = `
      <div class="card">

        <strong>
          No tengo suficientes prendas disponibles
        </strong>

        <p class="hint">
          Necesito una parte superior,
          una inferior y calzado que no estén
          en lavado ni excluidos.
        </p>

      </div>
    `;

    return;
  }

  const titles = [
    "★ Mejor opción",
    "◇ Alternativa",
    "✦ Algo diferente"
  ];

  box.innerHTML =
    results.map(
      (result, index) => {

        const id =
          result.pieces
            .map(
              item => item.id
            )
            .join("-");

        return `
          <div class="card">

            <span class="score">
              ${rating(result.score)}
            </span>

            <h3>
              ${titles[index]}
            </h3>

            <div class="outfit">

              ${result.pieces.map(item => `

                <img
                  src="${item.photo}"
                  alt="${esc(item.name)}"
                >

              `).join("")}

            </div>

            <div
              style="
                margin-top:10px
              "
            >

              ${result.pieces.map(item => `

                <span class="chip">
                  ${esc(item.name)}
                </span>

              `).join("")}

            </div>

            <p class="hint">

              <strong>
                Por qué funciona:
              </strong>

              ${
                explain(
                  result.pieces,
                  style,
                  occasion,
                  climate
                )
              }

            </p>

            <div
              style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:8px
              "
            >

              <button
                class="btn alt"
                data-react="like"
                data-id="${id}"
              >
                👍 Me gusta
              </button>

              <button
                class="btn alt"
                data-react="dislike"
                data-id="${id}"
              >
                👎 No me gusta
              </button>

            </div>

            <button
              class="btn alt"
              data-fav="${id}"
              style="margin-top:8px"
            >
              ♡ Guardar outfit
            </button>

          </div>
        `;
      }
    ).join("");

  /* FEEDBACK */

  document
    .querySelectorAll(
      "[data-react]"
    )
    .forEach(button => {

      button.onclick = () => {

        const result =
          results.find(
            option =>
              option.pieces
                .map(
                  item => item.id
                )
                .join("-")
              ===
              button.dataset.id
          );

        const records =
          feedback();

        records.push({

          outfitId:
            button.dataset.id,

          pieces:
            result.pieces.map(
              item => item.id
            ),

          reaction:
            button.dataset.react,

          date:
            Date.now()
        });

        write(
          FEEDBACK,
          records
        );

        button.textContent =
          "✓ Registrado";
      };
    });

  /* FAVORITOS */

  document
    .querySelectorAll(
      "[data-fav]"
    )
    .forEach(button => {

      button.onclick = () => {

        const result =
          results.find(
            option =>
              option.pieces
                .map(
                  item => item.id
                )
                .join("-")
              ===
              button.dataset.fav
          );

        const favorites =
          favs();

        if (
          !favorites.some(
            favorite =>
              favorite.id ===
              button.dataset.fav
          )
        ) {

          favorites.push({

            id:
              button.dataset.fav,

            date:
              new Date()
                .toLocaleDateString(
                  "es-MX"
                ),

            occasion,

            style,

            climate,

            pieces:
              result.pieces,

            score:
              result.score
          });

          write(
            FAV,
            favorites
          );
        }

        /* Registra uso para
           evitar repetir demasiado */

        const used =
          usage();

        result.pieces.forEach(
          item => {

            used[item.id] =
              (used[item.id] || 0)
              + 1;
          }
        );

        write(
          USAGE,
          used
        );

        button.textContent =
          "♥ Guardado";
      };
    });
}

/* =========================
   FAVORITOS
========================= */

function favorites() {

  const favorites =
    favs();

  layout(`
    <div class="top">

      <h2>
        Favoritos
      </h2>

    </div>

    ${
      favorites.length

      ? favorites
          .slice()
          .reverse()
          .map(favorite => {

            const pieces =
              favorite.pieces ||
              favorite.p ||
              [];

            return `
              <div class="card">

                <span class="score">
                  ${rating(
                    favorite.score
                  )}
                </span>

                <strong
                  style="
                    display:block;
                    margin-top:10px
                  "
                >

                  ${esc(
                    favorite.occasion
                  )}

                  ·

                  ${esc(
                    favorite.style
                  )}

                  ${
                    favorite.climate
                      ? " · " +
                        esc(
                          favorite.climate
                        )
                      : ""
                  }

                </strong>

                <div class="outfit">

                  ${pieces.map(piece => `

                    <img
                      src="${piece.photo}"
                      alt="${esc(piece.name)}"
                    >

                  `).join("")}

                </div>

                <small class="hint">

                  Guardado el
                  ${favorite.date}

                </small>

              </div>
            `;
          })
          .join("")

      : `
        <div class="empty">

          <div style="font-size:42px">
            ♡
          </div>

          <h3>
            Sin favoritos todavía
          </h3>

          <p>
            Los outfits que guardes
            aparecerán aquí.
          </p>

        </div>
      `
    }
  `);
}

/* =========================
   INICIAR
========================= */

function render() {

  const pages = {
    home,
    wardrobe,
    outfit,
    favorites
  };

  (
    pages[page] ||
    home
  )();
}

console.log(
  "Vestia v0.3 iniciada correctamente"
);

render();
