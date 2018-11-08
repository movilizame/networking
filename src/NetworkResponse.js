export class NetworkResponse{

    constructor (resolver, cancelToken) { 
        this.cancelToken = cancelToken;

        if (typeof resolver == 'function') {
            this.promise = new Promise(resolver);
        } else {
            this.promise = resolver;
        }    
    }

    then (done, fail) {
        let newResolver = this.promise.then(done, fail); 
        let myTempPromise = new NetworkResponse(newResolver, this.getCancelToken()); 
        return myTempPromise;
    }

    catch (fail) {
        let newResolver = this.promise.catch(fail);
        let myTempPromise = new NetworkResponse(newResolver, this.getCancelToken()); 
        return myTempPromise;
    }

    finally (action) {
        let newResolver = this.promise.finally(action);
        let myTempPromise = new NetworkResponse(newResolver, this.getCancelToken()); 
        return myTempPromise;
    }

    abort () {
        this.cancelToken.cancel('abort');
    }

    getCancelToken() {
        return this.cancelToken;
    }

    static processResponse(response, cancelToken) {  
        return new NetworkResponse((resolve, reject) => {
            response.then((response) => {
                resolve(response.data);
            }).catch((resp) => { 
                if (resp.response) {
                    let data = resp.response.data;
                    let status = resp.response.status;
                    reject({ data, status });
                } else {
                    reject();
                }
            });
        }, cancelToken);
    }
};

