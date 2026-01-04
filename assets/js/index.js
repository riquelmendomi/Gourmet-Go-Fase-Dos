document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";

  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("results");

  /* =======================
     CLASE RECETA (POO OPCIONAL)
  ======================= */

  class Receta {
    constructor({ idMeal, strMeal, strMealThumb }) {
      this.id = idMeal;
      this.nombre = strMeal;
      this.imagen = strMealThumb;
    }
  }

  /* =======================
     UTILIDADES
  ======================= */

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

  /* =======================
     RENDER DINÁMICO
  ======================= */

  const renderRecetas = (recetas) => {
    limpiarResultados();

    if (recetas.length === 0) {
      mostrarMensaje(
        "Lo sentimos, no se encontraron recetas. Intenta con otro ingrediente (ej: chicken)."
      );
      return;
    }

    recetas.forEach(({ nombre, imagen }) => {
      const cardHTML = `
        <div class="col-lg-4 col-md-6 col-6">
          <div class="recipe-card">
            <img src="${imagen}" alt="${nombre}">
            <h5>${nombre}</h5>
            <button class="card-btn">Ver receta</button>
          </div>
        </div>
      `;
      results.insertAdjacentHTML("beforeend", cardHTML);
    });
  };

  /* =======================
     FETCH A LA API
  ======================= */

  const buscarRecetas = async (ingrediente) => {
    try {
      const response = await fetch(
        `${API_URL}${encodeURIComponent(ingrediente)}`
      );
      const data = await response.json();

      if (data.meals === null) {
        renderRecetas([]);
        return;
      }

      const recetas = data.meals.map((meal) => new Receta(meal));
      renderRecetas(recetas);

    } catch (error) {
      mostrarMensaje("Ocurrió un error al buscar recetas");
      console.error(error);
    }
  };

  /* =======================
     EVENTO DEL FORM
  ======================= */

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // evita recarga (HU-04)

    const ingrediente = input.value.trim().toLowerCase();
    if (!ingrediente) {
      mostrarMensaje("Escribe un ingrediente para buscar");
      return;
    }

    buscarRecetas(ingrediente);
  });

});
