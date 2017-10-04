export class NetworkRequest {

    constructor (response, cancelToken) {
        this.response = response;
        this.cancelToken = cancelToken;
    }

    then (done) {
        return this.response.then((response) => {
            return done(response.data);
        }).catch((resp) => { 
            if (resp.response) {
                let data = resp.response.data;
                let status = resp.response.status;
                return Promise.reject({ data, status });
            } else {
                return Promise.reject(resp);
            }
        });
    }

    abort () {
        this.cancelToken.cancel('abort');
    }
}

export function processResponse(response, cancelToken) {
    return new NetworkRequest(response, cancelToken);
}
