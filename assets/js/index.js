document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";

  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("results");

  class Receta {
    constructor({ idMeal, strMeal, strMealThumb }) {
      this.id = idMeal;
      this.nombre = strMeal;
      this.imagen = strMealThumb;
    }
  }

  const limpiarResultados = () => {
    results.innerHTML = "";
  };

  const mostrarMensaje = (mensaje) => {
    results.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning text-center">
          ${mensaje}
        </div>
      </div>
    `;
  };

  const renderRecetas = (recetas) => {
    limpiarResultados();

    if (recetas.length === 0) {
      mostrarMensaje("No se encontraron recetas");
      return;
    }

    recetas.forEach(({ nombre, imagen, id }) => {
      const cardHTML = `
        <div class="col-lg-4 col-md-6 col-6">
          <div class="recipe-card">
            <img src="${imagen}" alt="${nombre}">
            <h5>${nombre}</h5>
            <button class="card-btn ver-receta" data-id="${id}">
              Ver receta
            </button>
          </div>
        </div>
      `;
      results.insertAdjacentHTML("beforeend", cardHTML);
    });
  };

  const buscarRecetas = async (ingrediente) => {
    try {
      const response = await fetch(
        `${API_URL}${encodeURIComponent(ingrediente)}`
      );
      const data = await response.json();

      if (!data.meals) {
        renderRecetas([]);
        return;
      }

      const recetas = data.meals.map(meal => new Receta(meal));
      renderRecetas(recetas);

    } catch (error) {
      mostrarMensaje("Error al buscar recetas");
      console.error(error);
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ingrediente = input.value.trim().toLowerCase();
    if (!ingrediente) {
      mostrarMensaje("Escribe un ingrediente");
      return;
    }

    buscarRecetas(ingrediente);
  });

});

/* DETALLE RECETA */

const detallereceta = async (id) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.meals[0];
  } catch (error) {
    console.error("Error al buscar detalle", error);
  }
};

/* EVENTO CLICK (MODAL) */

document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("ver-receta")) return;

  e.preventDefault();

  const id = e.target.dataset.id;
  const meal = await detallereceta(id);

  if (!meal) return;

  document.getElementById("modalTitulo").textContent = meal.strMeal;
  document.getElementById("modalImagen").src = meal.strMealThumb;
  document.getElementById("modalImagen").alt = meal.strMeal;
  document.getElementById("modalDetalle").textContent = meal.strInstructions;

 
  const modalElement = document.getElementById("recipeModal");
  if (!modalElement) {
    console.error("No se encontró el modal #recipeModal");
    return;
  }

  const modal = new bootstrap.Modal(modalElement);
  modal.show();
});
