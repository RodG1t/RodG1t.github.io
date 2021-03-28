// Variables
const form = document.querySelector('#form')
const subject = document.querySelector('#subject')
const task = document.querySelector('#task')
const list = document.querySelector('#lista')
const completedList = document.querySelector('#completedTasks')
const globalTasks = []
// Functiones

const getHTMLToast = (msg, undo) => {
  const buttonUndo = undo ? '<button class="btn-flat toast-action">Undo</button>' :  '';

  return `<span>${msg}</span>${buttonUndo}`
}

const addTask = () => {
  const newTask = task.value;
  const newSubject = subject.value;

  if (!validTask(newTask, newSubject)) {
    alert('Tarea repetida o valores inválidos');
    return;
  }
  
  pushTask({ subject: newSubject, task: newTask, completed: false});
  
}

const pushTask = (taskL) => {
  globalTasks.push(taskL);
  task.value = ''
  subject.value = ''
  console.log(globalTasks)
  M.toast({html: getHTMLToast('¡Tarea añadida!', false)});
}

const validTask = (task, subject) => {
  if (!task || !task.length > 0) return false;
  if (!subject || !task.length > 0) return false;
  if (existsTask(task, subject)) return false;
  return true;
}

const existsTask = (task, subject) => {
  return globalTasks.some(x => {
    return x.task === task && x.subject === subject
  });
}

const updateLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(globalTasks))
}

const showTasks = () => {
  let html = ''
  let completedHtml = ''
  globalTasks.forEach((task, id) => {
    if (task) {
      console.log(task, id)
      if (task.completed) {
        completedHtml += getRawCompleted(id, task);
      }
      else {
        html += getRawTask(id, task)
      }
    }
  })
  list.innerHTML = html;
  completedList.innerHTML = completedHtml;
  
}

const getRawTask = (id, task) => {
  let status = '';
  if(task.completed) status = '✔️';

  return `<tr id = task${id}>
    <td>
      ${task.subject}
    </td>
    <td>
      ${task.task}
    </td>
    <td>
      ${task.completed}
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
  ${task.completed}
</td>
  <td>
    <span onclick="setTaskStatus(${id}, false)">🔁</  span>
    <span onclick="deleteTask(${id})">❌</span>
  </td>
</tr>`;
}

const deleteTask = (id) => {
  console.log(id)
  console.log(globalTasks)
  // globalTasks.splice(id, 1)
  delete globalTasks[id]
  console.log(globalTasks)
  updateLocalStorage()
  showTasks()
}

const setTaskStatus = (id, status) => {
  let task = globalTasks[id];
  if(task) task.completed = status;
  updateLocalStorage();
  showTasks();
}

const getLocalStorage = () => {
  const tasksStr = localStorage.getItem('tasks')
  if (tasksStr && tasksStr.length > 0) {
    const tareasLocal = JSON.parse(tasksStr)
    tareasLocal.forEach(task => {
      if(task) globalTasks.push(task)
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
  var instances = M.Collapsible.init(elems, {accordion: false});
  // console.log(instances)
})
