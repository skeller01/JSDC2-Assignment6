// Model

var Model = {
  tasks: [
    {
      text: 'hello',
      status: 'todo',
      id: '1234'
    },
    {
      text: 'world',
      status: 'doing',
      id: '4321'
    },
    {
      text: '!!',
      status: 'done',
      id: '9999'
    }
  ],

  getTodos: function() {
    return this.tasks.filter(function(task) {
      return task.status === 'todo';
    });
  },

  getDoings: function() {
    return this.tasks.filter(function(task) {
      return task.status === 'doing';
    });
  },

  getDones: function() {
    return this.tasks.filter(function(task) {
      return task.status === 'done';
    });
  },

  getAllTasks: function() {
    return {
      todos: this.getTodos(),
      doings: this.getDoings(),
      dones: this.getDones()
    };
  },

  addTask: function(text) {
    event.stopPropagation();
    this.tasks.push({
      text: text,
      status: 'todo',
      id: Date.now().toString().substr(-4)
    });
  },

  deleteTask: function(id) {
    this.tasks = this.tasks.filter(function(task) {
      //negate the true's and falses to fix the bug with deleting
      return !(id === task.id);
    });
  },

  moveTask: function(id, status) {
    this.tasks = this.tasks.map(function(task) {
      if (task.id === id) {
        return {
          text: task.text,
          status: status,
          id: id
        };
      }
      return task;
    })
  }
};

// View

var View = {
  template: undefined,

  init: function() {
    var source = $('#board-template').html();
    this.template = Handlebars.compile(source);
  },

  renderBoard: function() {
    
    $('#todoInput').val('');
    $('#khanban').html(this.template(Model.getAllTasks()));

  }
}

// Controller

var Controller = {
  init: function() {
    View.renderBoard();

    $('#addTaskForm').on('submit', this.handleSubmit);
    // $('#submit').on('click', this.handleSubmit);
    $('#load').on('click', this.handleLoad);
    $('#khanban').on('click', '.delete', this.handleDelete);
    $('#khanban').on('dragenter dragover', '.column', this.handleDrag);
    document.querySelector('#khanban').addEventListener('dragstart', this.handleDragStart);
    document.querySelector('#khanban').addEventListener('drop', this.handleDrop);
  },

  handleSubmit: function(event) {
    // event.stopPropagation();
    event.preventDefault();
    var value = $('#todoInput').val();
    // console.log(value);
    Model.addTask(value);
    // console.log(Model)
    View.renderBoard();

  },


  handleDelete: function() {
    var id = $(this).parent().attr('id');
    // var id = $(this).attr('id');
    Model.deleteTask(id);
    View.renderBoard();
  },

  handleDragStart: function(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
  },

  handleDrag: function(event) {
    event.preventDefault();
    event.stopPropagation();
  },

  handleDrop: function(event) {
    var column = $(event.target).closest('.column');
    if (column.length > 0) {
      var id = event.dataTransfer.getData('text');
      Model.moveTask(id, column.attr('id'));
      View.renderBoard();
    }
  },

  handleLoad: function() {
    $.ajax({
      type: 'GET',
      url: 'http:/jacobfriedmann.com:3000/todos?num=1',
      success: function(data) {
        // data.tasks.forEach(function(task) {
        //   Model.addTask(task);

        // });
        Model.addTask(data[0]["text"]);
        // console.log(data);
        //console.log(data.tasks);
        //console.log(data[tasks]);
        // data.tasks.forEach(function(task) {
        //   Model.addTask(task);
        // });
        
        // for(key in data){
        //   var value = data[key]["text"];
        //   // console.log(value);
        //   // console.log(key);
        //   Model.addTask(data[key]["text"]);
        // };
        View.renderBoard();
      }
    });
  }
};

function setup() {
  View.init();
  Controller.init();
}

$(document).ready(setup);
