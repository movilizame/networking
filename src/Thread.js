import { TaggedList } from './TaggedList';
import { arrayItem } from './utils.js';

const taggedList = new TaggedList();

function runContext (data) {
    this.exec(data);
};

export class Thread {
    constructor (options = {}) {
        this.id = null;
        this.fn = options.action || null;
        this.interval = options.interval || 10000;
        this.runImmediately = options.runImmediately || false;
        this.tags = arrayItem(options.tags || ['__GLOBAL__']);
        this.times = 0;
        this.ajaxList = [];
        this.aborted = false;
    }

    static start(options) {
        return new Thread(options).run();
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

    runNow() {
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
            // Number un execution (if some threads must run only a determinate times)
            times: this.times++,
            // contextual params
            data: data,

            // function to prevent thread to re run
            next: (function (err) {
                if (arguments.length === 0) {
                    if (!this.aborted) {
                        this.id = setTimeout(runContext.bind(this, data), this.interval);
                    }
                } else {
                    this.abort(err == true);
                }
            }).bind(this),

            // register some abortable object to abort when thread abort
            register: (function (xhr) {
                this.ajaxList.push(xhr);
            }).bind(this),
        };
        this.fn(context);
    }

    abort (abortList = true) {
        clearTimeout(this.id);
        taggedList.deleteAll(this);
        this.aborted = true;
        if (abortList) {
            this.ajaxList.forEach((xhr) => {
                if (xhr.abort) {
                    xhr.abort();
                }
            });
        }
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
                    thread.abort();
                });
                taggedList.deleteKey(tag);
            }
        });
    }
}
 
