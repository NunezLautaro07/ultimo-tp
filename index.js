const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, 
   
  )
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => {
    console.error("Error de conexión a la base de datos:", error);
  });

const serieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  releaseYear: Number,
});

const Serie = mongoose.model("Serie", serieSchema);

app.post('/series', async (req, res) => {
  try {
    const newSerie = await Serie.create(req.body);
    res.status(201).json(newSerie);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la serie.' });
  }
});

app.get('/series', async (req, res) => {
  try {
    const series = await Serie.find();
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las series.' });
  }
});

app.put('/series/:id', async (req, res) => {
  try {
    const updatedSerie = await Serie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSerie) {
      res.status(404).json({ error: 'Serie no encontrada.' });
    } else {
      res.json(updatedSerie);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la serie.' });
  }
});

app.delete('/series/:id', async (req, res) => {
  try {
    const deletedSerie = await Serie.findByIdAndDelete(req.params.id);
    if (!deletedSerie) {
      res.status(404).json({ error: 'Serie no encontrada.' });
    } else {
      res.json(deletedSerie);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la serie.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
