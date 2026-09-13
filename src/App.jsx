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
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  // ⭐ LOAD from localStorage (runs once)
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem("todos")
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos))}
    } catch (err) {
      console.error("Error loading todos:", err)}
    setIsLoaded(true)   // ⭐ mark loaded
  }, [])
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todos", JSON.stringify(todos))}
  }, [todos, isLoaded])

  const handleEdit = (id) => {
    let t = todos.find(i => i.id === id)
    if (!t) return;
    setTodo(t.todo)
    setEditId(id) }

  const handleDelete = (id) => {
    let newtodos = todos.filter(item => item.id !== id);
    setTodos(newtodos);
}
  const handleAdd = () => {
    if (todo.trim() === "") return

    if (editId) {
      let updatedTodos = todos.map(item =>
        item.id === editId ? { ...item, todo } : item)
      setTodos(updatedTodos)
      setEditId(null)} 
      else {
      setTodos([
        ...todos,{
          id: uuidv4(),
          todo,
          isComplete: false,
          createdAt: Date.now(),
          priority: "Medium" // new
        }])}

    setTodo("")}

  const handleChange = (e) => {
    setTodo(e.target.value)}

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
  const focusInput = () => {
    inputRef.current.focus()
  }
  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files)

    const newFiles = uploadedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      id: Date.now() + Math.random()
    }))

    setFiles(prev => [...prev, ...newFiles])
  }
  const openFilePicker = () => {
    fileInputRef.current.click()
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
            <span
              onClick={() => setActiveTab("tasks")}
              className={`${activeTab === "tasks"
                ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                : "text-gray-400 cursor-pointer"}`}
            >
              Tasks ({todos.length})
            </span>

            <span
              onClick={() => setActiveTab("timeline")}
              className={`${activeTab === "timeline"
                ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                : "text-gray-400 cursor-pointer"}`}
            >
              Timeline
            </span>

            <span
              onClick={() => setActiveTab("files")}
              className={`${activeTab === "files"
                ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                : "text-gray-400 cursor-pointer"}`}
            >
              Files
            </span>

            <span
              onClick={() => setActiveTab("report")}
              className={`${activeTab === "report"
                ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                : "text-gray-400 cursor-pointer"}`}
            >
              Report
            </span>
          </div>

          {/* Input */}
          <div className="flex gap-3 mb-6">
            <input
              ref={inputRef}
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
          {/* TAB CONTENT */}

          {activeTab === "tasks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {todos.map(item => (
                (showFinish || !item.isComplete) &&

                <div
                  key={item.id}
                  className="relative p-[1px] rounded-2xl bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400"
                >
                  <div className="bg-[#020617] rounded-2xl p-5 h-full">

                    <div className="flex gap-2 mb-3">
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                        Task
                      </span>
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                        Dev
                      </span>
                    </div>

                    <h2 className="text-lg font-semibold mb-2">
                      {item.todo}
                    </h2>

                    <p className="text-sm text-gray-400 mb-4">
                      Manage and track your task efficiently.
                    </p>

                    <div className="text-xs text-gray-400 mb-4">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "Today"}
                    </div>

                    <div className="flex justify-between items-center">

                      <span className={`text-xs px-2 py-1 rounded ${item.priority === "High"
                        ? "bg-red-500"
                        : item.priority === "Low"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                        }`}>
                        {item.priority}
                      </span>

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
              <div
                onClick={focusInput}
                className="flex items-center justify-center border border-dashed border-gray-700 rounded-2xl h-40 cursor-pointer hover:bg-gray-800 transition"
              >
                <div className="text-center text-gray-400">
                  <div className="text-2xl mb-2">+</div>
                  Add New Task
                </div>
              </div>

            </div>
          )}

          {activeTab === "timeline" && (
            <div className="text-gray-400">
              {activeTab === "timeline" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {[...todos]
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map(item => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-[#020617] border border-gray-800"
                      >
                        <p className="text-sm text-gray-400 mb-1">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                        <h2 className="text-lg font-semibold">{item.todo}</h2>
                      </div>
                    ))}

                </div>
              )}
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-4">

              {/* Upload Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Your Files</h2>

                <button
                  onClick={openFilePicker}
                  className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
                >
                  Upload File
                </button>

                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* File Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {files.length === 0 && (
                  <div className="text-gray-400 col-span-3 text-center">
                    No files uploaded yet
                  </div>
                )}

                {files.map(file => (
                  <div
                    key={file.id}
                    className="p-5 rounded-xl bg-[#020617] border border-gray-800 hover:bg-gray-900 cursor-pointer transition"
                    onClick={() => alert(`Opening ${file.name}`)}
                  >
                    <h2 className="text-md font-semibold mb-2">{file.name}</h2>

                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>

                    <div className="mt-3 flex justify-between text-xs text-gray-400">
                      <span>{file.type || "Unknown"}</span>
                      <span>Open</span>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          )}

          {activeTab === "report" && (
            <div className="text-gray-400">
              {activeTab === "report" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  <div className="p-5 bg-[#020617] rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-sm">Total Tasks</p>
                    <h2 className="text-2xl font-bold">{todos.length}</h2>
                  </div>

                  <div className="p-5 bg-[#020617] rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-sm">Completed</p>
                    <h2 className="text-2xl font-bold">
                      {todos.filter(t => t.isComplete).length}
                    </h2>
                  </div>

                  <div className="p-5 bg-[#020617] rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-sm">Pending</p>
                    <h2 className="text-2xl font-bold">
                      {todos.filter(t => !t.isComplete).length}
                    </h2>
                  </div>

                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App;