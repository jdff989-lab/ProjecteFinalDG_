const botonGenerar = document.getElementById("generarBtn");
const botonLimpiar = document.getElementById("limpiarBtn");
const botonPDF = document.getElementById("pdfBtn");
const resultado = document.getElementById("resultado");
const estado = document.getElementById("estado");

let ultimoPlan = null;

botonGenerar.addEventListener("click", generarPlan);
botonLimpiar.addEventListener("click", limpiarFormulario);
botonPDF.addEventListener("click", descargarPDF);

async function generarPlan() {
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

  estado.className = "estado cargando";
  estado.textContent = "Generando plan con IA...";

  try {
    const respuesta = await fetch("/api/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre,
        edad,
        peso,
        altura,
        sexo,
        objetivo,
        nivel,
        dias
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || "No se pudo generar el plan.");
    }

    ultimoPlan = {
      nombre,
      edad,
      peso,
      altura,
      sexo,
      objetivo,
      nivel,
      dias,
      metabolismoBasal,
      mantenimiento,
      objetivoCalorico,
      resumen: datos.resumen,
      planNutricional: datos.planNutricional,
      planEntrenamiento: datos.planEntrenamiento,
      recomendaciones: datos.recomendaciones
    };

    pintarResultado(ultimoPlan);

    estado.className = "estado ok";
    estado.textContent = "Plan generado correctamente.";
  } catch (error) {
    console.error(error);
    mostrarError(error.message || "Ha ocurrido un error.");
    estado.className = "estado error";
    estado.textContent = "Error al generar el plan con IA.";
  }
}

function pintarResultado(plan) {
  resultado.style.display = "block";
  resultado.innerHTML = `
    <div class="resultado-header">
      <h2>Plan personalizado ${plan.nombre ? "para " + plan.nombre : ""}</h2>
      <p>${plan.resumen || "Plan generado con IA según los datos introducidos."}</p>

      <div class="resumen-datos">
        <div class="dato"><strong>Edad:</strong> ${plan.edad} años</div>
        <div class="dato"><strong>Peso:</strong> ${plan.peso} kg</div>
        <div class="dato"><strong>Altura:</strong> ${plan.altura} cm</div>
        <div class="dato"><strong>Sexo:</strong> ${capitalizar(plan.sexo)}</div>
        <div class="dato"><strong>Objetivo:</strong> ${capitalizar(plan.objetivo)}</div>
        <div class="dato"><strong>Nivel:</strong> ${capitalizar(plan.nivel)}</div>
        <div class="dato"><strong>Días de entrenamiento:</strong> ${plan.dias}</div>
      </div>
    </div>

    <div class="bloque full">
      <h3>🔥 Cálculo orientativo de calorías</h3>
      <p>Estas cifras son aproximadas y sirven como punto de partida.</p>

      <div class="calorias-box">
        <div class="caloria-item">
          <span>Metabolismo basal</span>
          <strong>${plan.metabolismoBasal} kcal</strong>
        </div>
        <div class="caloria-item">
          <span>Mantenimiento</span>
          <strong>${plan.mantenimiento} kcal</strong>
        </div>
        <div class="caloria-item">
          <span>Objetivo diario</span>
          <strong>${plan.objetivoCalorico} kcal</strong>
        </div>
      </div>
    </div>

    <div class="cards-resultados">
      <div class="bloque">
        <h3>🥗 Plan nutricional</h3>
        <ul>
          ${plan.planNutricional.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>

      <div class="bloque">
        <h3>🏋️ Plan de entrenamiento</h3>
        <ul>
          ${plan.planEntrenamiento.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>

      <div class="bloque full">
        <h3>💡 Recomendaciones</h3>
        <ul>
          ${plan.recomendaciones.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function descargarPDF() {
  if (!ultimoPlan) {
    alert("Primero genera un plan antes de descargar el PDF.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const lineas = [];
  lineas.push("AI Bulk Trainer");
  lineas.push("");
  lineas.push(`Plan personalizado ${ultimoPlan.nombre ? "para " + ultimoPlan.nombre : ""}`);
  lineas.push("");
  lineas.push(`Edad: ${ultimoPlan.edad} años`);
  lineas.push(`Peso: ${ultimoPlan.peso} kg`);
  lineas.push(`Altura: ${ultimoPlan.altura} cm`);
  lineas.push(`Sexo: ${capitalizar(ultimoPlan.sexo)}`);
  lineas.push(`Objetivo: ${capitalizar(ultimoPlan.objetivo)}`);
  lineas.push(`Nivel: ${capitalizar(ultimoPlan.nivel)}`);
  lineas.push(`Días de entrenamiento: ${ultimoPlan.dias}`);
  lineas.push("");
  lineas.push("CALORÍAS ORIENTATIVAS");
  lineas.push(`Metabolismo basal: ${ultimoPlan.metabolismoBasal} kcal`);
  lineas.push(`Mantenimiento: ${ultimoPlan.mantenimiento} kcal`);
  lineas.push(`Objetivo diario: ${ultimoPlan.objetivoCalorico} kcal`);
  lineas.push("");
  lineas.push("PLAN NUTRICIONAL");
  ultimoPlan.planNutricional.forEach((item, i) => {
    lineas.push(`${i + 1}. ${item}`);
  });
  lineas.push("");
  lineas.push("PLAN DE ENTRENAMIENTO");
  ultimoPlan.planEntrenamiento.forEach((item, i) => {
    lineas.push(`${i + 1}. ${item}`);
  });
  lineas.push("");
  lineas.push("RECOMENDACIONES");
  ultimoPlan.recomendaciones.forEach((item, i) => {
    lineas.push(`${i + 1}. ${item}`);
  });

  let y = 15;
  const margen = 15;
  const ancho = 180;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  lineas.forEach((linea) => {
    const trozos = doc.splitTextToSize(linea, ancho);

    trozos.forEach((trozo) => {
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
      doc.text(trozo, margen, y);
      y += 7;
    });
  });

  const nombreArchivo = ultimoPlan.nombre
    ? `plan_${ultimoPlan.nombre}.pdf`
    : "plan_ai_bulk_trainer.pdf";

  doc.save(nombreArchivo);
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

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("peso").value = "";
  document.getElementById("altura").value = "";
  document.getElementById("sexo").value = "hombre";
  document.getElementById("objetivo").value = "subir peso";
  document.getElementById("nivel").value = "principiante";
  document.getElementById("dias").value = "";

  ultimoPlan = null;
  estado.textContent = "";
  estado.className = "estado";
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