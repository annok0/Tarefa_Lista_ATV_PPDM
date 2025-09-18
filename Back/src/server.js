// Back/src/server.js
const express = require('express');
const cors = require('cors');
const app = express();

// --- Início da Correção do CORS ---
// Configuração explícita para aceitar tudo
app.use(cors({
  origin: '*', // Permite QUALQUER origem
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'], // Permite todos os métodos http
  allowedHeaders: ['Content-Type', 'Authorization'], // Permite os cabeçalhos mais comuns
}));
// --- Fim da Correção do CORS ---

app.use(express.json());

let tasks = [];
let currentId = 1;

// Rotas da API
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { name } = req.body;
  if (name) {
    const newTask = { id: currentId++, name };
    tasks.push(newTask);
    res.status(201).json(newTask);
  } else {
    res.status(400).send('Task name is required');
  }
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id !== parseInt(id));
  res.status(204).send();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});