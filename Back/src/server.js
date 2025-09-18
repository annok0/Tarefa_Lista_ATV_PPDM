const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000; // Usa a porta do Render ou 3000 como padrão Middleware para habilitar o CORS

app.use(cors({
  origin: '*', // Permite qualquer origem
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'], // Permite todos os métodos que você usa
  allowedHeaders: ['Content-Type', 'Authorization'], // Permite os cabeçalhos comuns
}));

// Middleware para que o Express entenda JSON
app.use(express.json());

// Simulação de um banco de dados em memória
let tasks = []; // Array de tarefas agora inicia vazio
let nextId = 1; // O ID deve começar a partir de 1, já que não há tarefas pré-existentes

// Rotas da API
// GET /api/tasks: Lista todas as tarefas
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// POST /api/tasks: Adiciona uma nova tarefa
app.post('/api/tasks', (req, res) => {
    const newTask = {
        id: nextId++,
        title: req.body.title,
        completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /api/tasks/:id: Atualiza uma tarefa existente
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].title = req.body.title || tasks[taskIndex].title;
        tasks[taskIndex].completed = req.body.completed !== undefined ? req.body.completed : tasks[taskIndex].completed;
        res.status(200).json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: 'Tarefa não encontrada.' });
    }
});

// DELETE /api/tasks/:id: Remove uma tarefa
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== taskId);

    if (tasks.length < initialLength) {
        res.status(200).json({ message: 'Tarefa removida com sucesso!' });
    } else {
        res.status(404).json({ message: 'Tarefa não encontrada.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});