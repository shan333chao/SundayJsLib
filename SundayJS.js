if (!"Sunday ".trim) {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    String.prototype.trim = function() {
        return this.replace(rtrim, "")
    }
}
var master = (function() {
    var self = this;
    var serialize = Object.prototype.toString;
    var rword = /[^, ]+/g //切割字符串为一个个小块，以空格或豆号分开它们，结合replace实现字符串的forEach
    var class2type = {}
    "Boolean Number String Function Array Date RegExp Object Error".replace(rword, function(name) {
        class2type["[object " + name + "]"] = name.toLowerCase()
    })

    ///遍历json对象编制get请求参数
    self.buildParams = function(json) {
            var urlParams = "";
            for (var item in json) {
                if (json.hasOwnProperty(item)) {
                    urlParams += "&" + item + "=" + json[item];
                }
                // if (json[item] != undefined) {
                //     urlParams += "&" + item + "=" + json[item];
                // }
            }
            return urlParams;
        }
        ///转换日期
    self.getTimeSpan = function(dateStr) {
            if (self.IsAnyType(dateStr, "date")) {
                return dateStr;
            } else {
                var time = dateStr.replace("/Date(", "").replace(")/", "");
                var date = new Date();
                date.setTime(time);
                return date;
            }
        }
        ///获取URL中参数的值
    self.getQueryString = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null && r != undefined) return unescape(r[2]);
            return "";
        }
        ///判断是否是微信浏览器
    self.isWeixin = function() {
            var ua = navigator.userAgent.toLowerCase();
            console.log(ua);
            return (/micromessenger/.test(ua)) ? true : false;
        }
        ///获取当前对象的javascript类型
    self.getType = function(obj) { //取得目标的类型
            if (obj == null) {
                return String(obj)
            }
            // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[serialize.call(obj)] || "object" :
                typeof obj
        }
        ///判断参数类型
    self.IsAnyType = function(obj, typeName) {
            try {
                return self.getType(obj) == typeName
            } catch (e) {
                return false;
            }
        }
        //字符串工具类
    self.StrTools = {
            escapeHtml: function(target) {

            },
            unescapeHtml: function(target) {

            }

        }
        //判断类型
    self.AssertType = {
        isArray: function(obj) {
            return self.IsAnyType(obj, "array")
        },
        isDate: function(obj) {
            return self.IsAnyType(obj, "date")
        },
        isBoolean: function(obj) {
            return self.IsAnyType(obj, "boolean")
        },
        isNumber: function(obj) {
            return self.IsAnyType(obj, "number")
        },
        isIE678: function() {
            return window == document;
        },
        isNaN: function(obj) {
            return obj !== obj;
        },
        isNull: function(obj) {
            return obj === null;
        },
        isUndefined: function(obj) {
            return obj === void 0;
        }
    }

    /* 
  Date 对象格式化字符串
 'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
 'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
 'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
 'MMMM': Month in year (January-December)
 'MMM': Month in year (Jan-Dec)
 'MM': Month in year, padded (01-12)
 'M': Month in year (1-12)
 'dd': Day in month, padded (01-31)
 'd': Day in month (1-31)
 'EEEE': Day in Week,(Sunday-Saturday)
 'EEE': Day in Week, (Sun-Sat)
 'HH': Hour in day, padded (00-23)
 'H': Hour in day (0-23)
 'hh': Hour in am/pm, padded (01-12)
 'h': Hour in am/pm, (1-12)
 'mm': Minute in hour, padded (00-59)
 'm': Minute in hour (0-59)
 'ss': Second in minute, padded (00-59)
 's': Second in minute (0-59)
 'a': am/pm marker
 'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
 format string can also be one of the following predefined localizable formats:
 
 'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
 'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
 'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
 'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
 'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
 'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
 'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
 'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
 */
    new function() { // jshint ignore:line
        function toInt(str) {
            return parseInt(str, 10) || 0
        }

        function padNumber(num, digits, trim) {
            var neg = ""
            if (num < 0) {
                neg = '-'
                num = -num
            }
            num = "" + num
            while (num.length < digits)
                num = "0" + num
            if (trim)
                num = num.substr(num.length - digits)
            return neg + num
        }

        function dateGetter(name, size, offset, trim) {
            return function(date) {
                var value = date["get" + name]()
                if (offset > 0 || value > -offset)
                    value += offset
                if (value === 0 && offset === -12) {
                    value = 12
                }
                return padNumber(value, size, trim)
            }
        }

        function dateStrGetter(name, shortForm) {
            return function(date, formats) {
                var value = date["get" + name]()
                var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
                return formats[get][value]
            }
        }

        function timeZoneGetter(date) {
            var zone = -1 * date.getTimezoneOffset()
            var paddedZone = (zone >= 0) ? "+" : ""
            paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
            return paddedZone
        }
        //取得上午下午

        function ampmGetter(date, formats) {
            return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
        }
        var DATE_FORMATS = {
            yyyy: dateGetter("FullYear", 4),
            yy: dateGetter("FullYear", 2, 0, true),
            y: dateGetter("FullYear", 1),
            MMMM: dateStrGetter("Month"),
            MMM: dateStrGetter("Month", true),
            MM: dateGetter("Month", 2, 1),
            M: dateGetter("Month", 1, 1),
            dd: dateGetter("Date", 2),
            d: dateGetter("Date", 1),
            HH: dateGetter("Hours", 2),
            H: dateGetter("Hours", 1),
            hh: dateGetter("Hours", 2, -12),
            h: dateGetter("Hours", 1, -12),
            mm: dateGetter("Minutes", 2),
            m: dateGetter("Minutes", 1),
            ss: dateGetter("Seconds", 2),
            s: dateGetter("Seconds", 1),
            sss: dateGetter("Milliseconds", 3),
            EEEE: dateStrGetter("Day"),
            EEE: dateStrGetter("Day", true),
            a: ampmGetter,
            Z: timeZoneGetter
        }
        var rdateFormat = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/
        var raspnetjson = /^\/Date\((\d+)\)\/$/
        self.date = function(date, format) {
            var locate = self.date.locate,
                text = "",
                parts = [],
                fn, match
            format = format || "mediumDate"
            format = locate[format] || format
            if (typeof date === "string") {
                if (/^\d+$/.test(date)) {
                    date = toInt(date)
                } else if (raspnetjson.test(date)) {
                    date = +RegExp.$1
                } else {
                    var trimDate = date.trim()
                    var dateArray = [0, 0, 0, 0, 0, 0, 0]
                    var oDate = new Date(0)
                        //取得年月日
                    trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function(_, a, b, c) {
                        var array = c.length === 4 ? [c, a, b] : [a, b, c]
                        dateArray[0] = toInt(array[0]) //年
                        dateArray[1] = toInt(array[1]) - 1 //月
                        dateArray[2] = toInt(array[2]) //日
                        return ""
                    })
                    var dateSetter = oDate.setFullYear
                    var timeSetter = oDate.setHours
                    trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function(_, a, b, c, d) {
                        dateArray[3] = toInt(a) //小时
                        dateArray[4] = toInt(b) //分钟
                        dateArray[5] = toInt(c) //秒
                        if (d) { //毫秒
                            dateArray[6] = Math.round(parseFloat("0." + d) * 1000)
                        }
                        return ""
                    })
                    var tzHour = 0
                    var tzMin = 0
                    trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function(z, symbol, c, d) {
                        dateSetter = oDate.setUTCFullYear
                        timeSetter = oDate.setUTCHours
                        if (symbol) {
                            tzHour = toInt(symbol + c)
                            tzMin = toInt(symbol + d)
                        }
                        return ""
                    })

                    dateArray[3] -= tzHour
                    dateArray[4] -= tzMin
                    dateSetter.apply(oDate, dateArray.slice(0, 3))
                    timeSetter.apply(oDate, dateArray.slice(3))
                    date = oDate
                }
            }
            if (typeof date === "number") {
                date = new Date(date)
            }
            if (self.getType(date) !== "date") {
                return
            }
            while (format) {
                match = rdateFormat.exec(format)
                if (match) {
                    parts = parts.concat(match.slice(1))
                    format = parts.pop()
                } else {
                    parts.push(format)
                    format = null
                }
            }
            parts.forEach(function(value) {
                fn = DATE_FORMATS[value]
                text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
            })
            return text
        }
        var locate = {
            AMPMS: {
                0: "上午",
                1: "下午"
            },
            DAY: {
                0: "星期日",
                1: "星期一",
                2: "星期二",
                3: "星期三",
                4: "星期四",
                5: "星期五",
                6: "星期六"
            },
            MONTH: {
                0: "1月",
                1: "2月",
                2: "3月",
                3: "4月",
                4: "5月",
                5: "6月",
                6: "7月",
                7: "8月",
                8: "9月",
                9: "10月",
                10: "11月",
                11: "12月"
            },
            SHORTDAY: {
                "0": "周日",
                "1": "周一",
                "2": "周二",
                "3": "周三",
                "4": "周四",
                "5": "周五",
                "6": "周六"
            },
            fullDate: "y年M月d日EEEE",
            longDate: "y年M月d日",
            medium: "yyyy-M-d H:mm:ss",
            mediumDate: "yyyy-M-d",
            mediumTime: "H:mm:ss",
            "short": "yy-M-d ah:mm",
            shortDate: "yy-M-d",
            shortTime: "ah:mm"
        }
        locate.SHORTMONTH = locate.MONTH
        self.date.locate = locate
    }
    return {
        buildParams: self.buildParams,
        getTimeSpan: self.getTimeSpan,
        getQueryString: self.getQueryString,
        isWeixin: self.isWeixin,
        StrTools: self.StrTools,
        AssertType: self.AssertType,
        dateFormat: date
    };
})();