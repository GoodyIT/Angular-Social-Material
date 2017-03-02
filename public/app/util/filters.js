angular.module('app').filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

    angular.module('app').filter('simplifyNum', function () {
        return function (value) {
            if(value > 10000 && value < 1000000){
                return (value/1000).toFixed(2) + "K";
            }else if (value >= 1000000){
                return (value/1000000).toFixed(2) + "M";
            }
            return value;
        };
    });