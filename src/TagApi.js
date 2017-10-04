import { TaggedList } from './TaggedList.js';
import { arrayItem } from './utils.js';

export class TagApi {

    /**
     * Asociamos un objeto Network y opcional una TaggedList global. Sino se crea uno interno.
     * 
     * @param {Network} network 
     * @param {TaggedList} tagsMap 
     */

    constructor(network, tagsMap = null) {
        this.network = network;
        this.tagsMap = tagsMap || new TaggedList();
        this.tags = [];
    }

    tag (tags) {
        tags = arrayItem(tags); 
        this._pushMany(tags);
        return this;
    }

    get (url, params, headers) {
        let xhr = this.network.get(url, params, headers);
        this._addTags(xhr);
        return xhr;
    }

    post (url, body, headers) {
        let xhr = this.network.post(url, body, headers);
        this._addTags(xhr);
        return xhr;
    }

    put (url, body, headers) {
        let xhr = this.network.put(url, body, headers);
        this._addTags(xhr);
        return xhr;
    }

    delete (url, params, headers) {
        let xhr = this.network.delete(url, params, headers);
        this._addTags(xhr);
        return xhr;
    }

    abort(tags) {
        if (tags === true) {
            tags = this.tagsMap.keys();
        } else {
            tags = arrayItem(tags);
        }
        tags.forEach((tag) => {
            this.tagsMap.forEach(tag, (item) => {

                item.abort();

            });

            this.tagsMap.deleteKey(tag);
        });
    }
    
    _pushMany (tags) {
        tags.forEach(tag => {
            if (this.tags.indexOf(tag) < 0) {
                this.tags.push(tag);
            }
        });
    }

    _addTags (xhr) { 
        this.tagsMap.add(this.tags, xhr);
        this.tags = [];
    }


}