import { useState, useEffect } from "react";
import axios from 'axios';
import { MdOutlineDone } from "react-icons/md"
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";

function App() {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState('');
  const [editedText, setEditedText] = useState('');
  
  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if(!newTodo.trim()) return;

    try {
      const response = await axios.post("/api/todos", {text: newTodo});
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };
  // Get all todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  useEffect(() => { 
    fetchTodos(); 
  }, []);

  // Update todo
  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  // Save update on todo
  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, { text: editedText });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo: ", error);
    }    
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error on deleting todo: ", error);
    }
  };
 
  // Toggle todo
  const toggleTodo = async (id) => {
    try {
      const isCompletedTodo = todos.find((todo) => todo._id ===id);
      const response = await axios.patch(`/api/todos/${id}`, {completed : !isCompletedTodo.completed});
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)))
    } catch (error) {
      console.log("Error toggling todo:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">📝 Task Manager</h1>
        <form 
          onSubmit={addTodo}
          className="flex items-center gap-2 shadow-sm border-gray-200 p-2 rounded-2xl">
          <input 
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
            type="submit"
          >
            Add Task
          </button>
        </form>

        <div className="mt-4">
          { todos.lenght === 0 ? (
            <div></div>
          ) : (
            <div className="flex flex-col gap-4">
              {todos.map((todo) =>(
                <div key={todo._id}>
                  { editingTodo === todo._id ? (
                    <div className="flex items-center">
                      <input
                        className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-grey-700 shadow-inner"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)} 
                      />
                      <div className="flex gap-x-2">
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                          onClick={() => saveEdit(todo._id)}>
                          <MdOutlineDone />
                        </button>
                        <button 
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer"
                          onClick={() => setEditingTodo(null)}>
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-4">
                        <button className={` h-6 w-6 border rounded-full flex items-center justify-center ${
                          todo.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 hover:border-blue-400"
                        }`}
                        onClick ={() => toggleTodo(todo._id)}
                        >
                          {todo.completed && <MdOutlineDone />}
                        </button>
                        <span className="text-gray-800 font-medium">{todo.text}</span>
                        </div>
                        <div className="flex gap-x-2">
                        <button
                          className="p-2 text-blue-500 hover:text-blue-700 rounded-lg cursor-pointer" 
                          onClick={() => startEditing (todo)}>
                          <MdModeEditOutline />
                        </button>
                        <button 
                          onClick={() => deleteTodo(todo._id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg cursor-pointer">
                          <FaTrash />
                        </button>
                        </div>
                      </div>
                    </div>
                  ) }
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
