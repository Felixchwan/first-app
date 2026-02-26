import TaskItem from "./TaskItem";

function TaskList({ tasks, deleteTask, toggleTask }) {
  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
        />
      ))}
    </div>
  );
}

<div className="stats">
  <p>Total: {totalTasks}</p>
  <p>Completed: {completedTasks}</p>
  <p>Pending: {pendingTasks}</p>
  <p>Progress: {completionPercentage}%</p>
</div>

export default TaskList;