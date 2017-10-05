export * from './Network';
export * from './NetworkRequest';
export * from './TagApi';
export * from './TaggedList';


import { Thread } from './Thread.js';

function callback (context) {
    console.log('Times', context.times);
    console.log('Data', context.data);
    context.next();
}


let t = new Thread({
    interval: 2000
}).action(callback).run(10);
