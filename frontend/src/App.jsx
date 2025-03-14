import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  
  const fetchTasks = () => {
    fetch("http://localhost:3050/liste_abrufen")
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const itemHinzufuegen = () => {
    if (!title.trim()) {
      return;
    }
    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((neueAufgabe) => {
        
        setTasks([...tasks, neueAufgabe]);
      })
      .catch((err) => console.error(err));

    setTitle("");
  };

  const itemLoeschen = (id_nummer) => {
    fetch(`http://localhost:3050/delete/${id_nummer}`, {
      method: "DELETE",
    })
      .then(() => {
        
        setTasks(tasks.filter(task => task.id !== id_nummer));
      })
      .catch((err) => console.error(err));
  };

  const toggleCheckbox = (task) => {
    fetch(`http://localhost:3050/update/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <h1>To-Do List</h1>
      <input 
        value={title}  
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Neues Todo" 
      />
      <button disabled={!title.trim()} onClick={itemHinzufuegen}>Add</button>
      <ul>
        {tasks.map(({ id, title, completed }) => (
          <li key={id}>
            <input 
              type='checkbox' 
              checked={completed}
              onChange={() => toggleCheckbox({ id, title, completed })}
            />
            {title}
            <button onClick={() => itemLoeschen(id)}>X</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
