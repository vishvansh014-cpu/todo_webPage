import { useState, useEffect, useRef } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [editId, setEditId] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showFinish, setShowFinish] = useState(true)
  const [activeTab, setActiveTab] = useState("tasks")
  const inputRef = useRef(null)

  // ✅ LOAD from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todos", JSON.stringify(todos))
    }
  }, [todos, isLoaded])

  // ✅ ADD / UPDATE
  const handleAdd = () => {
    if (todo.trim() === "") return

    if (editId) {
      const updated = todos.map(item =>
        item.id === editId ? { ...item, todo } : item
      )
      setTodos(updated)
      setEditId(null)
    } else {
      setTodos([
        ...todos,
        {
          id: uuidv4(),
          todo,
          isComplete: false,
          createdAt: Date.now(),
          priority: "Medium"
        }
      ])
    }

    setTodo("")
  }

  // ✅ EDIT
  const handleEdit = (id) => {
    const t = todos.find(i => i.id === id)
    if (!t) return
    setTodo(t.todo)
    setEditId(id)
  }

  // ✅ DELETE
  const handleDelete = (id) => {
    setTodos(todos.filter(item => item.id !== id))
  }

  // ✅ COMPLETE TOGGLE (MAIN FUNCTION)
  const handleCheckBox = (e) => {
    const id = e.target.name

    const updated = todos.map(item =>
      item.id === id
        ? { ...item, isComplete: !item.isComplete }
        : item
    )

    setTodos(updated)
  }

  // ✅ SHOW / HIDE COMPLETED
  const toggleFinished = () => {
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
          </div>

          {/* Tabs */}
          <div className="flex gap-6 text-sm mb-6">
            <span onClick={() => setActiveTab("tasks")}>Tasks ({todos.length})</span>
            <span onClick={() => setActiveTab("report")}>Report</span>
          </div>

          {/* Input */}
          <div className="flex gap-3 mb-4">
            <input
              ref={inputRef}
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              placeholder="Create new task..."
              className="flex-1 bg-[#020617] border border-gray-700 px-3 py-2 rounded-lg outline-none"
            />
            <button
              onClick={handleAdd}
              className="bg-orange-500 px-4 py-2 rounded"
            >
              {editId ? "Update" : "Create"}
            </button>
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleFinished}
            className="mb-6 bg-gray-800 px-3 py-1 rounded"
          >
            {showFinish ? "Hide Completed" : "Show Completed"}
          </button>

          {/* TASK TAB */}
          {activeTab === "tasks" && (
            <div className="grid gap-4">

              {[...todos]
                .sort((a, b) => a.isComplete - b.isComplete)
                .map(item => (
                  (showFinish || !item.isComplete) && (

                    <div key={item.id} className="p-4 bg-[#020617] rounded-xl border border-gray-800">

                      <div className="flex items-center gap-3">

                        {/* ✅ CHECKBOX */}
                        <input
                          type="checkbox"
                          checked={item.isComplete}
                          onChange={handleCheckBox}
                          name={item.id}
                        />

                        {/* ✅ TEXT WITH STRIKE */}
                        <h2 className={`text-lg font-semibold ${item.isComplete ? "line-through text-gray-500" : ""}`}>
                          {item.todo}
                        </h2>
                      </div>

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="bg-orange-500 px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                  )
                ))}
            </div>
          )}

          {/* REPORT TAB */}
          {activeTab === "report" && (
            <div className="grid grid-cols-3 gap-4">

              <div className="p-4 bg-[#020617] rounded">
                <p>Total</p>
                <h2>{todos.length}</h2>
              </div>

              <div className="p-4 bg-[#020617] rounded">
                <p>Completed</p>
                <h2>{todos.filter(t => t.isComplete).length}</h2>
              </div>

              <div className="p-4 bg-[#020617] rounded">
                <p>Pending</p>
                <h2>{todos.filter(t => !t.isComplete).length}</h2>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default App