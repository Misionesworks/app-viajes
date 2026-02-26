const express = require('express');
const fs = require('fs');
const app = express();

const archivo = 'datos.json';

if (!fs.existsSync(archivo)) {
  fs.writeFileSync(archivo, JSON.stringify([]));
}

app.get('/guardar', (req, res) => {
  const { ciudad, tipo, precio, comentario } = req.query;

  if (!ciudad || !tipo || !precio) {
    return res.send('Debes enviar: ciudad, tipo y precio');
  }

  const datos = JSON.parse(fs.readFileSync(archivo));

  const nuevoRegistro = {
    ciudad,
    tipo,
    precio: Number(precio),
    comentario: comentario || ""
  };

  datos.push(nuevoRegistro);
  fs.writeFileSync(archivo, JSON.stringify(datos, null, 2));

  res.json({ mensaje: "Guardado correctamente", registro: nuevoRegistro });
});

app.get('/ver', (req, res) => {
  const datos = JSON.parse(fs.readFileSync(archivo));
  res.json(datos);
});

app.get('/filtrar', (req, res) => {
  const { ciudad } = req.query;

  if (!ciudad) {
    return res.send('Debes indicar una ciudad: /filtrar?ciudad=Rio');
  }

  const datos = JSON.parse(fs.readFileSync(archivo));

  const resultados = datos.filter(d =>
    d.ciudad.toLowerCase() === ciudad.toLowerCase()
  );

  res.json(resultados);
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
