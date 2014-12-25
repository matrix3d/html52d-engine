var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Graphics = (function () {
    function Graphics() {
        this.cmds = [];
    }
    //beginBitmapFill(bitmap: BitmapData, matrix: Matrix= null, repeat: Boolean= true, smooth: Boolean= false): void;/
    Graphics.prototype.beginFill = function (color) {
        this.cmds.push(new SetAttribCmd("fillStyle", color));
    };

    //public function beginGradientFill(type: String, colors: Array, alphas: Array, ratios: Array, matrix: Matrix= null, spreadMethod: String= "pad", interpolationMethod: String= "rgb", focalPointRatio: Number= 0): void;
    Graphics.prototype.clear = function () {
    };
    Graphics.prototype.copyFrom = function (sourceGraphics) {
        this.cmds = sourceGraphics.cmds.concat();
    };

    //public function cubicCurveTo(controlX1: Number, controlY1: Number, controlX2: Number, controlY2: Number, anchorX: Number, anchorY: Number): void;/
    Graphics.prototype.drawCircle = function (x, y, radius) {
        this.cmds.push(new Cmd(Graphics.ctx.beginPath, null), new Cmd(Graphics.ctx.arc, [x, y, radius, 0, Math.PI * 2]), new Cmd(Graphics.ctx.closePath, null), new Cmd(Graphics.ctx.fill, null));
    };

    //public function drawEllipse(x: Number, y: Number, width: Number, height: Number): void;
    Graphics.prototype.drawRect = function (x, y, width, height) {
        this.cmds.push(new Cmd(Graphics.ctx.fillRect, [x, y, width, height]), new Cmd(Graphics.ctx.strokeRect, [x, y, width, height]));
    };

    //public function drawRoundRect(x: Number, y: Number, width: Number, height: Number, ellipseWidth: Number, ellipseHeight: Number= null): void;
    Graphics.prototype.endFill = function () {
        this.cmds.push(new Cmd(Graphics.ctx.closePath, null), new Cmd(Graphics.ctx.fill, null));
        this.beginFill("#000");
    };
    Graphics.prototype.lineStyle = function (thickness, color) {
        this.cmds.push(new SetAttribCmd("lineWidth", thickness), new SetAttribCmd("strokeStyle", color));
    };
    Graphics.prototype.lineTo = function (x, y) {
        this.cmds.push(new Cmd(Graphics.ctx.lineTo, [x, y]));
    };

    Graphics.prototype.moveTo = function (x, y) {
        this.cmds.push(new Cmd(Graphics.ctx.beginPath, null), new Cmd(Graphics.ctx.moveTo, [x, y]));
    };

    Graphics.prototype.update = function () {
        Graphics.ctx.fillStyle = "#000";
        Graphics.ctx.strokeStyle = "#000";
        Graphics.ctx.beginPath();
        for (var key in this.cmds) {
            this.cmds[key].update();
        }
        Graphics.ctx.closePath();
        Graphics.ctx.fill();
        Graphics.ctx.stroke();
    };
    return Graphics;
})();

var Cmd = (function () {
    function Cmd(cmd, args) {
        this.cmd = cmd;
        this.args = args;
    }
    Cmd.prototype.update = function () {
        this.cmd.apply(Graphics.ctx, this.args);
    };
    return Cmd;
})();

