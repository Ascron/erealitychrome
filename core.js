(function(){

    var EVENT_NAME = "ER_connectExtension";

    var REQUEST_TYPE_XHTTP = 'xhttp_request';

    function init () {
        pluginContainer.load();

//        xhttp({
//            method: "POST",
//            url: "http://sp.erclans.ru/evgeska_prof.php?calc=heroesinfo",
//            data: "prof=phoenix&submit=1"
//        }, function(response){
//            console.log(response);
//        });
    }

    var pluginContainer = (function(plugins){
        var container = plugins;

        function load () {
            for (plugin in container) {
                if (container.hasOwnProperty(plugin) && container[plugin].enabled){
                    container[plugin].func();
                }
            }
        }

        function call (plugin) {
            return container[plugin];
        }

        return {load: load, call: call};
    })({
        chatCoords: {func: plugins_chatcoords, enabled: true}
    });

    function plugins_chatcoords () {
        chat.formatSmilies = overloader(chat, chat.formatSmilies, function(){
            arguments[0] = arguments[0].replace(
                /(\d{1,3})[: \.\-](\d{1,3})/ig,
                "<a href=\"javascript:(function(){if(typeof main._showSec!='undefined')main._showSec($1,$2);})();\">$&</a>"
            );
            return arguments;
        })
    }

    function overloader (scope, func, prepareArguments, prepareResult) {
        return function() {
            if (prepareArguments) {
                arguments = prepareArguments.apply(this, arguments);
            }
            var result = func.apply(scope, arguments);
            if (prepareResult) {
                result = prepareResult(result, arguments);
            }
            return result;
        };
    }

    function sendMessage (data, callback) {
        var d = document.createElement("textarea"),
            e = document.createEvent("Events");
        d.style.cssText = "display:none;";
        d.value = data == null ? "" : JSON.stringify(data);
        d.addEventListener("action", function() {
            callback && callback(JSON.parse(d.value));
            d.parentNode.removeChild(d);
        }, true)
        document.body.appendChild(d);

        e.initEvent(EVENT_NAME, false, true);
        d.dispatchEvent(e);
    }

    function xhttp(data, callback) {
        sendMessage({type: REQUEST_TYPE_XHTTP, body: data}, callback);
    }

    return {init: init};
})().init();