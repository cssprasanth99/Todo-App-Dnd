import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDrag, useDrop } from "react-dnd";

const ListTasks = ({ tasks = [], setTasks, setEditingTask }) => {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      const fTodos = tasks.filter((task) => task.status === "todo");
      const fInProgress = tasks.filter((task) => task.status === "inprogress");
      const fCompleted = tasks.filter((task) => task.status === "completed");

      setTodos(fTodos || []);
      setInProgress(fInProgress || []);
      setCompleted(fCompleted || []);
    }
  }, [tasks]);

  const statuses = ["todo", "inprogress", "completed"];

  return (
    <div className="flex flex-col gap-16 md:flex-row">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          completed={completed}
          setEditingTask={setEditingTask}
        />
      ))}
    </div>
  );
};

export default ListTasks;

const Section = ({
  status,
  tasks = [],
  setTasks,
  todos = [],
  inProgress = [],
  completed = [],
  setEditingTask,
}) => {
  let text = "Todo";
  let bg = "bg-slate-500";
  let taskToMap = todos;

  if (status === "inprogress") {
    text = "In Progress";
    bg = "bg-purple-500";
    taskToMap = inProgress;
  }

  if (status === "completed") {
    text = "Completed";
    bg = "bg-green-500";
    taskToMap = completed;
  }

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addItemToSection = (id) => {
    setTasks((prev) => {
      const mTasks = prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status: status,
            time: new Date().toLocaleString(), // Update timestamp when task is moved
          };
        }
        return t;
      });
      localStorage.setItem("tasks", JSON.stringify(mTasks));
      toast("Task status changed", { icon: "😀" });
      return mTasks;
    });
  };

  return (
    <div
      ref={drop}
      className={`w-64 rounded-md p-2 ${isOver ? "bg-slate-200" : ""}`}
    >
      <Header text={text} bg={bg} count={taskToMap.length} />
      {taskToMap.length > 0 &&
        taskToMap.map((task) => (
          <List
            key={task.id}
            tasks={tasks}
            task={task}
            setTasks={setTasks}
            setEditingTask={setEditingTask}
          />
        ))}
    </div>
  );
};

const Header = ({ text, bg, count }) => {
  return (
    <div
      className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white`}
    >
      {text}
      <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center">
        {count}
      </div>
    </div>
  );
};

const List = ({ tasks = [], task, setTasks, setEditingTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleRemove = (id) => {
    const fTasks = tasks.filter((t) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(fTasks));
    setTasks(fTasks);
    toast("Task removed", { icon: "💀" });
  };

  const handleEdit = (id) => {
    const editTodo = tasks.find((i) => i.id === id);
    setEditingTask(editTodo);
  };

  return (
    <div
      ref={drag}
      className={`relative p-4 mt-8 shadow-md rounded-md cursor-grab ${
        isDragging ? "opacity-25" : "opacity-100"
      }`}
    >
      <p>{task.name}</p>
      <p>Last updated: {task.time}</p> {/* Display the timestamp */}
      <button
        className="absolute bottom-1 right-10 text-slate-400"
        onClick={() => handleEdit(task.id)}
      >
        Edit
      </button>
      <button
        className="absolute bottom-1 right-1 text-slate-400"
        onClick={() => handleRemove(task.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
};
