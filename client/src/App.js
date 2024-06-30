import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link } from 'react-router-dom';
import './App.css';

const ItemType = 'TASK';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString('en-US', options);
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Waiting':
      return { backgroundColor: '#f3aa51', color: '#000' };
    // case 'ToDo':
    //   return { backgroundColor: '#fcf695', color: '#000' };
    case 'Blocked':
      return { backgroundColor: '#db706c', color: '#fff' };
    case 'WIP':
      return { backgroundColor: '#567ace', color: '#fff' };
    case 'Done':
      return { backgroundColor: '#cee5d5', color: '#000' };
    default:
      return {};
  }
};

const EditableField = ({ text, type, onDoubleClick, onChange, onBlur }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div onDoubleClick={() => setIsEditing(true)} onBlur={() => setIsEditing(false)}>
      {isEditing ? (
        <input
          type={type}
          value={text}
          onChange={onChange}
          onBlur={onBlur}
          autoFocus
        />
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
};

const EditableDropdown = ({ options, value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div onDoubleClick={() => setIsEditing(true)} onBlur={() => setIsEditing(false)}>
      {isEditing ? (
        <select
          value={value}
          onChange={onChange}
          onBlur={() => setIsEditing(false)}
          style={{ ...getStatusStyle(value), width: '100%' }}
          autoFocus
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <span style={{ width: '100%', display: 'block', ...getStatusStyle(value) }}>{value}</span>
      )}
    </div>
  );
};

const Task = ({ task, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleFieldChange = (field, value) => {
    onEdit({ ...task, [field]: value });
  };

  return (
    <div ref={drag} className="task-card" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="task-card-content">
        <table className="task-table">
          <tbody>
            <tr>
              <td className="task-cell" colSpan="3">
                <EditableField
                  text={task.goal}
                  type="text"
                  onDoubleClick={() => { }}
                  onChange={(e) => handleFieldChange('goal', e.target.value)}
                  onBlur={() => onEdit(task)}
                />
              </td>
            </tr>
            <tr>
              <td className="task-cell" colSpan="3">
                <EditableField
                  text={task.next_action}
                  type="text"
                  onDoubleClick={() => { }}
                  onChange={(e) => handleFieldChange('next_action', e.target.value)}
                  onBlur={() => onEdit(task)}
                />
              </td>
            </tr>
            <tr>
              <td className="task-cell" style={getStatusStyle(task.status)}>
                <EditableDropdown
                  options={['ToDo', 'WIP', 'Waiting', 'Blocked', 'Done']}
                  value={task.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                />
              </td>
              <td className="task-cell">
                <EditableField
                  text={formatDate(task.deadline)}
                  type="date"
                  onDoubleClick={() => { }}
                  onChange={(e) => handleFieldChange('deadline', e.target.value)}
                  onBlur={() => onEdit(task)}
                />
              </td>
              <td className="task-cell">
                <button onClick={() => onDelete(task.id)}>Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Folder = ({ name, tasks, moveTaskToFolder, onEditTask, onDeleteTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item) => moveTaskToFolder(item.id, name),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className="folder" style={{ backgroundColor: isOver ? '#f0f0f0' : 'white' }}>
      <h2 className="folder-name">{name}</h2>
      <div className="task-list">
        {tasks.map((task) => (
          <Task key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
        ))}
      </div>
    </div>
  );
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ goal: '', next_action: '', deadline: '', folder: 'INBOX' });

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks));
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    const created_at = new Date().toISOString().slice(0, 10);
    const status = 'ToDo';
    const deadline = newTask.deadline ? newTask.deadline : new Date().toISOString().slice(0, 10);
    const taskToAdd = { ...newTask, created_at, status, deadline, folder: 'INBOX' };

    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskToAdd)
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks([...tasks, { ...taskToAdd, id: data.id }]);
        setNewTask({ goal: '', next_action: '', deadline: '' });
      });
  };

  const handleDeleteTask = (taskId) => {
    fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== taskId));
      });
  };

  const handleEditTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));

    fetch(`/api/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    });
  };

  const moveTaskToFolder = (taskId, folderName) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, folder: folderName } : task));
  };

  const folders = ['INBOX', 'PC', 'backroom', 'KWMR', 'OJT', 'OKD', 'short'];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <header className="App-header">
          <Link to="/report" className="report-button">보고 화면으로 가기</Link> {/* 버튼 추가 */}
          <h1>Tasks</h1>
          <form onSubmit={handleAddTask} className="task-form">
            <input
              type="text"
              placeholder="Goal"
              value={newTask.goal}
              onChange={(e) => setNewTask({ ...newTask, goal: e.target.value })}
              className="task-input"
            />
            <input
              type="text"
              placeholder="Next Action"
              value={newTask.next_action}
              onChange={(e) => setNewTask({ ...newTask, next_action: e.target.value })}
              className="task-input"
            />
            <input
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              className="task-input"
            />
            <button type="submit" className="task-button">Add Task</button>
          </form>
          <div className="folders">
            {folders.map(folder => (
              <Folder
                key={folder}
                name={folder}
                tasks={tasks.filter(task => task.folder === folder)}
                moveTaskToFolder={moveTaskToFolder}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </header>
      </div>
    </DndProvider>
  );
}

export default App;
