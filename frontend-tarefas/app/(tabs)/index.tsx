// app/index.tsx (Versão corrigida para o seu backend)

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';

// A URL base da API do seu colega
const API_URL = 'http://10.110.12.22:3000/api';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

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
          <TouchableOpacity onPress={() => handleToggleTask(item)}>
            <View style={styles.taskItem}>
              {/* **MUDANÇA IMPORTANTE AQUI** */}
              {/* Verificamos a propriedade 'item.completed' */}
              <Text style={[styles.taskText, item.completed && styles.taskTextDone]}>
                {item.title}
              </Text>
              <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
    taskText: {
      fontSize: 16,
    },
    taskTextDone: {
      textDecorationLine: 'line-through',
      color: '#aaa'
    },
    deleteButton: { backgroundColor: 'red', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 5 },
    deleteButtonText: { color: 'white', fontWeight: 'bold' }
});