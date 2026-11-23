const KEY = "vestia-items-v1";
const FAV = "vestia-favs-v1";

let page = "home";

const $ = (selector) => document.querySelector(selector);

function items() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function favs() {
  return JSON.parse(localStorage.getItem(FAV) || "[]");
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function esc(text) {
  return String(text || "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
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
        ${options.map((option) => `
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
  const app = $("#app");

  if (!app) {
    console.error("Vestia: no se encontró #app");
    return;
  }

  app.innerHTML = `
    <main class="shell">
      ${content}
    </main>
    ${nav()}
  `;

  document.querySelectorAll("[data-page]").forEach((button) => {
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
  const wardrobeItems = items();

  layout(`
    <div class="brand">Vestia</div>
    <div class="tag">Tu armario. Mejor combinado.</div>

    <section class="hero">
      <span class="chip">Armario inteligente</span>

      <h1>
        Vestirte bien,<br>
        con lo que ya tienes.
      </h1>

      <p>
        Guarda tus prendas y deja que Vestia encuentre
        combinaciones para cada ocasión.
      </p>

      <button class="btn" id="create">
        Crear mi outfit
      </button>
    </section>

    <div class="grid">
      <div class="card">
        <div class="stat">${wardrobeItems.length}</div>
        <div class="label">prendas guardadas</div>
      </div>

      <div class="card">
        <div class="stat">${favs().length}</div>
        <div class="label">outfits favoritos</div>
      </div>
    </div>

    <h3 class="sectiontitle">Empieza aquí</h3>

    <div class="card">
      <strong>Agrega tu ropa</strong>

      <p class="hint">
        Toma una foto de cada prenda.
        Vestia la guardará únicamente en este dispositivo.
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

/* =========================
   ARMARIO
========================= */

function wardrobe() {
  const wardrobeItems = items();

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

  if (wardrobeItems.length) {
    content += `
      <div class="wardrobe">
        ${wardrobeItems.map((item) => `
          <div class="item">
            <img src="${item.photo}" alt="${esc(item.name)}">

            <div class="meta">
              <strong>${esc(item.name)}</strong>

              <small>
                ${esc(item.type)} · ${esc(item.color)}
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
        <p>Agrega tus primeras prendas para crear outfits.</p>
      </div>
    `;
  }

  layout(content);

  $("#add").onclick = addForm;

  document.querySelectorAll("[data-del]").forEach((button) => {
    button.onclick = () => {
      const updatedItems = items().filter(
        (item) => String(item.id) !== String(button.dataset.del)
      );

      save(updatedItems);
      wardrobe();
    };
  });
}

/* =========================
   AGREGAR PRENDA
========================= */

function addForm() {
  const colors = [
    "Negro",
    "Blanco",
    "Gris",
    "Azul",
    "Beige",
    "Café",
    "Verde",
    "Rojo",
    "Rosa",
    "Morado",
    "Amarillo",
    "Otro"
  ];

  layout(`
    <div class="top">
      <h2>Nueva prenda</h2>
    </div>

    <div class="card">
      <img id="preview" class="preview">

      <label class="photo">
        📷<br>
        <b>Tomar o elegir foto</b>

        <input
          id="photo"
          type="file"
          accept="image/*"
          capture="environment"
        >
      </label>

      <label>Nombre</label>
      <input
        id="name"
        placeholder="Ej. Camisa blanca"
      >

      <label>Tipo de prenda</label>

      <select id="type">
        <option>Camisa</option>
        <option>Playera</option>
        <option>Polo</option>
        <option>Suéter</option>
        <option>Chamarra</option>
        <option>Pantalón</option>
        <option>Jeans</option>
        <option>Short</option>
        <option>Tenis</option>
        <option>Zapatos</option>
        <option>Botas</option>
      </select>

      <label>Color</label>

      <select id="color">
        ${colors.map((color) => `
          <option>${color}</option>
        `).join("")}
      </select>

      <label>Estilo</label>

      <select id="style">
        <option>Casual</option>
        <option>Smart casual</option>
        <option>Formal</option>
        <option>Deportivo</option>
      </select>

      <button class="btn" id="save">
        Guardar prenda
      </button>

      <button class="btn alt" id="cancel">
        Cancelar
      </button>
    </div>
  `);

  let imageData = "";

  $("#photo").onchange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      imageData = reader.result;

      $("#preview").src = imageData;
      $("#preview").style.display = "block";
    };

    reader.readAsDataURL(file);
  };

  $("#save").onclick = () => {
    const name = $("#name").value.trim();

    if (!imageData || !name) {
      alert("Agrega una foto y un nombre.");
      return;
    }

    const wardrobeItems = items();

    wardrobeItems.push({
      id: Date.now(),
      photo: imageData,
      name: name,
      type: $("#type").value,
      color: $("#color").value,
      style: $("#style").value
    });

    try {
      save(wardrobeItems);

      page = "wardrobe";
      render();
    } catch (error) {
      alert(
        "El almacenamiento del navegador está lleno. " +
        "Prueba con una foto de menor tamaño."
      );
    }
  };

  $("#cancel").onclick = () => {
    page = "wardrobe";
    render();
  };
}

/* =========================
   MOTOR DE OUTFITS
========================= */

const topTypes = [
  "Camisa",
  "Playera",
  "Polo",
  "Suéter",
  "Chamarra"
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

function score(top, bottom, shoe, style) {
  let points = 65;

  [top, bottom, shoe].forEach((item) => {
    if (item.style === style) {
      points += 7;
    }
  });

  const colors = [
    top.color,
    bottom.color,
    shoe.color
  ];

  const neutralColors = [
    "Blanco",
    "Negro",
    "Gris",
    "Beige"
  ];

  if (
    colors.some((color) =>
      neutralColors.includes(color)
    )
  ) {
    points += 8;
  }

  if (new Set(colors).size <= 2) {
    points += 6;
  }

  return Math.min(99, points);
}

function recommend(style) {
  const wardrobeItems = items();

  const tops = wardrobeItems.filter((item) =>
    topTypes.includes(item.type)
  );

  const bottoms = wardrobeItems.filter((item) =>
    bottomTypes.includes(item.type)
  );

  const shoes = wardrobeItems.filter((item) =>
    shoeTypes.includes(item.type)
  );

  if (
    !tops.length ||
    !bottoms.length ||
    !shoes.length
  ) {
    return null;
  }

  const combinations = [];

  tops.forEach((top) => {
    bottoms.forEach((bottom) => {
      shoes.forEach((shoe) => {
        combinations.push({
          pieces: [top, bottom, shoe],
          score: score(
            top,
            bottom,
            shoe,
            style
          )
        });
      });
    });
  });

  combinations.sort(
    (a, b) => b.score - a.score
  );

  return combinations[0];
}

/* =========================
   CREAR OUTFIT
========================= */

function outfit() {
  layout(`
    <div class="top">
      <h2>Crear outfit</h2>
    </div>

    <div class="card">
      <label>¿Para qué ocasión?</label>

      <select id="occasion">
        <option>Un día normal</option>
        <option>Trabajo</option>
        <option>Cita</option>
        <option>Salida con amigos</option>
        <option>Evento</option>
      </select>

      <label>¿Qué estilo buscas?</label>

      <select id="ostyle">
        <option>Casual</option>
        <option>Smart casual</option>
        <option>Formal</option>
        <option>Deportivo</option>
      </select>

      <button class="btn" id="go">
        ✦ Recomendarme algo
      </button>
    </div>

    <div id="result"></div>
  `);

  $("#go").onclick = () => {
    const selectedStyle = $("#ostyle").value;
    const recommendation = recommend(selectedStyle);
    const result = $("#result");

    if (!recommendation) {
      result.innerHTML = `
        <div class="card">
          <strong>Aún faltan prendas</strong>

          <p class="hint">
            Para recomendar un outfit necesito al menos:
            una prenda superior, un pantalón/jeans/short
            y un par de zapatos, tenis o botas.
          </p>
        </div>
      `;

      return;
    }

    const outfitId = recommendation.pieces
      .map((item) => item.id)
      .join("-");

    result.innerHTML = `
      <div class="card">
        <span class="score">
          ${recommendation.score}% compatible
        </span>

        <h3>Mi recomendación</h3>

        <div class="outfit">
          ${recommendation.pieces.map((item) => `
            <img
              src="${item.photo}"
              title="${esc(item.name)}"
              alt="${esc(item.name)}"
            >
          `).join("")}
        </div>

        ${recommendation.pieces.map((item) => `
          <span class="chip">
            ${esc(item.name)}
          </span>
        `).join("")}

        <p class="hint">
          Elegí esta combinación considerando el estilo
          seleccionado y una mezcla equilibrada de colores.
        </p>

        <button class="btn alt" id="fav">
          ♡ Guardar outfit
        </button>
      </div>
    `;

    $("#fav").onclick = () => {
      const favoriteOutfits = favs();

      const alreadySaved = favoriteOutfits.some(
        (favorite) => favorite.id === outfitId
      );

      if (!alreadySaved) {
        favoriteOutfits.push({
          id: outfitId,
          date: new Date().toLocaleDateString("es-MX"),
          occasion: $("#occasion").value,
          style: $("#ostyle").value,
          pieces: recommendation.pieces,
          score: recommendation.score
        });

        localStorage.setItem(
          FAV,
          JSON.stringify(favoriteOutfits)
        );
      }

      $("#fav").textContent = "♥ Guardado";
    };
  };
}

/* =========================
   FAVORITOS
========================= */

function favorites() {
  const favoriteOutfits = favs();

  let content = `
    <div class="top">
      <h2>Favoritos</h2>
    </div>
  `;

  if (favoriteOutfits.length) {
    content += favoriteOutfits
      .slice()
      .reverse()
      .map((favorite) => {
        const pieces =
          favorite.pieces || favorite.p || [];

        return `
          <div class="card">
            <span class="score">
              ${favorite.score}% compatible
            </span>

            <strong
              style="display:block;margin-top:10px"
            >
              ${esc(favorite.occasion)} ·
              ${esc(favorite.style)}
            </strong>

            <div class="outfit">
              ${pieces.map((piece) => `
                <img
                  src="${piece.photo}"
                  alt="${esc(piece.name)}"
                >
              `).join("")}
            </div>

            <small class="hint">
              Guardado el ${favorite.date}
            </small>
          </div>
        `;
      })
      .join("");
  } else {
    content += `
      <div class="empty">
        <div style="font-size:42px">♡</div>
        <h3>Sin favoritos todavía</h3>
        <p>
          Los outfits que guardes aparecerán aquí.
        </p>
      </div>
    `;
  }

  layout(content);
}

/* =========================
   INICIAR VESTIA
========================= */

function render() {
  const pages = {
    home,
    wardrobe,
    outfit,
    favorites
  };

  const currentPage = pages[page] || home;
  currentPage();
}

console.log("Vestia iniciada correctamente");
render();
