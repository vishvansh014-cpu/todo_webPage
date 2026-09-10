import { useState, useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [editId, setEditId] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // ⭐ LOAD from localStorage (runs once)
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem("todos")
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos))
      }
    } catch (err) {
      console.error("Error loading todos:", err)
    }
    setIsLoaded(true)   // ⭐ mark loaded
  }, [])
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todos", JSON.stringify(todos))
    }
  }, [todos, isLoaded])


  const handleEdit = (id) => {
    let t = todos.find(i => i.id === id)
    if (!t) return;
    setTodo(t.todo)
    setEditId(id)
  }

  const handleDelete = (id) => {
    let newtodos = todos.filter(item => item.id !== id);
    setTodos(newtodos);
  }

  const handleAdd = () => {
    if (todo.trim() === "") return

    if (editId) {
      let updatedTodos = todos.map(item =>
        item.id === editId ? { ...item, todo } : item
      )
      setTodos(updatedTodos)
      setEditId(null)
    }
    else {
      setTodos([...todos, { id: uuidv4(), todo, isComplete: false }])
    }

    setTodo("")
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleCheckBox = (e) => {
    let id = e.target.name;

    let newtodos = todos.map(item =>
      item.id === id ? { ...item, isComplete: !item.isComplete } : item
    );

    setTodos(newtodos)
  }

  return (
    <>
      <Navbar />

      <div className='container mx-auto my-4 rounded-lg bg-blue-400 p-5 min-h-screen'>

        <div className='addTodo my-6'>
          <h2 className='text-lg font-bold'>Add a todo</h2>

          <input
            onChange={handleChange}
            value={todo}
            type="text"
            placeholder="Next Todo"
            className='rounded-lg w-96 p-1'
          />

          <button
            onClick={handleAdd}
            className='bg-white text-black rounded-lg m-3 cursor-pointer p-1 hover:bg-black hover:text-white transition-all'>
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <h2 className='text-xl font-bold'>My todo</h2>

        <div className='todos'>
          {todos.length === 0 && <div className='m-5'>No Todo To Display</div>}
          {todos.map(item => {
            return (
              <div key={item.id} className="todo flex w-1/2 justify-between items-center my-2">
                <div className='flex gap-5'>
                  <input
                    name={item.id}
                    onChange={handleCheckBox}
                    type="checkbox"
                    checked={item.isComplete}
                  />
                  <div className={item.isComplete ? "line-through" : ""}>
                    {item.todo}
                  </div>
                </div>

                <div className="buttons flex gap-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className='bg-white text-black rounded-lg px-2 py-1 hover:bg-black hover:text-white transition-all'>
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-white text-black rounded-lg px-2 py-1 hover:bg-black hover:text-white transition-all">
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </>
  )
}

export default App;