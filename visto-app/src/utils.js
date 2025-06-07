let API_HOST = 'http://localhost:8009';

if (API_HOST.endsWith('/'))
    API_HOST = API_HOST.slice(0, -1);

export function api_request(method, url, data, contentType = 'application/json') {
    if (!url.startsWith('/'))
        url = '/' + url;

    return fetch(API_HOST + url, {
        method: method,
        headers: {
            'Content-Type': contentType,
        },
        body: data
    });
};

export function formatDate(_d) {
    let d = new Date(_d);
    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + 
        ' ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}