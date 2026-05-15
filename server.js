import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/plan", async (req, res) => {
  try {
    const { nombre, edad, peso, altura, sexo, objetivo, nivel, dias } = req.body;

    if (!edad || !peso || !altura || !sexo || !objetivo || !nivel || !dias) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

const prompt = `
Actúa como un entrenador personal profesional y nutricionista deportivo.

Genera un plan MUY DETALLADO y personalizado para este usuario.

DATOS DEL USUARIO:
- Nombre: ${nombre || "Usuario"}
- Edad: ${edad}
- Peso: ${peso} kg
- Altura: ${altura} cm
- Sexo: ${sexo}
- Objetivo: ${objetivo}
- Nivel: ${nivel}
- Días de entrenamiento por semana: ${dias}

REQUISITOS:

1. El plan nutricional debe incluir:
- Desayuno
- Media mañana
- Comida
- Merienda
- Cena

Cada comida debe tener alimentos concretos y cantidades aproximadas.

2. El plan de entrenamiento debe tener EXACTAMENTE ${dias} días.

Cada día debe incluir:
- grupo muscular
- ejercicios concretos
- series
- repeticiones

3. Las recomendaciones deben ser específicas, no genéricas.

Devuelve SOLO JSON válido con esta estructura exacta:

{
  "resumen": "Resumen personalizado del plan",
  "planNutricional": [
    {
      "comida": "Desayuno",
      "detalle": "Ejemplo detallado con cantidades"
    }
  ],
  "planEntrenamiento": [
    {
      "dia": "Día 1",
      "detalle": "Rutina detallada con ejercicios, series y repeticiones"
    }
  ],
  "recomendaciones": [
    "Consejo específico 1",
    "Consejo específico 2",
    "Consejo específico 3",
    "Consejo específico 4",
    "Consejo específico 5"
  ]
}

No uses markdown. No escribas nada fuera del JSON.
`;

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: prompt
    });

    const texto = response.output_text;

    let datosIA;
    try {
      datosIA = JSON.parse(texto);
    } catch {
      return res.status(500).json({
        error: "La IA no devolvió un JSON válido.",
        raw: texto
      });
    }

    res.json(datosIA);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al generar el plan con IA."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});