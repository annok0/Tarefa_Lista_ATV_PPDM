const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware para habilitar o CORS
app.use(cors());

// Middleware para que o Express entenda JSON
app.use(express.json());

// Simulação de um banco de dados em memória
let tasks = [
    { id: 1, title: 'Estudar Node.js', completed: false },
    { id: 2, title: 'Fazer o projeto de PPDM', completed: true },
];
let nextId = 3;

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
    console.log(`Servidor rodando em http://localhost:${port}`);
});