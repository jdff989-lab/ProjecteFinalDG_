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
Eres un entrenador personal y asesor nutricional.

Genera un plan claro, realista y bien organizado en español para este usuario:

Nombre: ${nombre || "Usuario"}
Edad: ${edad}
Peso: ${peso} kg
Altura: ${altura} cm
Sexo: ${sexo}
Objetivo: ${objetivo}
Nivel: ${nivel}
Días de entrenamiento por semana: ${dias}

Devuelve SOLO JSON válido con esta estructura exacta:
{
  "resumen": "texto breve",
  "planNutricional": ["punto 1", "punto 2", "punto 3", "punto 4", "punto 5"],
  "planEntrenamiento": ["punto 1", "punto 2", "punto 3", "punto 4", "punto 5"],
  "recomendaciones": ["punto 1", "punto 2", "punto 3", "punto 4", "punto 5"]
}

Reglas:
- Sé práctico, concreto y realista.
- No pongas texto fuera del JSON.
- No incluyas advertencias médicas largas.
- El plan debe ser fácil de entender para un estudiante.
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