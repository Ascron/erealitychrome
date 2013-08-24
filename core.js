(function(){

    function init() {
        plugins_chatcoords();
    }

    function plugins_chatcoords() {
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

    return {init: init};
})().init();