import { TaggedList } from './TaggedList';
import { arrayItem } from './utils.js';

const taggedList = new TaggedList();

function runContext (data) {
    this.exec(data);
};

export class Thread {
    constructor (options = {}) {
        this.id = null;
        this.fn = options.callback || null;
        this.interval = options.interval || 10000;
        this.runImmediately = options.runImmediately || false;
        this.tags = arrayItem(options.tags || ['__GLOBAL__']);
        this.times = 0;
    }

    tag (tags) {
        tags = arrayItem(tags);
        tags.forEach(tag => {
            if (this.tags.indexOf(tag) < 0) {
                this.tags.push(tag);
            }
        });
        return this;
    }

    interval(time) {
        this.interval = time;
        return this;
    }

    runImmediately() {
        this.runImmediately = true;
        return this;
    }

    action(action) {
        this.fn = action;
        return this;
    }

    once (data) {  
        this.times = 0;
        this.id = setTimeout(() => {
            this.fn({ data });
            this.stop();
        }, this.interval);
        taggedList.add(this.tags, this);
        return this;
    }

    run (data) {  
        this.times = 0;
        if (this.runImmediately) {
            this.exec(data);
        } else {
            this.id = setTimeout(runContext.bind(this, data), this.interval);
        }
        
        taggedList.add(this.tags, this);
        return this;
    }

    exec(data) {  
        let context = {
            next: (function (err) {
                if (!err) {
                    this.id = setTimeout(runContext.bind(this, data), this.interval);
                } else {
                    this.stop();
                }

            }).bind(this),
            times: this.times++,
            data: data
        };
        this.fn(context);
    }

    stop () {
        clearInterval(this.id);
        taggedList.deleteAll(this);
        return this;
    }

    static stopThreads (tags) {
        if (!tags) {
            tags = taggedList.keys();
        } else {
            tags = arrayItem(tags);
        }
    
        tags.forEach(tag => {
            let list = taggedList.get(tag);
            if (list) {
                list.forEach(thread => {
                    clearTimeout(thread.id);
                });
                taggedList.deleteKey(tag);
            }
        });
    }
}
 
