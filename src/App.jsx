import { useState, useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [editId, setEditId] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showFinish, setShowFinish] = useState(true)

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
    } else {
      setTodos([
        ...todos,
        {
          id: uuidv4(),
          todo,
          isComplete: false,
          createdAt: Date.now(),
          priority: "Medium" // new
        }
      ])
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

  const toggleFinished = (e) => {
    setShowFinish(!showFinish)
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0b0f19] text-white flex justify-center p-6">
        <div className="w-full max-w-5xl bg-[#0f172a] rounded-2xl border border-gray-800 p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">Task Manager</h1>
            <span className="text-gray-400 cursor-pointer">✕</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 text-sm mb-6">
            <span className="text-orange-500 border-b-2 border-orange-500 pb-1">
              Tasks ({todos.length})
            </span>
            <span className="text-gray-400">Timeline</span>
            <span className="text-gray-400">Files</span>
            <span className="text-gray-400">Report</span>
          </div>

          {/* Input */}
          <div className="flex gap-3 mb-6">
            <input
              value={todo}
              onChange={handleChange}
              placeholder="Create new task..."
              className="flex-1 bg-[#020617] border border-gray-700 px-3 py-2 rounded-lg outline-none"
            />
            <button
              onClick={handleAdd}
              className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
            >
              {editId ? "Update" : "Create"}
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {todos.map(item => (
              (showFinish || !item.isComplete) &&

              <div
                key={item.id}
                className="relative p-[1px] rounded-2xl bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400"
              >
                <div className="bg-[#020617] rounded-2xl p-5 h-full">

                  {/* Tags */}
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                      Task
                    </span>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                      Dev
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold mb-2">
                    {item.todo}
                  </h2>

                  {/* Description (fake) */}
                  <p className="text-sm text-gray-400 mb-4">
                    Manage and track your task efficiently.
                  </p>

                  {/* Info */}
                  <div className="text-xs text-gray-400 mb-4">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "Today"}
                  </div>

                  {/* Bottom */}
                  <div className="flex justify-between items-center">

                    {/* Priority */}
                    <span className={`text-xs px-2 py-1 rounded ${item.priority === "High"
                        ? "bg-red-500"
                        : item.priority === "Low"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}>
                      {item.priority}
                    </span>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="bg-orange-500 px-3 py-1 rounded hover:bg-orange-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}

            {/* Add Card */}
            <div className="flex items-center justify-center border border-dashed border-gray-700 rounded-2xl h-40 cursor-pointer hover:bg-gray-800 transition">
              <div className="text-center text-gray-400">
                <div className="text-2xl mb-2">+</div>
                Add New Task
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default App;