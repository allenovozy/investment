"use client"

import { useEffect, useState } from "react"
import { Edit2, Trash2, Plus } from "lucide-react"
import "../css/Tasks.css"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: "", description: "", reward: "" })
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch("https://72.60.93.14/server/Api/Admin/tasks/list.php", {
        credentials: "include",
      })
      const data = await res.json()
      setTasks(data.tasks || [])
    } catch (err) {
      console.error("Error fetching tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const url = editing ? "update.php" : "create.php"
    const body = editing ? { ...form, id: editing } : form

    try {
      const res = await fetch(`https://72.60.93.14/server/Api/Admin/tasks/${url}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        setForm({ title: "", description: "", reward: "" })
        setEditing(null)
        fetchTasks()
      } else {
        alert(data.message || "Failed to save task")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Error saving task")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return

    try {
      const res = await fetch("https://72.60.93.14/server/Api/Admin/tasks/delete.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) {
        fetchTasks()
      } else {
        alert(data.message || "Delete failed")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Error deleting task")
    }
  }

  const handleEdit = (task) => {
    setEditing(task.id)
    setForm({
      title: task.title,
      description: task.description,
      reward: String(task.reward),
    })
  }

  const handleCancel = () => {
    setEditing(null)
    setForm({ title: "", description: "", reward: "" })
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1>Task Management</h1>
        <p>Create and manage user tasks</p>
      </div>

      <div className="task-form">
        <h2>{editing ? "Edit Task" : "Create New Task"}</h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Task description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Reward ($)</label>
            <input
              type="number"
              placeholder="Reward amount"
              value={form.reward}
              onChange={(e) => setForm({ ...form, reward: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <Plus size={18} /> {editing ? "Update Task" : "Create Task"}
            </button>
            {editing && (
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="tasks-list">
        <h2>All Tasks</h2>
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">No tasks created yet</div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className="reward">${task.reward}</span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <button className="btn-icon edit" onClick={() => handleEdit(task)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDelete(task.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Tasks
