import { model, checkModel, generateProject, generateToDo, updateProjectTracker, ToDoFactory } from './index';
import format from 'date-fns/format';

/* Generate list of projects */

function listProjects () {
    const model = JSON.parse(localStorage.model);
    const projectsContainer = document.querySelector('.projects-container');
    for (let i = 0; i < model.projectsArr.length; i++) {
        projectsContainer.insertAdjacentHTML('beforeend', `<div class="project"><a href="#">${model.projectsArr[i]}</a></div>`)
    }
}

/* Generate list of To Dos */

function listToDos () {
    const model = JSON.parse(localStorage.model);
    const toDosContainer = document.querySelector('.todo-container');
    let listOfToDos;

    if (model.projectTracker === '') {
        listOfToDos = model.toDoArr;
    } else {
        listOfToDos = model.toDoArr.filter(element => element.project === model.projectTracker);
    }

    for (let i = 0; i < listOfToDos.length; i++) {
    
        const descDiv = document.createElement('div');
        descDiv.innerHTML = `${listOfToDos[i].description}`;
        descDiv.id = listOfToDos[i].id;
        toDosContainer.appendChild(descDiv);
    
        const dueDiv = document.createElement('div');
        dueDiv.innerHTML = `${format(new Date(listOfToDos[i].dueDate), 'd MMMM yyyy')}`;
        toDosContainer.appendChild(dueDiv);
    
        if (listOfToDos[i].id % 2 === 0) {
            descDiv.className = 'todo desc even';
            dueDiv.className = 'todo due even';
        } else {
            descDiv.className = 'todo desc odd';
            dueDiv.className = 'todo due odd';
        }

        if (listOfToDos[i].priority === 'High') {
            dueDiv.style.backgroundColor = 'red';
        } else if (listOfToDos[i].priority === 'Medium') {
            dueDiv.style.backgroundColor = 'orange';
        } else {
            dueDiv.style.backgroundColor = 'green';
        }
    }
}

/* Add listeners */

function addListeners () {
    const newProjectSubmit = document.getElementById('project-submit');
    newProjectSubmit.addEventListener('click', generateProject);
    
    const newToDoSubmit = document.getElementById('todo-submit');
    newToDoSubmit.addEventListener('click', generateToDo);
    
    const projects = document.querySelectorAll('.project');
    for (let project of projects) {
        project.addEventListener('click', updateProjectTracker);
    }

    const descriptions = document.querySelectorAll('.desc');
    for (let desc of descriptions) {
        desc.addEventListener('click', expandToDo);
    }
}

function addUpdateListeners() {
    const updateBttn = document.getElementById('todo-update');
    const cancelBttn = document.getElementById('todo-cancel');
    const completeBttn = document.getElementById('todo-complete');
    const deleteBttn = document.getElementById('todo-delete');

    updateBttn.addEventListener('click', updateToDo);
    cancelBttn.addEventListener('click', cancelUpdate);
    completeBttn.addEventListener('click', completeToDo);
    deleteBttn.addEventListener('click', deleteToDo);
}

/* Expand Description */

function expandToDo (event) {
    const model = JSON.parse(localStorage.model);
    const updatePanel = document.querySelector('.expanded-description');
    const relIndex = model.toDoArr.findIndex(element => element.id == event.target.id)
    const relToDo = model.toDoArr[relIndex];
    updatePanel.insertAdjacentHTML('beforeend', `
    <form class="update-form">
        <fieldset>
        
        <!-- Form Name -->
        <legend>Update To Do:</legend>
        
        <!-- Text input-->
        <div class="form-group">
        <input id="update-todo-desc" name="todo-desc" type="text" value="${relToDo.description}" required="">
        </div>
        
        <!-- Select Basic -->
        <div class="form-group">
            <select id="update-todo-priority" name="todo-priority" class="form-control">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
        </div>

        <!-- Date input -->
        <div class="form-group">
            <input type="date" id="update-due-date" name="due-date" value="${relToDo.dueDate}" min="2020-03-24">
        </div>
        <div class="button-group">
            <input type="submit" value="Update" class=${relToDo.id} id="todo-update">
            <input type="submit" value="Cancel" class=${relToDo.id} id="todo-cancel">   
            <input type="submit" value="Complete" class=${relToDo.id} id="todo-complete"> 
            <input type="submit" value="Delete" class=${relToDo.id} id="todo-delete">      
        </div>            
        
        </fieldset>
    </form>`);

    toggleUpdateVisibility();
    addUpdateListeners();
}

/* Toggle Update panel visibility */

function toggleUpdateVisibility () {
    const updatePanel = document.querySelector('.expanded-description');

    if (updatePanel.style.display === 'none') {
        updatePanel.style.display = 'block'
    } else {
        updatePanel.style.display = 'none';
    }
}

/* Cancel update */

function cancelUpdate (event) {
    event.preventDefault();

    clearUpdatePanel();
    toggleUpdateVisibility();
}

/* Complete To Do */

function completeToDo (event) {
    event.preventDefault();

    const relItem = document.getElementById(event.target.className);
    console.log(relItem);

    relItem.style.textDecoration = "line-through";
    relItem.nextElementSibling.style.textDecoration = "line-through";

    clearUpdatePanel();
    toggleUpdateVisibility();
}

/* Update To Do */

function updateToDo (event) {
    event.preventDefault();
    const model =JSON.parse(localStorage.model);

    const description = document.getElementById('update-todo-desc').value;
    const priority = document.getElementById('update-todo-priority').value;
    const dateFromForm = document.getElementById('update-due-date').value;
    const dueDate = format(new Date(dateFromForm), 'd MMMM yyyy');
    const project = model.projectTracker;

    const updatedToDo = ToDoFactory(description, dueDate, priority, project);
    const prevToDoIndex = model.toDoArr.findIndex(element => element.id == event.target.className);

    model.toDoArr.splice(prevToDoIndex, 1, updatedToDo);

    localStorage.model = JSON.stringify(model);

    clearUpdatePanel();
    toggleUpdateVisibility();
    resetAll();
    
}

/* Delete To Do */

function deleteToDo (event) {
    event.preventDefault();
    const model = JSON.parse(localStorage.model);

    const prevToDoIndex = model.toDoArr.findIndex(element => element.id == event.target.className);

    model.toDoArr.splice(prevToDoIndex, 1);

    localStorage.model = JSON.stringify(model);

    clearUpdatePanel();
    toggleUpdateVisibility();
    resetAll();
}

/* Clear Projects and To Dos */

function clearTable () {
    const projectsContainer = document.querySelector('.projects-container');
    const toDosContainer = document.querySelector('.todo-container');

    while (projectsContainer.lastChild.className !== 'head') {
        projectsContainer.removeChild(projectsContainer.lastChild);
    }

    while (toDosContainer.lastChild.className !== 'todo due head') {
        toDosContainer.removeChild(toDosContainer.lastChild);
    }
}

/* Clear update Panel */

function clearUpdatePanel() {
    const updatePanel = document.querySelector('.expanded-description');
    updatePanel.innerHTML = '';
}

/* Reset everything */

function resetAll () {
    checkModel();
    clearTable();
    listProjects();
    listToDos();
    addListeners();
}

export { listProjects, listToDos, addListeners, addUpdateListeners, resetAll };