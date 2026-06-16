import React, { useCallback, useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import API from "../services/api";

const priorityMeta = {
  3: { label: "High", className: "priority-high" },
  2: { label: "Medium", className: "priority-medium" },
  1: { label: "Low", className: "priority-low" },
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", deadline: "", priority: 2 });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiTasks, setAiTasks] = useState([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      const { data } = await API.get("/tasks/");
      setTasks(data);
      setNotice("");
    } catch {
      setNotice("We couldn't load your tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "completed").length;
    const upcoming = tasks.filter(
      (task) => task.status !== "completed" && task.deadline && new Date(task.deadline) >= new Date()
    ).length;
    return { completed, upcoming, progress: tasks.length ? Math.round((completed / tasks.length) * 100) : 0 };
  }, [tasks]);

  const calendarEvents = tasks
    .filter((task) => task.deadline)
    .map((task) => ({
      id: String(task.id),
      title: task.title,
      date: task.deadline.split("T")[0],
      className: task.status === "completed" ? "event-complete" : `event-priority-${task.priority}`,
    }));

  const handleAddTask = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.deadline) return;
    try {
      await API.post("/tasks/", {
        title: form.title.trim(),
        deadline: new Date(`${form.deadline}T12:00:00`).toISOString(),
        priority: Number(form.priority),
      });
      setForm({ title: "", deadline: "", priority: 2 });
      await loadTasks();
    } catch {
      setNotice("Task could not be created. Check the details and try again.");
    }
  };

  const handleDelete = async (id) => {
    await API.delete(`/tasks/${id}`);
    loadTasks();
  };

  const handleToggleStatus = async (id) => {
    await API.put(`/tasks/${id}/toggle`);
    loadTasks();
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) return;
    await API.put(`/tasks/${id}`, { title: editText.trim() });
    setEditingId(null);
    setEditText("");
    loadTasks();
  };

  const handleAIPlan = async (event) => {
    event.preventDefault();
    const subjects = aiInput.split(",").map((subject) => subject.trim()).filter(Boolean);
    if (!subjects.length) return;
    const { data } = await API.post("/tasks/ai-plan/", { subjects });
    setAiTasks(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">S</span><span>StudyFlow</span></div>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="active" href="#overview">▦ <span>Overview</span></a>
          <a href="#tasks">✓ <span>My tasks</span></a>
          <a href="#calendar">□ <span>Calendar</span></a>
          <a href="#focus">✦ <span>AI planner</span></a>
        </nav>
        <div className="sidebar-tip">
          <span>✦</span>
          <strong>Stay consistent</strong>
          <p>Small progress every day adds up to big results.</p>
        </div>
        <button className="logout-button" onClick={logout}>↪ <span>Sign out</span></button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header" id="overview">
          <div>
            <p className="eyebrow">Monday · Your study workspace</p>
            <h1>Ready to make progress?</h1>
            <p>Plan your priorities, stay focused, and finish the week strong.</p>
          </div>
          <div className="profile-pill"><span className="avatar">ST</span><span><strong>Student</strong><small>Learning mode</small></span></div>
        </header>

        {notice && <div className="notice" role="alert">{notice}</div>}

        <section className="stat-grid" aria-label="Study summary">
          <article className="stat-card accent-purple"><span className="stat-icon">✓</span><div><p>Completed</p><strong>{stats.completed}</strong><small>of {tasks.length} total tasks</small></div></article>
          <article className="stat-card accent-coral"><span className="stat-icon">⌁</span><div><p>Coming up</p><strong>{stats.upcoming}</strong><small>active deadlines</small></div></article>
          <article className="stat-card accent-green"><span className="stat-icon">↗</span><div><p>Overall progress</p><strong>{stats.progress}%</strong><div className="progress-track"><span style={{ width: `${stats.progress}%` }} /></div></div></article>
        </section>

        <section className="dashboard-grid">
          <div className="content-stack">
            <article className="panel" id="tasks">
              <div className="panel-heading"><div><span className="section-label">Today’s focus</span><h2>Your task list</h2></div><span className="count-badge">{tasks.length} tasks</span></div>
              <form className="task-form" onSubmit={handleAddTask}>
                <input aria-label="Task title" placeholder="What do you need to finish?" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input aria-label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                <select aria-label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="3">High</option><option value="2">Medium</option><option value="1">Low</option>
                </select>
                <button className="primary-button" type="submit">＋ Add task</button>
              </form>
              <div className="task-list">
                {loading ? <div className="empty-state">Loading your plan…</div> : tasks.length === 0 ? <div className="empty-state"><span>✓</span><strong>Your slate is clear</strong><p>Add your first task above to get started.</p></div> : tasks.map((task) => {
                  const priority = priorityMeta[task.priority] || priorityMeta[1];
                  return (
                    <div className={`task-row ${task.status === "completed" ? "is-complete" : ""}`} key={task.id}>
                      <button className="check-button" aria-label={`Mark ${task.title} ${task.status === "completed" ? "incomplete" : "complete"}`} onClick={() => handleToggleStatus(task.id)}>{task.status === "completed" ? "✓" : ""}</button>
                      <div className="task-content">
                        {editingId === task.id ? <input autoFocus value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleUpdate(task.id)} /> : <strong>{task.title}</strong>}
                        <span>{task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "No deadline"}</span>
                      </div>
                      <span className={`priority-pill ${priority.className}`}>{priority.label}</span>
                      <div className="task-actions">
                        {editingId === task.id ? <button onClick={() => handleUpdate(task.id)}>Save</button> : <button onClick={() => { setEditingId(task.id); setEditText(task.title); }}>Edit</button>}
                        <button className="delete-action" onClick={() => handleDelete(task.id)}>Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="panel ai-panel" id="focus">
              <div className="ai-copy"><span className="sparkle">✦</span><div><span className="section-label">Smart suggestions</span><h2>Build a focused study plan</h2><p>Add subjects separated by commas and get an instant priority plan.</p></div></div>
              <form className="ai-form" onSubmit={handleAIPlan}><input placeholder="e.g. Algorithms, Physics, Design" value={aiInput} onChange={(e) => setAiInput(e.target.value)} /><button className="primary-button" type="submit">Generate plan</button></form>
              {aiTasks.length > 0 && <div className="ai-results">{aiTasks.map((task) => <span key={task.task}>{task.task}<b>Priority {task.priority}</b></span>)}</div>}
            </article>
          </div>

          <article className="panel calendar-panel" id="calendar">
            <div className="panel-heading"><div><span className="section-label">Schedule</span><h2>Deadline calendar</h2></div></div>
            <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" headerToolbar={{ left: "prev", center: "title", right: "today next" }} height="auto" dayMaxEvents events={calendarEvents} />
          </article>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
