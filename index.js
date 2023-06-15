const { performance } = require('node:perf_hooks');

// Генерация большого массива
const generateArray = () => {
    const arr = []
    for (let i=0; i<=10000; i++) {
        let elem;
        do {
           elem = Math.round(Math.random() * 1000000); 
        } while (arr.indexOf(elem) != -1); 
        arr.push(elem);
    }
    return arr;
}

// Создание множества set из элементов массива
const createSet = (arr) => {
    const mySet = new Set();
    for (i of arr) {
        mySet.add(i);
    }
    return mySet;
}

const myArr = generateArray();
const mySet = createSet(myArr);

// Создание уникального элемента для дальнейшего добавления, поиска и удаления
let myElem;
do {
    myElem = Math.round(Math.random() * 1000000); 
} while (myArr.indexOf(myElem) != -1); 

// Добавление
performance.mark('Add to array start');
myArr.push(myElem);
performance.mark('Add to array end');

performance.mark('Add to set start');
mySet.add(myElem);
performance.mark('Add to set end');

// Поиск
performance.mark('Search in array start');
const index = myArr.indexOf(myElem);
performance.mark('Search in array end');

performance.mark('Search in set start');
mySet.has(myElem);
performance.mark('Search in set end');

// Удаление
performance.mark('Remove from array start');
myArr.splice(index, 1);
performance.mark('Remove from array end');

performance.mark('Remove from set start');
mySet.delete(myElem);
performance.mark('Remove from set end');

const measures = [
    performance.measure('Добавление в массив', 'Add to array start', 'Add to array end'),
    performance.measure('Добавление в set   ', 'Add to set start', 'Add to set end'),
    performance.measure('Поиск в массиве    ', 'Search in array start', 'Search in array end'),
    performance.measure('Поиск в set        ', 'Search in set start', 'Search in set end'),
    performance.measure('Удаление из массива', 'Remove from array start', 'Remove from array end'),
    performance.measure('Удаление из set    ', 'Remove from set start', 'Remove from set end'),
];

for (let measure of measures) {
    console.log(`${measure.name}: ${measure.duration}`);
}
