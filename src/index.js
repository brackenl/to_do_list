import format from 'date-fns/format';
import { resetAll } from './view';
import { exampleGen } from './exampleGen';

/* Global Variables */

const model = {
    projectTracker: '',
    projectsArr: ['All', 'Work', 'Personal'],
    toDoArr: [],
    nextid: -1
}
console.log(model);

/* To Do Factory */

function ToDoFactory (description, dueDate, priority, project = '') {

    const model = JSON.parse(localStorage.model);
    console.log(model.nextid);
    model.nextid++;
    console.log(model.nextid);
    localStorage.model = JSON.stringify(model);

    return {
        id: model.nextid,
        description,
        dueDate,
        priority,
        project
    }
}

/* Initialise Local Storage */
function checkModel () {
    console.log(model);
    if (localStorage.model) {
        return;
    } else {
        localStorage.model = JSON.stringify(model);

        exampleGen(model.toDoArr);

        localStorage.model = JSON.stringify(model);
    }
}
console.log(model);
checkModel();
console.log(model);

/* Add new To Do */

function generateToDo (event) {
    event.preventDefault();

    const model = JSON.parse(localStorage.model);

    const description = document.getElementById('todo-desc').value;
    const priority = document.getElementById('selectbasic').value;
    const dateFromForm = document.getElementById('due-date').value;
    const dueDate = format(new Date(dateFromForm), 'd MMMM yyyy');
    const project = model.projectTracker;

    const newToDo = ToDoFactory(description, dueDate, priority, project);
    model.toDoArr.push(newToDo);
    localStorage.model = JSON.stringify(model);
    
    resetAll();
}

/* Add new Project */

function generateProject (event) {
    event.preventDefault()
    const newProject = document.getElementById('textinput').value;
    localStorage.projectsArr.push(newProject);
    resetAll();
}

/* Update Project Tracker */

function updateProjectTracker (event) {
    const model = JSON.parse(localStorage.model);
    if (event.target.innerHTML === 'All') {
        model.projectTracker = '';
    } else {
        model.projectTracker = event.target.innerHTML;
    }

    localStorage.model = JSON.stringify(model);
    resetAll();
}

resetAll();

export { model, checkModel, generateProject, generateToDo, updateProjectTracker, ToDoFactory };