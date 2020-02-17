type StringObject<T = any> = { [propName: string]: T }

interface FetchOpts<T = any> {
  qs?: StringObject<T>,
  json?: StringObject<T>,
  qsStringifyIndices?: boolean,
  form?: StringObject<T>,
  method?: 'POST' | 'GET' | 'DELETE' | 'OPTION' | 'PUT',
  formData?: StringObject<T>,
  timeout?: number,
  credentials?: 'same-origin' | 'include' | 'omit',
  headers?: StringObject,
  body?: any,
  baseURL?: string
}

const encodeQueryString = (obj) => {
  const pairs = [];
  Object.keys(obj).forEach(key => (
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
  ));
  return pairs.join('&');
};

function fetchRequest(url: string, opts: FetchOpts = {}) {
    let timeout = 10000;
    let _fetchOpts: FetchOpts = {
        credentials: 'include',
        method: 'GET',
        headers: {},
    };
    if (opts.qs) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + encodeQueryString(opts.qs);
    }
    if (opts.json) {
        _fetchOpts.headers['Content-Type'] = 'application/json';
        _fetchOpts.body = JSON.stringify(opts.json);
    }
    if (opts.form) {
        _fetchOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        _fetchOpts.body = encodeQueryString(opts.form);
    }
    if (opts.method) {
        _fetchOpts.method = opts.method
    }
    if (opts.formData) {
        // _fetchOpts.headers['Content-Type'] = 'multipart/form-data';
        var form = new FormData();
        for (var key in opts.formData) {
            form.append(key, opts.formData[key]);
        }
        _fetchOpts.body = form;
    }
    if (opts.timeout !== undefined) {
        timeout = opts.timeout;
    }
    if (opts.credentials) {
        _fetchOpts.credentials = opts.credentials;
    }
    /* top level priority varibale set in the end */
    if (opts.headers) {
        Object.assign(_fetchOpts.headers, opts.headers);
    }
    if (opts.body) {
        _fetchOpts.body = opts.body;
    }
    const baseURL = opts.baseURL || '';
    return timeoutFetch(fetch(baseURL + url, _fetchOpts), timeout)
                .then(checkStatus)
                .catch(handleError);
}

/**
 * 检查接口响应状态码
 *
 * @param {Object} response fetch返回的响应对象
 * @return {Object} 状态码正常时返回响应本身，否则返回 reject 信息
 */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 ) {
        return response.json();
    } else {
        return Promise.reject(response)
    }
}

/**
 * 异常处理函数，包含错误提示
 *
 * @param {Object} e 错误信息
 */
async function handleError (e) {
    console.log(e)
    if (e !== 'timeout'){
        const responseStatus = e?.status;
        const result = await e.json();
        if (result?.code && result?.msg){
            console.error('请求错误提示', result)
            return Promise.reject(result)
        } else {
            console.error('请求错误提示', {code: responseStatus, msg: getErrorMsgByStatusCode(responseStatus)})
            return Promise.reject({code: responseStatus, msg: getErrorMsgByStatusCode(responseStatus)}) 
        }
    } else {
        console.error('请求错误提示', {code: '', msg: '网络加载失败，请检查网络设置'})
        return Promise.reject({code: '', msg: '网络加载失败，请检查网络设置'})
    }
}

/**
 * 返回状态码对应文本提示信息
 *
 * @param {number} code 响应状态码
 * @return {string} 文本提示
 */
export function getErrorMsgByStatusCode (code) {
    let result = '未知错误';
    if (code >= 400 && code < 500) {
        switch (code) {
            case 401:
                result = '您尚未登录,请登录后访问.';
                break;
            case 403:
                result = '您所请求的资源被禁止访问.';
                break;
            case 404:
                result = '您所请求的资源并不存在.';
                break;
            case 405:
                result = '非法请求被禁止.';
                break;
            default:
                result = `抱歉，程序出了问题(${code}).`;
        }
    } else if (code >= 500 && code < 600) {
        result = '服务器出错啦.';
    }
    return result;
}

function timeoutFetch(fetchPromise, timeout) {
    let abortFn = null;
    const abortPromise = new Promise(function(resolve, reject) {
        abortFn = function() {
            reject('timeout');
        };
    });
    const abortablePromise = Promise.race([
        fetchPromise,
        abortPromise
    ]);

    setTimeout(function() {
        abortFn();
    }, timeout);

    return abortablePromise;
}


export default fetchRequest;