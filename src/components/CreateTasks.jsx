import React, { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const CreateTasks = ({ tasks, setTasks }) => {
  const [task, setTask] = useState({
    id: "",
    name: "",
    status: "todo", //can also be inprogress or completed
  });

  console.log(task);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (task.name.length < 3) {
      toast.error("A task must have atleat 3 characters");
    }

    setTasks((prev) => {
      const list = [...prev, task];
      localStorage.setItem("tasks", JSON.stringify(list));
      return list;
    });

    toast.success("Task created");

    setTask({
      id: "",
      name: "",
      status: "todo", //can also be inprogress or completed
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="border-2 border-slate-400 rounded-md mr-4 h-12 w-64 px-1"
          value={task.value}
          onChange={(e) =>
            setTask({ ...task, id: uuidv4(), name: e.target.value })
          }
        />
        <button className="bg-cyan-500 rounded-md px-4 h-12 text-white">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateTasks;
