import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const CreateTasks = ({ tasks = [], setTasks, editingTask, setEditingTask }) => {
  const [task, setTask] = useState({
    id: "",
    name: "",
    status: "todo",
    time: new Date().toLocaleString(), // Capture the creation time
  });

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (task.name.length < 3) {
      toast.error("A task must have at least 3 characters");
      return;
    }

    if (editingTask) {
      setTasks((prev) => {
        const updatedTasks = prev.map((t) =>
          t.id === task.id ? { ...task } : t
        );
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });
      toast.success("Task updated");
      setEditingTask(null);
    } else {
      setTasks((prev) => {
        const list = [...(prev || []), { ...task, id: uuidv4() }];
        localStorage.setItem("tasks", JSON.stringify(list));
        return list;
      });
      toast.success("Task created");
    }

    setTask({
      id: "",
      name: "",
      status: "todo",
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="border-2 border-slate-400 rounded-md mr-4 h-12 w-64 px-1"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
        />
        <button className="bg-cyan-500 rounded-md px-4 h-12 text-white">
          {editingTask ? "Edit" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateTasks;
