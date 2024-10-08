import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App() {

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isDarkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("listOfTasks");
    if(data){
      setTasks(JSON.parse(data));
    }
    const currentTheme = localStorage.getItem("isDarkTheme");
    setDarkTheme(JSON.parse(currentTheme));
  }, []);

  useEffect(() => {
    localStorage.setItem("listOfTasks", JSON.stringify(tasks));
    localStorage.setItem("isDarkTheme", JSON.stringify(isDarkTheme));
  });

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton 
      key={name} 
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
      />
  ));

  function toggleTaskCompleted(id){
    const updatedTasks = tasks.map((task) => {
      
      if(id === task.id){
        return {...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function toggleTaskImportant(id){
    const updatedTasks = tasks.map((task) => {
      if(id === task.id){
        return {...task, isImportant: !task.isImportant };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function editTask(id, newName){
    const editedTaskList = tasks.map((task) => {
      
      if(id === task.id){
        return { ...task, name: newName };
      }

      return task;
    });
    setTasks(editedTaskList);
  }

  function deleteTask(id){
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo 
        id={task.id} 
        name={task.name} 
        completed={task.completed} 
        isImportant={task.isImportant}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        toggleTaskImportant={toggleTaskImportant}
        deleteTask={deleteTask}
        editTask = {editTask}
      />
  ));

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  function addTask(name){
    const newTask = { id: `todo=${nanoid()}`, name, completed: false, isImportant: false }; 
    setTasks([...tasks, newTask]);
  }

  function handleTheme(){
    setDarkTheme(!isDarkTheme);
  }

  return (
    <div className={`todoapp stack-large ${isDarkTheme ? "dark-theme" : "" }`}>
      <h1>TodoMatic</h1>
      <button 
        type="button"
        className="btn"
        onClick={() => handleTheme()}>
        Change Theme
      </button>
      <Form addTask = {addTask} />
      <div className="clear-button-group">
        <button 
          type="button"
          className="btn btn__danger btn__lg"
          onClick={() => {
            localStorage.clear();
            setTasks([]);
          }}>
            Clear All
        </button>
      </div>
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;