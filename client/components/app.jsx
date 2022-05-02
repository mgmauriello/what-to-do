import React from 'react';
import PageTitle from './page-title';
import TodoList from './todo-list';
import TodoForm from './todo-form';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: []
    };
    this.addTodo = this.addTodo.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
  }

  componentDidMount() {
    fetch('/api/todos')
      .then(res => res.json())
      .then(todos => this.setState({ todos }))
      .catch(err => console.error('Fetch failed!', err));
  }

  addTodo(newTodo) {
    const todoRequest = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    };

    fetch('/api/todos', todoRequest)
      .then(res => res.json())
      .then(newTodo => this.setState({
        todos: this.state.todos.concat(newTodo)
      }))
      .catch(err => console.error('Fetch failed!', err));

  }

  toggleCompleted(todoId) {
    const todo = this.state.todos.find(todo => todo.todoId === todoId);
    const todoIndex = this.state.todos.indexOf(todo);
    const updatedTodo = {
      isCompleted: !todo.isCompleted
    };

    const todoRequest = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo)
    };

    fetch(`/api/todos/${todoId}`, todoRequest)
      .then(res => res.json())
      .then(updatedTodo => {
        const copiedTodo = this.state.todos.slice();
        copiedTodo[todoIndex] = updatedTodo;
        this.setState({ todos: copiedTodo });
      })
      .catch(err => console.error('Fetch failed!', err));

  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col pt-5">
            <PageTitle text="Todo App"/>
            <TodoForm onSubmit={this.addTodo}/>
            <TodoList todos={this.state.todos} toggleCompleted={this.toggleCompleted}/>
          </div>
        </div>
      </div>
    );
  }
}
