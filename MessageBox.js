///依赖/*! layer mobile-v1.5 弹层组件移动版 License LGPL http://layer.layui.com/mobile By 贤心 */
; var MessageBox = (function () {

    var self = this;
    self.index = -123;

    self.showMsg = function (msg,callback) {
       return layer.open({
            content: msg,
            
            time: 3,
            end: callback
        });

    }

    self.show = function (msg) {
        return layer.open({
            content: msg,
            btn: ['确定'],
            shadeClose: false
        });
    }
    self.yes_no = function (msg, YbtnTxt, Yfunc, NbtnTxt, Nfunc) {
        return layer.open({
            content: msg,
            btn: [YbtnTxt, NbtnTxt],
            yes: function (index) {
                Yfunc();
                layer.close(index)
            },
            no: function (index) {
                Nfunc();
                layer.close(index)
            },
            shadeClose: false
        });
    }

    self.loading = function (msg) {
        self.index = layer.open({
            type: 2,
            shadeClose: false,
        });
    }

    self.distory = function () {
        layer.close(self.index)
    }
    return {
        Alert: self.show,
        Confirm: self.yes_no,
        Loading: self.loading,
        Close: self.distory,
        ShowMsg:self.showMsg
    }
})();
