import { arrayItem } from './utils.js';

export class TaggedList {
    constructor () {
        this.map = {};
    }

    add (tags, value) {
        tags = arrayItem(tags);
        tags.forEach(tag => {
            if (!this.map[tag]) {
                this.map[tag] = [];
            }
            this.map[tag].push(value);
        });
    }

    deleteKey (tag) {
        this.map[tag] = undefined;
    }

    _delete (tag, value) {
        if (!this.map[tag]) {
            return;
        }
        let i = this.map[tag].indexOf(value);
        if (i !== -1) {
            this.map[tag].splice(i, 1);
        }
    }

    delete (tags, value) {
        tags = arrayItem(tags); 
        tags.forEach(tag => this._delete(tag, value)); 
    }

    deleteAll (value) {
        this.delete(this.keys(), value);
    }

    get (tag) {
        return this.map[tag];
    }

    forEach(tag, callback) {
        if (!this.map[tag]) {
            return;
        }
        this.get(tag).forEach(callback);
    }

    keys () {
        let temp = [];
        for (let i in this.map) {
            if (this.map[i] && this.map[i].length > 0) {
                temp.push(i);
            }
        }
        return temp;
    }
} 

