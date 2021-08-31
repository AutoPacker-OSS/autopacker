import {useOktaAuth} from "@okta/okta-react";

interface ProblemDetail {
    type: string;
    title: string;
    status: number;
    detail?: string
    instance?: string;
    /**
     * errors are populated BadRequest responses
     */
    errors?: ProblemDetailErrorsExtension
}

interface ProblemDetailErrorsExtension {
    [x: string]: string[]
}

interface GetOptions {
    headers?: any
    queryParams?: QueryParams
}

export interface QueryParams {
    [x: string]: string | boolean | number | Date | null | undefined
}

export class ProblemDetailError extends Error implements ProblemDetail{
    type: string;
    title: string;
    status: number;
    detail?: string;
    instance?: string;
    errors?: ProblemDetailErrorsExtension;

    constructor(problemDetail: ProblemDetail) {
        super(problemDetail.title); // 'Error' breaks prototype chain here
        this.name = 'ProblemDetailError';
        this.type = problemDetail.type;
        this.title = problemDetail.title;
        this.status = problemDetail.status;
        this.detail = problemDetail.detail;
        this.instance = problemDetail.instance;
        this.errors = problemDetail.errors;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

export const useApi = () => {
    const { authState } = useOktaAuth();
    const baseApiUrl = process.env.REACT_APP_API_BASE_URL;

    const handleErrors = async (res: Response) => {
        const json = async () => {
            try{
                return await res.json();
            }catch(error) {
                return null;
            }
        }

        if (!res.ok) {
            const errorObject = await json();
            if(errorObject && errorObject.type && errorObject.title && errorObject.status) {
                throw new ProblemDetailError(errorObject);
            } else {
                throw new Error(JSON.stringify(res));
            }
        }
        return await json();
    }

    const getUrl = (route: string, queryParams?: QueryParams): string => {
        const baseurl = baseApiUrl + (route.startsWith("/") ? route : "/".concat(route));
        if(queryParams != null) {
            const queryString = Object.keys(queryParams)
                .filter(x => x && queryParams[x] != null)
                .map(x => {
                    const val = queryParams[x];
                    return val != null
                        ? `${x}=${encodeURIComponent(val instanceof Date ? val.toISOString() : val.toString())}`
                        : null;
                })
                .join("&");
            return queryString.length > 0
                ? `${baseurl}?${queryString}`
                : baseurl;
        } else {
            return baseurl;
        }
    }

    const getHeaders = (optionalHeaders = {}) => {
        return {
            ...optionalHeaders,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${authState?.accessToken?.accessToken}`
        }
    }

    const get = async<T> (route: string, options?: GetOptions) : Promise<T> => {
        const url = getUrl(route, options?.queryParams)

        return await fetch(url, { headers: getHeaders(options?.headers)})
            .then(handleErrors)
            .then((data : T) => { return data;})
            .catch(error  => {
                console.error(error);
                throw  error;
            });
    }

    const post = async <TBody, TResponse>(route: string, body: TBody, optionalHeaders = {}, queryParams?: QueryParams): Promise<TResponse> => {
        const url = getUrl(route, queryParams)
        const postParams = {
            method: 'POST',
            headers: getHeaders({
                ...optionalHeaders,
            }),
            body: JSON.stringify(body)
        }
        return await fetch(url, postParams)
            .then(handleErrors)
            .then((data: TResponse) => {
                return data;
            }).catch(error => {
                console.error(error)
                throw error;
            })
    }

    const put = async <T>(route: string, body: T, optionalHeaders = {}) => {
        const url = getUrl(route)
        const postParams = {
            method: 'PUT',
            headers: getHeaders({
                ...optionalHeaders
            }),
            body: JSON.stringify(body)
        }
        return await fetch(url, postParams)
            .then(handleErrors)
            .then(data => {
                return data;
            }).catch(error => {
                console.error(error);
                throw error;
            })
    }

    const _delete = async<T> (route: string, body?: T, optionalHeaders = {}) : Promise<T> => {
        const url = getUrl(route)
        const deleteParams = {
            method: 'DELETE',
            headers: getHeaders({
                ...optionalHeaders
            }),
            body: JSON.stringify(body)
        }
        return await fetch(url, deleteParams)
            .then(handleErrors)
            .then(data => {
                return data;
            }).catch(error => {
                console.error(error);
                throw error;
            })
    }

    return {
        get,
        post,
        put,
        _delete
    }
}
