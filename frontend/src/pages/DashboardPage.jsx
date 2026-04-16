import { useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";
import useAuth from "../context/useAuth";
import MessageBanner from "../components/MessageBanner.jsx";

const initialTaskForm = {
  title: "",
  description: "",
  status: "todo",
  dueDate: "",
};

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialTaskForm);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { user } = useAuth();

  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await apiClient.get("/tasks", {
        params: {
          page: 1,
          limit: 50,
        },
      });
      setTasks(response.data.data.tasks || []);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to fetch tasks",
      });
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchUsersIfAdmin = async () => {
    if (!isAdmin) return;
    try {
      const response = await apiClient.get("/admin/users", {
        params: { page: 1, limit: 10 },
      });
      setUsers(response.data.data.users || []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsersIfAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const resetForm = () => {
    setEditingTaskId(null);
    setFormData(initialTaskForm);
  };

  const onInputChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onTaskSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    setSubmitting(true);

    const payload = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };

    try {
      if (editingTaskId) {
        const response = await apiClient.patch(`/tasks/${editingTaskId}`, payload);
        setMessage({ type: "success", text: response.data.message || "Task updated" });
      } else {
        const response = await apiClient.post("/tasks", payload);
        setMessage({ type: "success", text: response.data.message || "Task created" });
      }

      resetForm();
      await fetchTasks();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Task request failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  };

  const onDelete = async (taskId) => {
    setMessage({ type: "", text: "" });
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`);
      setMessage({ type: "success", text: response.data.message || "Task deleted" });
      await fetchTasks();
      if (editingTaskId === taskId) {
        resetForm();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to delete task",
      });
    }
  };

  return (
    <section className="dashboard-grid">
      <article className="card">
        <h2>{editingTaskId ? "Edit Task" : "Create Task"}</h2>
        <p className="muted">Send authenticated CRUD requests directly from this UI.</p>
        <MessageBanner type={message.type} message={message.text} />

        <form onSubmit={onTaskSubmit} className="form-grid">
          <label htmlFor="title">
            Title
            <input
              id="title"
              name="title"
              type="text"
              minLength={2}
              maxLength={120}
              required
              value={formData.title}
              onChange={onInputChange}
            />
          </label>

          <label htmlFor="description">
            Description
            <textarea
              id="description"
              name="description"
              rows="3"
              maxLength={1000}
              value={formData.description}
              onChange={onInputChange}
            />
          </label>

          <div className="split">
            <label htmlFor="status">
              Status
              <select id="status" name="status" value={formData.status} onChange={onInputChange}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>

            <label htmlFor="dueDate">
              Due Date
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={onInputChange}
              />
            </label>
          </div>

          <div className="button-row">
            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : editingTaskId ? "Update Task" : "Create Task"}
            </button>
            {editingTaskId && (
              <button type="button" className="ghost" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </article>

      <article className="card">
        <h2>Task List</h2>
        <p className="muted">
          {isAdmin ? "Admin can view all users' tasks." : "You can only view your own tasks."}
        </p>
        {loadingTasks ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description"}</p>
                  <small>
                    {task.status.toUpperCase()}
                    {task.dueDate ? ` | Due: ${task.dueDate.slice(0, 10)}` : ""}
                  </small>
                </div>
                <div className="task-actions">
                  <button type="button" className="ghost" onClick={() => onEdit(task)}>
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => onDelete(task._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>

      {isAdmin && (
        <article className="card full-width">
          <h2>Admin: Latest Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul className="user-list">
              {users.map((item) => (
                <li key={item._id}>
                  <span>{item.name}</span>
                  <small>
                    {item.email} ({item.role})
                  </small>
                </li>
              ))}
            </ul>
          )}
        </article>
      )}
    </section>
  );
}

export default DashboardPage;
