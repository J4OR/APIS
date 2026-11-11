import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
app.set("json spaces", 2);

app.use(express.json());

let productos = [
  { id: 1, nombre: "Teclado", precio: 80000, stock: 10 },
  { id: 2, nombre: "Mouse", precio: 35000, stock: 25 }
];

let siguienteId = 3;

function validarCamposCompletos(body) {
  if (!body || typeof body !== 'object') {
    return 'Faltan datos';
  }

  const { nombre, precio, stock } = body;

  if (nombre === undefined || precio === undefined || stock === undefined) {
    return 'Faltan datos';
  }

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return 'Faltan datos';
  }

  const precioNum = Number(precio);
  const stockNum = Number(stock);

  if (Number.isNaN(precioNum) || Number.isNaN(stockNum) || precioNum < 0 || stockNum < 0) {
    return 'Precio y stock deben ser mayores o iguales a 0';
  }

  return null;
}

app.get('/productos', (req, res) => {
  res.status(200).json(productos);
});

app.get('/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: 'No existe' });
  }

  return res.status(200).json(producto);
});

app.post('/productos', (req, res) => {
  const error = validarCamposCompletos(req.body);

  if (error) {
    return res.status(400).json({ error });
  }

  const nuevo = {
    id: siguienteId++,
    nombre: req.body.nombre,
    precio: Number(req.body.precio),
    stock: Number(req.body.stock)
  };

  productos.push(nuevo);
  return res.status(201).json(nuevo);
});

app.put('/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = productos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'No existe' });
  }

  const error = validarCamposCompletos(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  productos[index] = {
    id,
    nombre: req.body.nombre,
    precio: Number(req.body.precio),
    stock: Number(req.body.stock)
  };

  return res.status(200).json(productos[index]);
});

app.patch('/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = productos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'No existe' });
  }

  const productoActual = productos[index];
  const camposActualizados = { ...productoActual };

  if (req.body.nombre !== undefined) {
    if (typeof req.body.nombre !== 'string' || req.body.nombre.trim() === '') {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    camposActualizados.nombre = req.body.nombre;
  }

  if (req.body.precio !== undefined) {
    const precio = Number(req.body.precio);
    if (Number.isNaN(precio) || precio < 0) {
      return res.status(400).json({ error: 'Precio y stock deben ser mayores o iguales a 0' });
    }
    camposActualizados.precio = precio;
  }

  if (req.body.stock !== undefined) {
    const stock = Number(req.body.stock);
    if (Number.isNaN(stock) || stock < 0) {
      return res.status(400).json({ error: 'Precio y stock deben ser mayores o iguales a 0' });
    }
    camposActualizados.stock = stock;
  }

  productos[index] = camposActualizados;
  return res.status(200).json(productos[index]);
});

app.delete('/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = productos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'No existe' });
  }

  productos.splice(index, 1);
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`servidor: http://localhost:${PORT}`);
});
