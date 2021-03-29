// Variables
const form = document.querySelector('#form')
const subject = document.querySelector('#subject')
const task = document.querySelector('#task')
const list = document.querySelector('#lista')
const completedList = document.querySelector('#completedTasks')
const globalTasks = []
// Functiones
const addTask = () => {
  const newTask = task.value;
  const newSubject = subject.value;

  if (!validTask(newTask, newSubject)) {
    alert('Tarea repetida o valores inválidos');
    return;
  }

  pushTask({ subject: newSubject, task: newTask, completed: false });

}

const pushTask = (taskL) => {
  globalTasks.push(taskL);
  task.value = ''
  subject.value = ''
  // console.log(globalTasks)
  showToast("Tarea añadida, ¡A trabajar! ;)", false);
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

const showTasks = () => {
  let html = ''
  let completedHtml = ''
  globalTasks.forEach((task, id) => {
    if (task) {
      // console.log(task, id)
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
  return `<tr id = task${id}>
    <td>
      ${task.subject}
    </td>
    <td>
      ${task.task}
    </td>
    <td>
      <span onclick="setTaskStatus(${id}, true, true)">
        <i class="material-icons green-text">
        done
        </i>
      </span>
      &nbsp;&nbsp;&nbsp;
      <span onclick="deleteTask(${id})">
        <i class="material-icons red-text">
          delete
        </i>
      </span>
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
    <span onclick="setTaskStatus(${id}, false, true)">
      <i class="material-icons blue-text">
        repeat
      </i>
    </span>
    &nbsp;&nbsp;&nbsp;
    <span onclick="deleteTask(${id})">
      <i class="material-icons red-text">
        delete
      </i>
    </span>
  </td>
</tr>`;
}

const deleteTask = (id) => {
  // console.log(id)
  // console.log(globalTasks)
  // globalTasks.splice(id, 1)
  const del = confirm(`¿Desea eliminar ${globalTasks[id].subject} : ${globalTasks[id].task}?`)

  if (del) {
    delete globalTasks[id]
    // console.log(globalTasks)
    updateLocalStorage()
    showToast("Tarea eliminada", false);
    showTasks()
  }

}

const setTaskStatus = (id, status, toast = false) => {
  let task = globalTasks[id];
  if (task) task.completed = status;

  updateLocalStorage();
  showTasks();

  if (toast) {
    if (status) {
      showToast("Tarea completada, ¡Sigue así! ;)", true, id, !status)

    }
    else {
      showToast("De vuelta a la acción. ;)", true, id, !status)
    }
  }

}

const showToast = (msg, undo, id = -1, status = false) => {
  const onclick = id >= 0 ? `onclick ="setTaskStatus(${id}, ${status}, false)"` : '';
  const buttonUndo = undo ? `<button class="btn-flat toast-action" ${onclick}>Deshacer</button>` : '';

  const htmlToast = `<span>${msg}</span>${buttonUndo}`;
  M.toast({ html: htmlToast });
}

//Local storage
const updateLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(globalTasks))
}

const getLocalStorage = () => {
  const tasksStr = localStorage.getItem('tasks')
  if (tasksStr && tasksStr.length > 0) {
    const tareasLocal = JSON.parse(tasksStr)
    tareasLocal.forEach(task => {
      if (task) globalTasks.push(task)
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
  var instances = M.Collapsible.init(elems, { accordion: false });

  var elems = document.querySelectorAll('.tooltipped');
  var instances = M.Tooltip.init(elems, {});
  // console.log(instances)
})

const exampleTasks = () => {
  const task1 = {
    subject: 'Cocina',
    task: 'Preparar comida de la semana',
    completed: false
  }
  const task2 =
  {
    subject: 'Escuela',
    task: 'Leer reportes de Español',
    completed: false
  }
  const task3 =
  {
    subject: 'Cuarto',
    task: 'Escombrar ropero',
    completed: true
  }

  globalTasks.push(task1)
  globalTasks.push(task2)
  globalTasks.push(task3)

}

window.onload = function () {
  if (localStorage.getItem("hasCodeRunBefore") === null) {
    exampleTasks();
    localStorage.setItem("hasCodeRunBefore", true);
  }
}
