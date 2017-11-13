/* jshint esversion: 6 */

// import TaggedList from '../classes/TaggedList';
import axios from 'axios';
import { NetworkResponse } from './NetworkResponse.js'
import { Thread } from './Thread'; 
export class Network {
    
    constructor (baseUrl) {
        this.API_URL = baseUrl;
        this.defualtHeaders = {};
    }

    setDefualtHeaders(headers) {
        this.defualtHeaders = headers;
    }

    mergeHeader (headers) { 
        Object.assign(headers, this.defualtHeaders);
        return headers;
    }

    newCancelToken () {
        let CancelToken = axios.CancelToken;
        return CancelToken.source();
    }

    get (url, params, headers = {}) {
        let source = this.newCancelToken();
        let response = axios.get(
            this.API_URL + url,
            {
                params: params,
                headers: this.mergeHeader(headers),
                cancelToken: source.token
            }
        );

        return NetworkResponse.processResponse(response, source);
    }

    post (url, body, headers = {}) {
        let source = this.newCancelToken();
        let response = axios.post(
            this.API_URL + url,
            body,
            {
                headers: this.mergeHeader(headers),
                cancelToken: source.token
            }
        );
        return NetworkResponse.processResponse(response, source);
    }

    delete (url, params, headers = {}) {
        let source = this.newCancelToken();
        let response = axios.delete(
            this.API_URL + url,
            {
                params: params,
                headers: this.mergeHeader(headers),
                cancelToken: source.token
            }
        );
        return NetworkResponse.processResponse(response, source);
    }

    put (url, body, headers = {}) {
        let source = this.newCancelToken();
        let response = axios.put(
            this.API_URL + url,
            body,
            {
                headers: this.mergeHeader(headers),
                cancelToken: source.token
            }
        );
        return NetworkResponse.processResponse(response, source);
    }

    static doItInBackground (action, { retries = 10, interval = 5000, runImmediately = true }) {
        return new Promise((resolve, reject) => {
            let threadAction = function ({ next, times, data, register }) {
                action().then((data) => {
                    resolve(data);
                }).catch((err) => {
                    if (!err) {
                        if (times < retries) {
                            next();
                        } else {
                            reject();
                        }
                    } else {
                        reject(err);
                    }
                });
            };
            let t = (new Thread({ interval, runImmediately })).action(threadAction).run();
        });
    }
}

