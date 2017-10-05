import { Network } from './Network'
import { TagApi } from './TagApi'
import { TaggedList } from './TaggedList'

let tags = new TaggedList();
let net = new Network('http://localhost');
let api = new TagApi(net, tags);

let request = api.tag('queso').get('/').then(() => {
    console.log('bien');
}).catch((error) => {
    console.log('nunca', error);
});
let request2 = api.tag('vaca').get('/').then(() => {
    console.log('nunca');
}).catch((error) => {
    console.log('llego con abort', error);
});

api.abort(true);

console.log(tags.keys());


import { Thread } from './Thread.js';

function callback (context) {
    console.log('UNO', context.times); 

    if (context.times === 0) {
        let r = new Thread({
            interval: 1000
        }).action(callback2).run(77);
        context.register(r);
    }
    if (context.times > 5) {
        context.next(false);
    } else {
        context.next();
    }

    
}

function callback2 (context) {
    console.log('DOS', context.times); 
    context.next();
}


let t = new Thread({
    interval: 2000
}).action(callback).run(10);