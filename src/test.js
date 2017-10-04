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
