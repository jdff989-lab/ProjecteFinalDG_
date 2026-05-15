const botonGenerar = document.getElementById("generarBtn");
const botonLimpiar = document.getElementById("limpiarBtn");
const resultado = document.getElementById("resultado");

botonGenerar.addEventListener("click", generarPlan);
botonLimpiar.addEventListener("click", limpiarFormulario);

function generarPlan() {
  const nombre = document.getElementById("nombre").value.trim();
  const edad = Number(document.getElementById("edad").value);
  const peso = Number(document.getElementById("peso").value);
  const altura = Number(document.getElementById("altura").value);
  const sexo = document.getElementById("sexo").value;
  const objetivo = document.getElementById("objetivo").value;
  const nivel = document.getElementById("nivel").value;
  const dias = Number(document.getElementById("dias").value);

  if (!edad || !peso || !altura || !dias) {
    mostrarError("Completa edad, peso, altura y días de entrenamiento.");
    return;
  }

  if (dias < 1 || dias > 7) {
    mostrarError("Los días de entrenamiento deben estar entre 1 y 7.");
    return;
  }

  const metabolismoBasal = calcularMB(peso, altura, edad, sexo);
  const mantenimiento = calcularCaloriasMantenimiento(metabolismoBasal, dias);
  const objetivoCalorico = calcularObjetivoCalorico(mantenimiento, objetivo);

  const dieta = generarDieta(objetivo);
  const rutina = generarRutina(dias, nivel);
  const consejos = generarConsejos(objetivo, nivel);

  resultado.style.display = "block";
  resultado.innerHTML = `
    <div class="resultado-header">
      <h2>Plan personalizado ${nombre ? "para " + nombre : ""}</h2>
      <p>Resumen orientativo generado según tus datos físicos y tu objetivo.</p>

      <div class="resumen-datos">
        <div class="dato"><strong>Edad:</strong> ${edad} años</div>
        <div class="dato"><strong>Peso:</strong> ${peso} kg</div>
        <div class="dato"><strong>Altura:</strong> ${altura} cm</div>
        <div class="dato"><strong>Sexo:</strong> ${capitalizar(sexo)}</div>
        <div class="dato"><strong>Objetivo:</strong> ${capitalizar(objetivo)}</div>
        <div class="dato"><strong>Nivel:</strong> ${capitalizar(nivel)}</div>
        <div class="dato"><strong>Días de entrenamiento:</strong> ${dias}</div>
      </div>
    </div>

    <div class="bloque full">
      <h3>🔥 Cálculo orientativo de calorías</h3>
      <p>Estas cifras son aproximadas y sirven como punto de partida.</p>

      <div class="calorias-box">
        <div class="caloria-item">
          <span>Metabolismo basal</span>
          <strong>${metabolismoBasal} kcal</strong>
        </div>
        <div class="caloria-item">
          <span>Mantenimiento</span>
          <strong>${mantenimiento} kcal</strong>
        </div>
        <div class="caloria-item">
          <span>Objetivo diario</span>
          <strong>${objetivoCalorico} kcal</strong>
        </div>
      </div>
    </div>

    <div class="cards-resultados">
      <div class="bloque">
        <h3>🥗 Plan nutricional</h3>
        <ul>
          ${dieta.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>

      <div class="bloque">
        <h3>🏋️ Plan de entrenamiento</h3>
        <ul>
          ${rutina.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>

      <div class="bloque full">
        <h3>💡 Recomendaciones</h3>
        <ul>
          ${consejos.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function calcularMB(peso, altura, edad, sexo) {
  let mb = 0;

  if (sexo === "hombre") {
    mb = 10 * peso + 6.25 * altura - 5 * edad + 5;
  } else {
    mb = 10 * peso + 6.25 * altura - 5 * edad - 161;
  }

  return Math.round(mb);
}

function calcularCaloriasMantenimiento(mb, dias) {
  let factorActividad = 1.2;

  if (dias <= 1) {
    factorActividad = 1.2;
  } else if (dias <= 3) {
    factorActividad = 1.375;
  } else if (dias <= 5) {
    factorActividad = 1.55;
  } else {
    factorActividad = 1.725;
  }

  return Math.round(mb * factorActividad);
}

function calcularObjetivoCalorico(mantenimiento, objetivo) {
  if (objetivo === "subir peso") {
    return mantenimiento + 300;
  } else if (objetivo === "bajar peso") {
    return mantenimiento - 300;
  }
  return mantenimiento;
}

function generarDieta(objetivo) {
  if (objetivo === "subir peso") {
    return [
      "Desayuno abundante con avena, fruta, huevos o yogur proteico.",
      "Comida principal con arroz, pasta o patata y una fuente potente de proteína.",
      "Añade 1 o 2 snacks altos en calorías: frutos secos, batidos, crema de cacahuete.",
      "Cena completa con carbohidrato, proteína y grasas saludables.",
      "Mantén una ingesta constante durante el día para llegar a tus calorías."
    ];
  } else if (objetivo === "bajar peso") {
    return [
      "Prioriza alimentos saciantes: verduras, fruta, legumbres y proteína magra.",
      "Reduce ultraprocesados, bebidas azucaradas y picoteo innecesario.",
      "Distribuye bien las comidas para llegar con menos hambre al final del día.",
      "Mantén una buena cantidad de proteína para proteger masa muscular.",
      "Controla porciones sin hacer una dieta extrema."
    ];
  } else {
    return [
      "Mantén una alimentación equilibrada con proteína, carbohidratos y grasas saludables.",
      "Usa comidas completas y sostenibles para mantener tu peso actual.",
      "Incluye verduras y fruta a diario.",
      "Evita cambios bruscos en calorías.",
      "Controla el progreso cada semana para ajustar si hace falta."
    ];
  }
}

function generarRutina(dias, nivel) {
  if (nivel === "principiante") {
    if (dias <= 2) {
      return [
        "2 días full body con ejercicios básicos.",
        "Sentadilla, press banca, remo y trabajo de core.",
        "1 o 2 series suaves de cardio al final."
      ];
    } else if (dias <= 4) {
      return [
        "Rutina torso/pierna o full body alternada.",
        "Ejercicios principales: sentadilla, peso muerto rumano, press, jalón y remo.",
        "Prioriza técnica antes que peso."
      ];
    } else {
      return [
        "División sencilla por grupos musculares.",
        "Combina fuerza básica y algo de hipertrofia.",
        "No metas demasiado volumen; mejor constancia."
      ];
    }
  } else {
    if (dias <= 3) {
      return [
        "Rutina full body o torso/pierna de 3 días.",
        "Trabajo de fuerza en básicos + accesorios.",
        "Controla progresión de cargas cada semana."
      ];
    } else if (dias <= 5) {
      return [
        "División por grupos musculares o push/pull/legs adaptado.",
        "Añade series efectivas para hipertrofia.",
        "Combina ejercicios compuestos y analíticos."
      ];
    } else {
      return [
        "Rutina avanzada dividida con frecuencia alta.",
        "Control de volumen, intensidad y recuperación.",
        "Evita sobreentrenar: más no siempre es mejor."
      ];
    }
  }
}

function generarConsejos(objetivo, nivel) {
  const consejosBase = [
    "Duerme entre 7 y 8 horas al día.",
    "Sé constante al menos 4 semanas antes de juzgar resultados.",
    "Haz seguimiento de peso, energía y rendimiento."
  ];

  if (objetivo === "subir peso") {
    consejosBase.push("Si no subes de peso en 2 semanas, aumenta 150-200 kcal.");
  } else if (objetivo === "bajar peso") {
    consejosBase.push("Si no bajas progreso, revisa porciones y actividad diaria.");
  } else {
    consejosBase.push("Mantén hábitos sostenibles en vez de buscar cambios extremos.");
  }

  if (nivel === "principiante") {
    consejosBase.push("Aprende bien la técnica antes de obsesionarte con levantar más.");
  } else {
    consejosBase.push("Programa la progresión y no entrenes siempre al límite.");
  }

  return consejosBase;
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("peso").value = "";
  document.getElementById("altura").value = "";
  document.getElementById("sexo").value = "hombre";
  document.getElementById("objetivo").value = "subir peso";
  document.getElementById("nivel").value = "principiante";
  document.getElementById("dias").value = "";

  resultado.style.display = "none";
  resultado.innerHTML = "";
}

function mostrarError(mensaje) {
  resultado.style.display = "block";
  resultado.innerHTML = `<p class="error">${mensaje}</p>`;
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}