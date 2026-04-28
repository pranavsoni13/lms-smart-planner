import React, { useEffect, useState } from "react";
import API from "../services/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiTasks, setAiTasks] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    API.get("/planner/")
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ADD TASK
  const handleAddTask = async () => {
    if (!newTask) return;

    try {
      await API.post("/tasks/", {
        task: newTask,
        date: new Date().toISOString(),
        priority: 3,
      });

      const updated = await API.get("/planner/");
      setTasks(updated.data);
      setNewTask("");
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      const updated = await API.get("/planner/");
      setTasks(updated.data);
    } catch (err) {
      console.log(err);
    }
  };

  // EDIT
  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/tasks/${id}`, {
        task: editText,
      });

      const updated = await API.get("/planner/");
      setTasks(updated.data);

      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.log(err);
    }
  };

  // AI PLAN
  const handleAIPlan = async () => {
    if (!aiInput) return;

    try {
      const subjects = aiInput.split(",");
      const res = await API.post("/ai-plan/", { subjects });
      setAiTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">

      <h1 className="text-4xl font-bold mb-6">
        🚀 Smart Study Planner
      </h1>

      <div className="mb-8 bg-white rounded-xl p-4 text-black">
  <FullCalendar
    plugins={[dayGridPlugin]}
    initialView="dayGridMonth"
    height="auto"
    events={[
      { title: "OS Revision", date: "2026-04-28" },
      { title: "DBMS Practice", date: "2026-04-29" },
    ]}
  />
</div>

      {/* AI INPUT */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter subjects (OS, DBMS, ML)"
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          className="p-2 rounded text-black w-full mb-2"
        />

        <button
          onClick={handleAIPlan}
          className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
        >
          Generate AI Plan
        </button>
      </div>

      {/* ADD TASK */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="p-2 rounded text-black w-full"
        />

        <button
          onClick={handleAddTask}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white/10 backdrop-blur-md p-4 mb-3 rounded flex justify-between items-center"
          >
            <div className="w-full mr-4">
              {editingId === task.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="p-2 rounded text-black w-full"
                />
              ) : (
                <>
                  <p className="text-lg font-semibold">{task.title}</p>
                  <p className="text-sm text-gray-300">
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "No deadline"}
                  </p>
                </>
              )}
            </div>

            {editingId === task.id ? (
              <button
                onClick={() => handleUpdate(task.id)}
                className="bg-green-500 px-3 py-1 rounded"
              >
                Save
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-500 px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* AI TASKS */}
      {aiTasks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl mb-2">🤖 AI Plan</h2>

          {aiTasks.map((t, i) => (
            <div key={i} className="bg-gray-700 p-3 mb-2 rounded">
              {t.task} (Priority {t.priority})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;