import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Text, View } from 'react-native';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import api from '../../api'; // Importando a configuração da API

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    // Agora usando a instância 'api' para a chamada GET
    api.get('/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the tasks!", error);
      });
  }, []);

  const addTask = () => {
    if (newTask.trim() !== "") {
      // Agora usando a instância 'api' para a chamada POST
      api.post('/tasks', { name: newTask })
        .then(response => {
          setTasks([...tasks, response.data]);
          setNewTask("");
        })
        .catch(error => {
          console.error("There was an error adding the task!", error);
        });
    }
  };

  const deleteTask = (id) => {
    // Agora usando a instância 'api' para a chamada DELETE
    api.delete(`/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => {
        console.error("There was an error deleting the task!", error);
      });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Lista de Tarefas</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Adicionar nova tarefa"
        value={newTask}
        onChangeText={setNewTask}
      />
      <Button title="Adicionar" onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.taskContainer}>
            <ThemedText>{item.name}</ThemedText>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteButton}>Excluir</Text>
            </TouchableOpacity>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#fff'
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  deleteButton: {
    color: 'red',
  },
});