const boton = document.getElementById("generarBtn");
const resultado = document.getElementById("resultado");

boton.addEventListener("click", generarPlan);

function generarPlan() {
  const nombre = document.getElementById("nombre").value.trim();
  const peso = document.getElementById("peso").value;
  const altura = document.getElementById("altura").value;
  const objetivo = document.getElementById("objetivo").value;
  const nivel = document.getElementById("nivel").value;
  const dias = document.getElementById("dias").value;

  if (!peso || !altura || !dias) {
    resultado.style.display = "block";
    resultado.innerHTML = `<p class="error">Completa peso, altura y días de entrenamiento.</p>`;
    return;
  }

  let dieta = "";
  let rutina = "";
  let consejos = "";

  if (objetivo === "subir peso") {
    dieta = "Desayuno fuerte, comida con arroz/pasta y proteína, cena completa y 2 snacks altos en calorías.";
    consejos = "Aumenta calorías poco a poco, prioriza proteína y duerme al menos 7-8 horas.";
  } else if (objetivo === "bajar peso") {
    dieta = "Comidas con alto volumen y proteína magra, menos ultraprocesados y control de calorías.";
    consejos = "Mantén déficit moderado, camina más y evita picar sin control.";
  } else {
    dieta = "Comidas equilibradas con buena cantidad de proteína, carbohidratos y grasas saludables.";
    consejos = "Mantén constancia, controla tu progreso y ajusta según tus resultados.";
  }

  if (nivel === "principiante") {
    rutina = `Rutina de ${dias} días con ejercicios básicos: sentadilla, press, remo, dominadas asistidas y cardio suave.`;
  } else {
    rutina = `Rutina de ${dias} días con división muscular, progresión de cargas y trabajo de fuerza + hipertrofia.`;
  }

  resultado.style.display = "block";
  resultado.innerHTML = `
    <h2>Plan personalizado ${nombre ? "para " + nombre : ""}</h2>

    <div class="bloque">
      <p><strong>Peso:</strong> ${peso} kg</p>
      <p><strong>Altura:</strong> ${altura} cm</p>
      <p><strong>Objetivo:</strong> ${objetivo}</p>
      <p><strong>Nivel:</strong> ${nivel}</p>
      <p><strong>Días de entrenamiento:</strong> ${dias}</p>
    </div>

    <div class="bloque">
      <h3>Dieta recomendada</h3>
      <p>${dieta}</p>
    </div>

    <div class="bloque">
      <h3>Rutina semanal</h3>
      <p>${rutina}</p>
    </div>

    <div class="bloque">
      <h3>Consejos</h3>
      <p>${consejos}</p>
    </div>
  `;
}