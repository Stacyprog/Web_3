
(function() {
    'use strict';

    setInterval(clock, 8000);
    clock();

    function clock() {
        document.getElementById('clockElement').innerText = getCurrentTime();
    }

    function getCurrentTime() {
        const date = new Date();

        return date.getFullYear() + '-' + complete(date.getMonth() + 1) + '-' + complete(date.getDate()) + ' ' +
            complete(date.getHours()) + ':' + complete(date.getMinutes()) + ':' + complete(date.getSeconds());
    }

    function complete(src, length = 2, char = '0') {
        src = src + '';

        while (src.length < length) {
            src = char + src;
        }

        return src;
    }
})();
