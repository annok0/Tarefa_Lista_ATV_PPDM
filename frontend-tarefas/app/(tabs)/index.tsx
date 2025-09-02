// app/index.tsx (Versão corrigida para o seu backend)

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';

// A URL base da API do seu colega
const API_URL = 'http://10.110.12.54:3000/api';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const [editingTaskId, setEditingTaskId] = useState(null); 
  const [editingTaskTitle, setEditingTaskTitle] = useState(''); 

  // --- Funções do CRUD ---

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      Alert.alert("Erro de Conexão", "Não foi possível carregar as tarefas.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (newTaskTitle.trim() === '') return;
    try {
      await axios.post(`${API_URL}/tasks`, { title: newTaskTitle });
      setNewTaskTitle('');
      fetchTasks();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);       // Define o ID da tarefa que estamos editando
    setEditingTaskTitle(task.title); // Preenche o input de edição com o título atual
  };

  const handleSaveEdit = async () => {
    if (editingTaskTitle.trim() === '') return; // Não salvar se o título estiver vazio

    try {
      // Requisição PUT para o backend com o novo título
      await axios.put(`${API_URL}/tasks/${editingTaskId}`, {
        title: editingTaskTitle,
      });

      // Limpa os estados de edição
      setEditingTaskId(null);
      setEditingTaskTitle('');

      fetchTasks(); // Atualiza a lista de tarefas na tela
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      Alert.alert("Erro", "Não foi possível salvar a alteração.");
    }
  };

  // Função para marcar/desmarcar uma tarefa
  const handleToggleTask = async (task) => {
    try {
      // **MUDANÇA IMPORTANTE AQUI**
      // Enviamos o status oposto de 'completed' no corpo da requisição
      await axios.put(`${API_URL}/tasks/${task.id}`, {
        completed: !task.completed 
      });
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      Alert.alert("Erro", "Não foi possível marcar a tarefa.");
    }
  };

  // --- Interface do Usuário ---

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar nova tarefa..."
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <Button title="Adicionar" onPress={handleAddTask} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          // Se o ID do item for o mesmo que está em edição...
          item.id === editingTaskId ? (
            // --- MODO DE EDIÇÃO ---
            <View style={styles.taskItem}>
              <TextInput
                style={styles.input} // Reutilizamos o estilo do input de adicionar
                value={editingTaskTitle}
                onChangeText={setEditingTaskTitle}
                autoFocus={true} // Foca no input automaticamente
              />
              <Button title="Salvar" onPress={handleSaveEdit} />
            </View>
          ) : (
            // --- MODO DE VISUALIZAÇÃO (NORMAL) ---
            <TouchableOpacity onPress={() => handleToggleTask(item)}>
              <View style={styles.taskItem}>
                <Text style={[styles.taskText, item.completed && styles.taskTextDone]}>
                  {item.title}
                </Text>
                <View style={styles.buttonsContainer}>
                  {/* BOTÃO DE EDITAR */}
                  <TouchableOpacity onPress={() => handleStartEdit(item)} style={styles.editButton}>
                      <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  {/* BOTÃO DE DELETAR */}
                  <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )
        )}
      />
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20, paddingHorizontal: 20, backgroundColor: '#f0f0f0' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    inputContainer: { flexDirection: 'row', marginBottom: 20 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, marginRight: 10, borderRadius: 5, backgroundColor: '#fff' },
    taskItem: { backgroundColor: '#fff', padding: 15, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, elevation: 2 },
    
    // --- MODIFICADO ---
    // Adicionamos flex: 1 para que o texto ocupe o espaço disponível
    // e empurre os botões para a direita, evitando que texto longo quebre o layout.
    taskText: {
      fontSize: 16,
      flex: 1, 
      marginRight: 10, // Adiciona um pequeno espaço antes dos botões
    },

    taskTextDone: {
      textDecorationLine: 'line-through',
      color: '#aaa'
    },
    
    // --- NOVO ---
    // Contêiner para alinhar os botões lado a lado
    buttonsContainer: {
      flexDirection: 'row',
    },

    // --- NOVO ---
    // Estilo para o novo botão de editar
    editButton: { 
      backgroundColor: 'orange', // Cor diferente para distinguir da exclusão
      paddingHorizontal: 12, 
      paddingVertical: 5, 
      borderRadius: 5,
      marginRight: 10, // Espaçamento entre o botão de editar e o de deletar
    },
    
    // --- NOVO ---
    // Estilo para o texto do botão de editar
    editButtonText: { 
      color: 'white', 
      fontWeight: 'bold' 
    },

    // Botão de deletar (inalterado)
    deleteButton: { 
      backgroundColor: 'red', 
      paddingHorizontal: 12, 
      paddingVertical: 5, 
      borderRadius: 5 
    },
    deleteButtonText: { 
      color: 'white', 
      fontWeight: 'bold' 
    }
});