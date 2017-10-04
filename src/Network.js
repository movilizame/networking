/* jshint esversion: 6 */

// import TaggedList from '../classes/TaggedList';
import axios from 'axios';
import {NetworkRequest, processResponse} from './NetworkRequest.js'

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

        return processResponse(response, source);
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
        return processResponse(response, source);
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
        return processResponse(response, source);
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
        return processResponse(response, source);
    }
}

