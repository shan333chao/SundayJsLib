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
    ///获取中英文字符长度
    self.GetLength = function (str) {
        ///<summary>获得字符串实际长度，中文2，英文1</summary>
        ///<param name="str">要获得长度的字符串</param>
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    };
   ///遍历json对象编织get请求参数
    self.buildParams = function (json) {
        var urlParams = "";
        for (var item in json) {
            if (json.hasOwnProperty(item)) {
                urlParams += "&" + item + "=" + json[item];
            }
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
    ///获取URL中的参数
    self.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null && r != undefined) return unescape(r[2]);
        return "";
    }
    ///生成一个带参数的url
    self.buildUrl = function (url,params) { 
        return self.rootUrl + url + self.buildParams(params)
    }
      ///cookies 增删改查
    self.CoolKey = {
        //写入cookie
        setCookie: function (name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        },
        //读取cookies
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        },
        //删除cookies
        delCookie: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }   
///依赖jquery
   //构造ajax Get请求
    self.AjaxGet = function (url) { 
        var defered = $.Deferred();
        $.getJSON(self.rootUrl+url).done(function (res) {
            defered.resolve(res);
        }).fail(function () {
            defered.reject("请求发生错误");
        })
        return defered.promise();
    }
    ///依赖jquery
    ///构造AjaxPost 请求
    self.AjaxPost = function (url, data) { 
        var defered = $.Deferred();
        $.post(self.rootUrl + url, data).done(function (res) {
            defered.resolve(res);
        }).fail(function () {
            defered.reject("请求发生错误");
        })
        return defered.promise();
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
