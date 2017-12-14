let Thread = require('../dist/main.js').Thread;
 
function callback (context) {
    console.log('DOS', context.times); 

    setTimeout(context.next,3000); 
}

let t = new Thread({
    interval: 500
}).action(callback).run(10);

setTimeout(() => {
    t.abort();
}, 2000);