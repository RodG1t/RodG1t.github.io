// Variables
const form = document.querySelector('#form')
const subject = document.querySelector('#subject')
const task = document.querySelector('#task')
const list = document.querySelector('#lista')
const completedList = document.querySelector('#completedTasks')
const tasks = []

// Functiones
const addTask = () => {
  const newTask = task.value;
  const newSubject = subject.value;

  if (!validTask(newTask, newSubject)) {
    alert('Tarea repetida o valores inválidos');
    return;
  }

  tasks.push({ task: newTask, subject: newSubject, completed: false });
  task.value = ''
  subject.value = ''
}

const validTask = (task, subject) => {
  if (!task || !task.length > 0) return false;
  if (!subject || !task.length > 0) return false;
  if (existsTask(task, subject)) return false;
  return true;
}

const existsTask = (task, subject) => {
  return tasks.some(x => {
    return x.task === task && x.subject === subject
  });
}

const updateLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

const showTasks = () => {
  let html = ''
  let completedHtml = ''
  tasks.forEach((task, id) => {
    if(task.completed) 
      completedHtml += getRawCompleted(id, task);
    else
      html = html + getRawTask(id, task)
  })
  list.innerHTML = html;
  completedList.innerHTML = completedHtml;
}

const getRawTask = (id, task) => {
  return `<tr id = task${id}>
    <td>
      ${task.subject}
    </td>
    <td>
      ${task.task}
    </td>
    <td>
      <span onclick="setTaskStatus(${id}, true)">✔️</  span>
      <span onclick="deleteTask(${id})">❌</span>
    </td>
  </tr>`;
}

const getRawCompleted = (id, task) => {
  return `<tr id = task${id}>
  <td>
    ${task.subject}
  </td>
  <td>
    ${task.task}
  </td>
  <td>
    <span onclick="setTaskStatus(${id}, false)">🔁</  span>
    <span onclick="deleteTask(${id})">❌</span>
  </td>
</tr>`;
}

const deleteTask = (id) => {
  tasks.splice(id, 1)
  showTasks()
  updateLocalStorage()
}

const setTaskStatus = (id, status) => {
  let task = tasks[id];
  task.completed = status;
  showTasks();
  updateLocalStorage();
}

const getLocalStorage = () => {
  const tasksStr = localStorage.getItem('tasks')
  if (tasksStr && tasksStr.length > 0) {
    const tareasLocal = JSON.parse(tasksStr)
    tareasLocal.forEach(task => {
      tasks.push(task)
    })
  }
  showTasks()
}

// Event Listeners
form.addEventListener('submit', (event) => {
  event.preventDefault()
  addTask();
  updateLocalStorage();
  showTasks();
})

document.addEventListener('DOMContentLoaded', (event) => {
  event.preventDefault()
  getLocalStorage()
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems);
  // console.log(instances)
})
