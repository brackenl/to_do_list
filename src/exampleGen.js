import { ToDoFactory } from './index';

/* Generate example To Dos */

function exampleGen (arr) {

    const item1 = ToDoFactory('Learn how to code the app and code it', '2017-01-01', 'High');
    const item2 = ToDoFactory('Go for a run', '2020-12-31', 'Low');
    const item3 = ToDoFactory('Here is a reeeeeeeeeeeeaaaaaaaaaaaaaaaaalllllllllly long description to test what happens with a really really long description', '2020-12-31', 'Medium');
    const item4 = ToDoFactory('Learn how to code the app and code it', '2017-01-01', 'High');
    const item5 = ToDoFactory('Get a promotion', '2020-12-31', 'High', 'Work');

    arr.push(item1, item2, item3, item4, item5);
}

export { exampleGen };


