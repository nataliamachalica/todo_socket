import React from 'react';
import io from 'socket.io-client';

import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io.connect('http://localhost:6000/', {
      transports: ['websocket'],
    });

    this.socket.on('addTask', event => this.addTask(event));
    this.socket.on('removeTask', event => this.removeTask(event));
    this.socket.on('updateData', event => this.updateTasks(event));
  }

  updateTasks = newTasks => {
    this.setState({ tasks: newTasks });
  }

    addTask = task => {

      let newTasks = this.state.tasks;

      const repeatedTask = newTasks.find(newTask => newTask.name === task.name);

      if(!task.name || !task.name.trim()) {
        alert('type something');
      } else if (repeatedTask) {
        alert('task already on list');
      } else {
        newTasks.push(task);
        this.setState({ tasks: newTasks })
      }
    }

  removeTask = (taskId, localRemoval) => {
    let newTasks = this.state.tasks;
    newTasks = newTasks.filter(task => task.id !== taskId);
    this.setState({ tasks: newTasks });
    if(localRemoval) this.socket.emit('removeTask', taskId);
  }

  submitForm = event => {
    event.preventDefault();

    const newTask = {
      id: uuidv4(),
      name: this.state.taskName,
    }
    this.addTask(newTask);

    this.socket.emit('addTask', newTask)
    this.setState({ taskName: '' });
  }

  render() {

    const { tasks, taskName } = this.state;

    return (
      <div className="App">

        <header>
          <h1>to do list.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
          <ul className="tasks-list" id="tasks-list">
            {tasks.map(task => (
              <li className="task" key={task.id}>
                {task.name}
                <button
                className="btn btn-red"
                onClick={localRemoval => this.removeTask(task.id, localRemoval)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form"
          onSubmit={event => this.submitForm(event)}
            >
            <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={event => this.setState({ taskName: event.target.value })}
            />
            <button className="btn" type="submit">Add</button>
          </form>
        </section>
      </div>
    )
  }

}

export default App;