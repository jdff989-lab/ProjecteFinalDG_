function generarPlan() {
  const nombre = document.getElementById("nombre").value;
  const peso = document.getElementById("peso").value;
  const altura = document.getElementById("altura").value;
  const objetivo = document.getElementById("objetivo").value;
  const nivel = document.getElementById("nivel").value;
  const dias = document.getElementById("dias").value;

  const resultado = `
    <h2>Plan para ${nombre || "el usuario"}</h2>
    <p><strong>Peso:</strong> ${peso} kg</p>
    <p><strong>Altura:</strong> ${altura} cm</p>
    <p><strong>Objetivo:</strong> ${objetivo}</p>
    <p><strong>Nivel:</strong> ${nivel}</p>
    <p><strong>Días de entrenamiento:</strong> ${dias}</p>

    <h3>Dieta recomendada</h3>
    <p>Desayuno alto en proteínas, comida completa con arroz y pollo, cena ligera y 2 snacks.</p>

    <h3>Rutina semanal</h3>
    <p>Entrenamiento dividido en ${dias} días, con ejercicios básicos y progresivos.</p>

    <h3>Consejos</h3>
    <p>Duerme bien, sé constante y ajusta tus calorías según tu objetivo.</p>
  `;

  document.getElementById("resultado").innerHTML = resultado;
}