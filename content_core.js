var s = document.createElement('script');
s.src = chrome.extension.getURL("core.js");
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

var EVENT_NAME = "ER_connectExtension";

var REQUEST_TYPE_XHTTP = 'xhttp_request';

var requestResolver = (function(){
    function init() {
        document.addEventListener(EVENT_NAME, function(e) {
            var from = e.target;
            if (from) {
                resolve(JSON.parse(from.value), function(response){
                    var event = document.createEvent('Events');
                    event.initEvent('action', true, false);
                    from.value = JSON.stringify(response);
                    from.dispatchEvent(event);
                });
            }
        }, true);
    }

    function resolve (request, callback) {
        switch (request.type) {
            case REQUEST_TYPE_XHTTP:
                xhttp(request.body, callback);
        }
    }

    function xhttp (params, callback) {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (params.onreadystatechange) {
                params.onreadystatechange(request);
            }

            if (request.readyState == 4) {
                if (request.status >= 200 && request.status < 400) {
                    if (callback) {
                        callback(request)
                    }
                } else {
                    if (callback) {
                        callback({'status': 0});
                    }
                }
            }
        }

        request.open(params.method, params.url, true)
        if (params.headers) for (nname in params.headers)
            request.setRequestHeader(nname, params.headers[nname])

        request.send(params.data)
        return request
    }

    return {init: init};
})().init();