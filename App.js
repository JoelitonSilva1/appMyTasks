import React,{ useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Modal, TextInput, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import * as Animatable from 'react-native-animatable';
import { StatusBar } from 'react-native'

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App(){
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
//Buscando tarefas ao iniciar
  useEffect(()=> {

      async function loadTasks(){
        const taskStorage = await AsyncStorage.getItem('@task');

        if(taskStorage){
          setTask(JSON.parse(taskStorage));
        }
      }

      loadTasks();

  }, []);

//Salvando tarefas alteradas
  useEffect(() => {

      async function saveTasks(){
        await AsyncStorage.setItem('@task', JSON.stringify(task));
      }

      saveTasks();

  }, [task]);

  function handleAdd(){
    if(input === '') return;

    const data = {
      key: input,
      task: input
    };

    setTask([...task, data]);
    setOpen(false);
    setInput('');
  }

  const handleDelete = useCallback((data) => {
    const find = task.filter(r => r.key !== data.key);
    setTask(find);
  })


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8a2be2" barStyle="ligth-content"  hidden = {false} translucent = {true} currentHeight/>
      
      <View style={styles.content}>
        
      <Text 
      style={styles.title}
      >Minhas Tarefas</Text>
      </View>
       
      <FlatList
      marginHorizontal={12}
      showsHorizontalScrollIndicator={false}
      data={task}
      keyExtractor={(item) => String(item.key) }
      renderItem={({item}) => <TaskList data={item} handleDelete={handleDelete} />  }
      />

    <Modal animationType="slide" transparent={false} visible={open}>
      <SafeAreaView style={styles.modal}>

        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={ () => setOpen(false) }>
            <Ionicons style={{marginLeft: 5, marginRight: 5}}name="md-arrow-back" size={30} color="#c0c0c0"/>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Nova tarefa</Text>
        </View>

        <Animatable.View style={styles.modalBody} animation="fadeInUp" useNativeDriver>
          <TextInput
          multiline={true}
          placeholderTextColor="#696969"
          autoFocus={true}
          autoCorrect={false}
          placeholder="Deseja adicionar uma tarefa?"
          style={styles.input}
          value={input}
          onChangeText={(texto) => setInput(texto)}
          />

         <TouchableOpacity style={styles.handleAdd} onPress={ handleAdd }>
          <Text style={styles.handleAddText}> Cadastrar</Text> 
         </TouchableOpacity> 
        </Animatable.View>

      </SafeAreaView>
    </Modal>

    <AnimatedBtn style={styles.add}
    useNativeDriver
    animation="bounceInUp"
    duration={1500}
    onPress={ () => setOpen(true) }
    >
      <Ionicons name="ios-add" size={35} color="#6A5ACD"/>
    </AnimatedBtn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A5ACD',
  },
 //Minhas Tarefas - CSS 
  title: {
    marginTop: 12,
    paddingTop: 35,
    paddingBottom: 12,
    fontSize: 25,
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  add:{
    position:'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset:{
      width: 1,
      height: 3,
    }
  },
  modal:{
    flex: 1,
    backgroundColor: '#6A5ACD',   
  },
  modalHeader:{
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle:{
    fontWeight: 'bold',
    marginLeft: 15,
    fontSize: 23,
    color: '#FFF',
    fontFamily: 'Roboto', 
  },
  modalBody:{
    marginTop: 15,
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: '#FFF',
    padding: 9,
    height: 150,
    textAlignVertical: 'top',
    color: '#000000',
    borderRadius: 10,
    fontFamily: 'Roboto', 
  },
  handleAdd: {
    backgroundColor: '#FFF',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 10,
  },
  //Botão Cadastrar
  handleAddText:{
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',  
  }
});
