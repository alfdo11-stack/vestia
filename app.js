/* ==========================================
   VESTIA v0.2
   Recomendador local de outfits
========================================== */

const KEY = "vestia-items-v1";
const FAV = "vestia-favs-v1";
const FEEDBACK = "vestia-feedback-v1";

let page = "home";

const $ = (selector) => document.querySelector(selector);

function items() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function favs() {
  return JSON.parse(localStorage.getItem(FAV) || "[]");
}

function feedback() {
  return JSON.parse(localStorage.getItem(FEEDBACK) || "[]");
}

function saveItems(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function esc(text) {
  return String(text || "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

/* ==========================================
   NAVEGACIÓN
========================================== */

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
    <main class="shell">${content}</main>
    ${nav()}
  `;

  document.querySelectorAll("[data-page]").forEach(button => {
    button.onclick = () => {
      page = button.dataset.page;
      render();
    };
  });
}

/* ==========================================
   INICIO
========================================== */

function home() {
  const clothes = items();

  layout(`
    <div class="brand">Vestia</div>
    <div class="tag">Tu armario. Mejor combinado.</div>

    <section class="hero">
      <span class="chip">Vestia v0.2</span>

      <h1>
        Vestirte bien,<br>
        con lo que ya tienes.
      </h1>

      <p>
        Combina tus prendas según colores, estilo
        y la ocasión para la que te estás vistiendo.
      </p>

      <button class="btn" id="create">
        ✦ Crear mi outfit
      </button>
    </section>

    <div class="grid">
      <div class="card">
        <div class="stat">${clothes.length}</div>
        <div class="label">prendas guardadas</div>
      </div>

      <div class="card">
        <div class="stat">${favs().length}</div>
        <div class="label">outfits favoritos</div>
      </div>
    </div>

    <h3 class="sectiontitle">Tu armario</h3>

    <div class="card">
      <strong>Agrega tu ropa</strong>

      <p class="hint">
        Mientras más prendas registres, más combinaciones
        diferentes podrá encontrar Vestia.
      </p>

      <button class="btn alt" id="add">
        + Agregar prenda
      </button>
    </div>
  `);

  $("#create").onclick = () => {
    page = "outfit";
    render();
  };

  $("#add").onclick = addForm;
}

/* ==========================================
   ARMARIO
========================================== */

function wardrobe() {
  const clothes = items();

  let content = `
    <div class="top">
      <h2>Mi armario</h2>

      <button
        class="btn"
        id="add"
        style="width:auto;margin:0;padding:11px 14px"
      >
        + Agregar
      </button>
    </div>
  `;

  if (clothes.length) {
    content += `
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
                ${esc(item.style)}
              </small>

              <button
                data-del="${item.id}"
                style="
                  border:0;
                  background:none;
                  color:#9a3e3e;
                  padding:8px 0 0;
                "
              >
                Eliminar
              </button>

            </div>
          </div>
        `).join("")}

      </div>
    `;
  } else {
    content += `
      <div class="empty">
        <div style="font-size:42px">♢</div>

        <h3>Tu armario está vacío</h3>

        <p>
          Agrega tus primeras prendas para crear outfits.
        </p>
      </div>
    `;
  }

  layout(content);

  $("#add").onclick = addForm;

  document.querySelectorAll("[data-del]").forEach(button => {
    button.onclick = () => {

      const updated = items().filter(
        item =>
          String(item.id) !==
          String(button.dataset.del)
      );

      saveItems(updated);
      wardrobe();
    };
  });
}

/* ==========================================
   AGREGAR PRENDA
========================================== */

function addForm() {

  const colors = [
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

  layout(`
    <div class="top">
      <h2>Nueva prenda</h2>
    </div>

    <div class="card">

      <img
        id="preview"
        class="preview"
      >

      <label class="photo">
        📷<br>

        <b>
          Tomar o elegir foto
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
        placeholder="Ej. Playera vino"
      >

      <label>
        Tipo de prenda
      </label>

      <select id="type">

        <optgroup label="Parte superior">
          <option>Camisa</option>
          <option>Playera</option>
          <option>Polo</option>
          <option>Suéter</option>
        </optgroup>

        <optgroup label="Prenda exterior">
          <option>Chamarra</option>
          <option>Saco</option>
          <option>Abrigo</option>
        </optgroup>

        <optgroup label="Parte inferior">
          <option>Pantalón</option>
          <option>Jeans</option>
          <option>Short</option>
        </optgroup>

        <optgroup label="Calzado">
          <option>Tenis</option>
          <option>Zapatos</option>
          <option>Botas</option>
        </optgroup>

      </select>

      <label>
        Color principal
      </label>

      <select id="color">
        ${colors.map(color =>
          `<option>${color}</option>`
        ).join("")}
      </select>

      <label>
        Estilo
      </label>

      <select id="style">
        <option>Casual</option>
        <option>Smart casual</option>
        <option>Formal</option>
        <option>Deportivo</option>
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

  let imageData = "";

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

    const clothes = items();

    clothes.push({
      id: Date.now(),
      photo: imageData,
      name,
      type: $("#type").value,
      color: $("#color").value,
      style: $("#style").value
    });

    try {

      saveItems(clothes);

      page = "wardrobe";

      render();

    } catch (error) {

      alert(
        "No hay suficiente espacio. " +
        "Prueba con una fotografía más pequeña."
      );
    }
  };

  $("#cancel").onclick = () => {
    page = "wardrobe";
    render();
  };
}

/* ==========================================
   CLASIFICACIÓN DE PRENDAS
========================================== */

const topTypes = [
  "Camisa",
  "Playera",
  "Polo",
  "Suéter"
];

const outerTypes = [
  "Chamarra",
  "Saco",
  "Abrigo"
];

const bottomTypes = [
  "Pantalón",
  "Jeans",
  "Short"
];

const shoeTypes = [
  "Tenis",
  "Zapatos",
  "Botas"
];

/* ==========================================
   COMPATIBILIDAD DE COLOR
========================================== */

const neutralColors = [
  "Negro",
  "Blanco",
  "Gris",
  "Beige",
  "Crema",
  "Caqui"
];

const colorFriends = {

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
    "Verde",
    "Verde olivo",
    "Rojo"
  ],

  "Gris": [
    "Negro",
    "Blanco",
    "Azul",
    "Azul marino",
    "Vino / Burdeos",
    "Rosa",
    "Verde olivo"
  ],

  "Azul": [
    "Blanco",
    "Gris",
    "Beige",
    "Caqui",
    "Crema",
    "Café"
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

  "Caqui": [
    "Blanco",
    "Azul",
    "Azul marino",
    "Negro",
    "Vino / Burdeos",
    "Verde olivo"
  ],

  "Crema": [
    "Negro",
    "Azul",
    "Azul marino",
    "Café",
    "Vino / Burdeos",
    "Verde olivo"
  ],

  "Café": [
    "Blanco",
    "Beige",
    "Crema",
    "Azul",
    "Azul marino",
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

function colorsMatch(a, b) {

  if (a === b) {
    return 4;
  }

  if (
    neutralColors.includes(a) ||
    neutralColors.includes(b)
  ) {
    return 7;
  }

  if (
    colorFriends[a] &&
    colorFriends[a].includes(b)
  ) {
    return 10;
  }

  if (
    colorFriends[b] &&
    colorFriends[b].includes(a)
  ) {
    return 10;
  }

  return 1;
}

/* ==========================================
   FORMALIDAD
========================================== */

const styleLevel = {
  "Deportivo": 0,
  "Casual": 1,
  "Smart casual": 2,
  "Formal": 3
};

function styleCompatibility(
  itemStyle,
  requestedStyle
) {

  const difference =
    Math.abs(
      styleLevel[itemStyle] -
      styleLevel[requestedStyle]
    );

  if (difference === 0) return 12;
  if (difference === 1) return 5;

  return -5;
}

/* ==========================================
   OCASIÓN
========================================== */

function occasionScore(
  outfit,
  occasion
) {

  let points = 0;

  const styles =
    outfit.map(item => item.style);

  const types =
    outfit.map(item => item.type);

  if (occasion === "Trabajo") {

    if (
      styles.includes("Formal") ||
      styles.includes("Smart casual")
    ) {
      points += 10;
    }

    if (
      types.includes("Camisa") ||
      types.includes("Polo")
    ) {
      points += 5;
    }
  }

  if (occasion === "Cita") {

    if (
      styles.includes("Smart casual")
    ) {
      points += 8;
    }

    if (
      types.includes("Camisa") ||
      types.includes("Polo")
    ) {
      points += 4;
    }
  }

  if (
    occasion === "Salida con amigos"
  ) {

    if (
      styles.includes("Casual")
    ) {
      points += 8;
    }
  }

  if (occasion === "Evento") {

    if (
      styles.includes("Formal")
    ) {
      points += 12;
    }

    if (
      types.includes("Zapatos")
    ) {
      points += 6;
    }
  }

  return points;
}

/* ==========================================
   PUNTUACIÓN DEL OUTFIT
========================================== */

function outfitScore(
  pieces,
  requestedStyle,
  occasion
) {

  let points = 40;

  pieces.forEach(item => {

    points +=
      styleCompatibility(
        item.style,
        requestedStyle
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

      points += colorsMatch(
        pieces[i].color,
        pieces[j].color
      );
    }
  }

  points +=
    occasionScore(
      pieces,
      occasion
    );

  return points;
}

/* ==========================================
   EXPLICACIÓN
========================================== */

function explain(
  pieces,
  style,
  occasion
) {

  const colors =
    pieces.map(item => item.color);

  const neutral =
    colors.some(color =>
      neutralColors.includes(color)
    );

  let explanation =
    `Esta combinación funciona para ${occasion.toLowerCase()} `;

  if (neutral) {

    explanation +=
      "porque utiliza tonos neutros que equilibran el conjunto. ";

  } else {

    explanation +=
      "porque mantiene una relación equilibrada entre sus colores. ";
  }

  explanation +=
    `Además, las prendas se acercan al estilo ${style.toLowerCase()} que seleccionaste.`;

  return explanation;
}

function rating(score) {

  if (score >= 100) {
    return "Excelente combinación";
  }

  if (score >= 85) {
    return "Muy buena combinación";
  }

  if (score >= 70) {
    return "Buena combinación";
  }

  return "Combinación diferente";
}

/* ==========================================
   GENERAR RECOMENDACIONES
========================================== */

function recommendations(
  requestedStyle,
  occasion
) {

  const clothes = items();

  const tops =
    clothes.filter(item =>
      topTypes.includes(item.type)
    );

  const bottoms =
    clothes.filter(item =>
      bottomTypes.includes(item.type)
    );

  const shoes =
    clothes.filter(item =>
      shoeTypes.includes(item.type)
    );

  const outers =
    clothes.filter(item =>
      outerTypes.includes(item.type)
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

        const basicPieces = [
          top,
          bottom,
          shoe
        ];

        combinations.push({
          pieces: basicPieces,
          score: outfitScore(
            basicPieces,
            requestedStyle,
            occasion
          )
        });

        outers.forEach(outer => {

          const layeredPieces = [
            top,
            bottom,
            shoe,
            outer
          ];

          combinations.push({
            pieces: layeredPieces,
            score: outfitScore(
              layeredPieces,
              requestedStyle,
              occasion
            )
          });

        });
      });
    });
  });

  combinations.sort(
    (a, b) =>
      b.score - a.score
  );

  /* Evita mostrar exactamente
     las mismas piezas repetidas */

  const unique = [];

  const signatures =
    new Set();

  combinations.forEach(combo => {

    const signature =
      combo.pieces
        .map(item => item.id)
        .sort()
        .join("-");

    if (
      !signatures.has(signature)
    ) {

      signatures.add(signature);

      unique.push(combo);
    }
  });

  return unique.slice(0, 3);
}

/* ==========================================
   PANTALLA OUTFIT
========================================== */

function outfit() {

  layout(`
    <div class="top">
      <h2>¿Qué me pongo?</h2>
    </div>

    <div class="card">

      <label>
        ¿Para qué ocasión?
      </label>

      <select id="occasion">
        <option>Un día normal</option>
        <option>Trabajo</option>
        <option>Cita</option>
        <option>Salida con amigos</option>
        <option>Evento</option>
      </select>

      <label>
        ¿Qué estilo buscas?
      </label>

      <select id="ostyle">
        <option>Casual</option>
        <option>Smart casual</option>
        <option>Formal</option>
        <option>Deportivo</option>
      </select>

      <button
        class="btn"
        id="go"
      >
        ✦ Crear mis outfits
      </button>

    </div>

    <div id="result"></div>
  `);

  $("#go").onclick = () => {

    const style =
      $("#ostyle").value;

    const occasion =
      $("#occasion").value;

    const results =
      recommendations(
        style,
        occasion
      );

    const resultBox =
      $("#result");

    if (!results.length) {

      resultBox.innerHTML = `
        <div class="card">

          <strong>
            Aún faltan prendas
          </strong>

          <p class="hint">
            Necesito al menos una prenda superior,
            una parte inferior y un par de zapatos,
            tenis o botas.
          </p>

        </div>
      `;

      return;
    }

    const titles = [
      "★ Mi mejor opción",
      "Alternativa",
      "Algo diferente"
    ];

    resultBox.innerHTML =
      results.map(
        (result, index) => {

          const id =
            result.pieces
              .map(item => item.id)
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
                    title="${esc(item.name)}"
                    alt="${esc(item.name)}"
                  >
                `).join("")}

              </div>

              <div style="margin-top:10px">

                ${result.pieces.map(item => `
                  <span class="chip">
                    ${esc(item.name)}
                  </span>
                `).join("")}

              </div>

              <p class="hint">
                ${explain(
                  result.pieces,
                  style,
                  occasion
                )}
              </p>

              <div
                style="
                  display:grid;
                  grid-template-columns:1fr 1fr;
                  gap:8px;
                "
              >

                <button
                  class="btn alt"
                  data-like="${id}"
                >
                  👍 Me gusta
                </button>

                <button
                  class="btn alt"
                  data-dislike="${id}"
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

    /* Feedback */

    document
      .querySelectorAll("[data-like]")
      .forEach(button => {

        button.onclick = () => {

          saveFeedback(
            button.dataset.like,
            "like"
          );

          button.textContent =
            "✓ Me gusta";
        };
      });

    document
      .querySelectorAll("[data-dislike]")
      .forEach(button => {

        button.onclick = () => {

          saveFeedback(
            button.dataset.dislike,
            "dislike"
          );

          button.textContent =
            "✓ Registrado";
        };
      });

    /* Favoritos */

    document
      .querySelectorAll("[data-fav]")
      .forEach(button => {

        button.onclick = () => {

          const id =
            button.dataset.fav;

          const result =
            results.find(r =>
              r.pieces
                .map(item => item.id)
                .join("-") === id
            );

          if (!result) return;

          const favorites =
            favs();

          if (
            !favorites.some(
              favorite =>
                favorite.id === id
            )
          ) {

            favorites.push({
              id,
              date:
                new Date()
                  .toLocaleDateString(
                    "es-MX"
                  ),
              occasion,
              style,
              pieces:
                result.pieces,
              score:
                result.score
            });

            localStorage.setItem(
              FAV,
              JSON.stringify(favorites)
            );
          }

          button.textContent =
            "♥ Guardado";
        };
      });
  };
}

/* ==========================================
   APRENDIZAJE DE PREFERENCIAS
========================================== */

function saveFeedback(
  outfitId,
  reaction
) {

  const history =
    feedback();

  history.push({
    outfitId,
    reaction,
    date: Date.now()
  });

  localStorage.setItem(
    FEEDBACK,
    JSON.stringify(history)
  );
}

/* ==========================================
   FAVORITOS
========================================== */

function favorites() {

  const favoriteOutfits =
    favs();

  let content = `
    <div class="top">
      <h2>Favoritos</h2>
    </div>
  `;

  if (favoriteOutfits.length) {

    content +=
      favoriteOutfits
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
                ${esc(favorite.occasion)}
                ·
                ${esc(favorite.style)}
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
        .join("");

  } else {

    content += `
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
    `;
  }

  layout(content);
}

/* ==========================================
   RENDER
========================================== */

function render() {

  const pages = {
    home,
    wardrobe,
    outfit,
    favorites
  };

  const current =
    pages[page] || home;

  current();
}

console.log(
  "Vestia v0.2 iniciada correctamente"
);

render();