var SetAttribCmd = (function (_super) {
    __extends(SetAttribCmd, _super);
    function SetAttribCmd(name, value) {
        _super.call(this, null, null);
        this.name = name;
        this.value = value;
    }
    SetAttribCmd.prototype.update = function () {
        Graphics.ctx[this.name] = this.value;
    };
    return SetAttribCmd;
})(Cmd);
var Sprite = (function () {
    function Sprite() {
        this.children = [];
        this.graphics = new Graphics();
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
    }
    Sprite.prototype.addChild = function (s) {
        s.parent = this;
        this.children.push(s);
    };

    Sprite.prototype.removeChild = function (s) {
        var i = this.children.indexOf(s);
        if (i != -1) {
            this.children.splice(i, 1);
        }
    };

    Sprite.prototype.update = function (v) {
        v.ctx.setTransform(1, 0, 0, 1, 0, 0);
        v.ctx.translate(this.x, this.y);
        v.ctx.rotate(this.rotation * Math.PI / 180);
        v.ctx.scale(this.scaleX, this.scaleY);
        this.graphics.update();
    };
    return Sprite;
})();
var View = (function (_super) {
    __extends(View, _super);
    function View(canvas) {
        var _this = this;
        _super.call(this);
        this.mouseX = 0;
        this.mouseY = 0;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        Graphics.ctx = this.ctx;
        canvas.addEventListener("mousemove", function (e) {
            return _this.mouseMoveHander(e);
        });
    }
    View.prototype.mouseMoveHander = function (e) {
        var rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    };

    View.prototype.render = function () {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var key in this.children) {
            var s = this.children[key];
            s.update(this);
        }
    };
    return View;
})(Sprite);
/**
* ...
* @author lizhi
*/
var Main = (function () {
    function Main() {
    }
    Main.main = function () {
        var app = new App();
        app.start();
    };
    return Main;
})();

var App = (function () {
    function App() {
        this.shapes = [];
        var canvas = document.getElementById("canvas1");

        this.view = new View(canvas);
    }
    App.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () {
            return _this.update();
        }, 1000 / 24);
    };

    App.prototype.update = function () {
        var c = 1;
        while (c-- > 0) {
            var s = new Shape3D(Math.random() * 1000, "#000");
            this.view.addChild(s);
            s.x = this.view.mouseX;
            s.y = this.view.mouseY;
            this.shapes.push(s);
        }

        var d = new Date();
        var t = d.getTime();
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            var s = this.shapes[i];
            s.update2(t);
            if (s.power <= 0) {
                this.shapes.splice(i, 1);
                if (s.parent) {
                    s.parent.removeChild(s);
                }
            }
        }
        this.view.render();
    };

    App.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return App;
})();

var Shape3D = (function (_super) {
    __extends(Shape3D, _super);
    function Shape3D(id, color) {
        _super.call(this);
        this.power = 100 + 50 * Math.random();
        this.rSpeed = Math.random() / 300;
        this.id = id;

        this.graphics.beginFill(color);
        var j = Math.floor(16 * Math.random() / 2) * 2;
        var r = 10;
        var minRP = .5;
        var minR = r * minRP;
        var num = 3 + j / 2;
        var num2 = num * 2;
        var a = Math.PI / num;
        var a2 = a * 2;
        var sa = 0;
        var isB = j % 2 == 1;
        var vs = [];
        for (var i = 0; i <= num2; i++) {
            var ca = i * a;
            var cr = (i % 2) == 0 ? r : minR;
            var dx = cr * Math.cos(ca);
            var dy = cr * Math.sin(ca);
            if (i == 0) {
                if (!isB)
                    this.graphics.moveTo(dx, dy);
            } else {
                if (!isB)
                    this.graphics.lineTo(dx, dy);
                // else vs.push(new Point(dx, dy));
            }
        }

        var speed = 10 * (.2 + Math.random());
        var a3 = 2 * Math.PI * Math.random();
        this.vx = Math.sin(a3) * speed;
        this.vy = Math.cos(a3) * speed;
    }
    Shape3D.prototype.update2 = function (t) {
        var ft = this.id + t * this.rSpeed;
        this.rotation = this.id + t * this.rSpeed;
        this.scaleX = Math.sin(ft);
        this.scaleY = Math.cos(ft);
        this.power--;

        //alpha = power / 100;
        this.vy += .1;
        this.vx *= .95;
        this.vy *= .95;
        this.x += this.vx;
        this.y += this.vy;
    };
    return Shape3D;
})(Sprite);
