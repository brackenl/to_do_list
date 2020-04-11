import format from 'date-fns/format';
import { } from './view';


/* Track which Project is selected */

let projectTracker = '';

/* List projects */
const projectsArr = ['All', 'Work', 'Personal'];

function listProjects () {
    
    const projectsContainer = document.querySelector('.projects-container');
    for (let i = 0; i < projectsArr.length; i++) {

        projectsContainer.insertAdjacentHTML('beforeend', `<div class="project"><a href="#">${projectsArr[i]}</a></div>`)
    }
}

/* To Do factory */

const toDoArr = [];
let nextid = -1;

function ToDoFactory (description, dueDate, priority, project = '') {

    nextid++;
    return {
        id: nextid,
        description,
        dueDate,
        priority,
        project
    }
}

/* Generate example To Dos */

const item1 = ToDoFactory('Learn how to code the app and code it', '2017-01-01', 'High');
const item2 = ToDoFactory('Go for a run', '2020-12-31', 'Low');
const item3 = ToDoFactory('Here is a reeeeeeeeeeeeaaaaaaaaaaaaaaaaalllllllllly long description to test what happens with a really really long description', '2020-12-31', 'Medium');
const item4 = ToDoFactory('Learn how to code the app and code it', '2017-01-01', 'High');
const item5 = ToDoFactory('Get a promotion', '2020-12-31', 'High', 'Work');

toDoArr.push(item1, item2, item3, item4, item5);

/* Generate list of To Dos */

function listToDos () {
    const toDosContainer = document.querySelector('.todo-container');
    let listOfToDos;

    if (projectTracker === '') {
        listOfToDos = toDoArr;
    } else {
        listOfToDos = toDoArr.filter(element => element.project === projectTracker);
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

/* Add new To Do */

function generateToDo (event) {
    event.preventDefault();

    const description = document.getElementById('todo-desc').value;
    const priority = document.getElementById('selectbasic').value;
    const dateFromForm = document.getElementById('due-date').value;
    const dueDate = format(new Date(dateFromForm), 'd MMMM yyyy');
    const project = projectTracker;

    const newToDo = ToDoFactory(description, dueDate, priority, project);
    toDoArr.push(newToDo);
    
    resetAll();
}

/* Update To Do */

function updateToDo (event) {
    event.preventDefault();

    const description = document.getElementById('update-todo-desc').value;
    const priority = document.getElementById('update-todo-priority').value;
    const dateFromForm = document.getElementById('update-due-date').value;
    const dueDate = format(new Date(dateFromForm), 'd MMMM yyyy');
    const project = projectTracker;

    const updatedToDo = ToDoFactory(description, dueDate, priority, project);
    const prevToDoIndex = toDoArr.findIndex(element => element.id == event.target.className);

    toDoArr.splice(prevToDoIndex, 1, updatedToDo);

    clearUpdatePanel();
    toggleUpdateVisibility();
    resetAll();
    
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

/* Delete To Do */

function deleteToDo (event) {
    event.preventDefault();

    const prevToDoIndex = toDoArr.findIndex(element => element.id == event.target.className);

    toDoArr.splice(prevToDoIndex, 1);

    clearUpdatePanel();
    toggleUpdateVisibility();
    resetAll();
}

/* Expand Description */

function expandToDo (event) {
    const updatePanel = document.querySelector('.expanded-description');
    const relIndex = toDoArr.findIndex(element => element.id == event.target.id)
    const relToDo = toDoArr[relIndex];
    console.log(relToDo);
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

/* Add new Project */

function generateProject (event) {
    event.preventDefault()
    const newProject = document.getElementById('textinput').value;
    projectsArr.push(newProject);
    resetAll();
}

/* Update Project Tracker */

function updateProjectTracker (event) {
    if (event.target.innerHTML === 'All') {
        projectTracker = '';
    } else {
        projectTracker = event.target.innerHTML;
    }

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
    clearTable();
    listProjects();
    listToDos();
    addListeners();
}


resetAll();