/**
* ...
* @author lizhi
*/
// module display{
var BitmapData = (function () {
    function BitmapData(src) {
        this.image = new Image();
        this.image.src = src;
    }
    return BitmapData;
})();
//}
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* ...
* @author lizhi
*/
var Graphics = (function () {
    function Graphics() {
        this.cmds = [];
    }
    Graphics.prototype.drawImage = function (bitmap, sx, sy, swidth, sheight, x, y, width, height) {
        if (typeof sx === "undefined") { sx = 0; }
        if (typeof sy === "undefined") { sy = 0; }
        if (typeof swidth === "undefined") { swidth = 0; }
        if (typeof sheight === "undefined") { sheight = 0; }
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        this.cmds.push(swidth == 0 ? new Cmd(Graphics.ctx.drawImage, [bitmap.image, sx, sy]) : new Cmd(Graphics.ctx.drawImage, [bitmap.image, sx, sy, swidth, sheight, x, y, width, height]));
    };
    Graphics.prototype.beginFill = function (color, alpha) {
        if (typeof color === "undefined") { color = 0; }
        if (typeof alpha === "undefined") { alpha = 1; }
        this.cmds.push(new SetColorAttribCmd(Graphics.ctx, "fillStyle", color, alpha, this.sprite), new Cmd(Graphics.ctx.beginPath, null), new SetAttribCmd(this, "filling", true));
    };
    Graphics.prototype.endFill = function () {
        this.cmds.push(new Cmd(Graphics.ctx.closePath, null), new SetAttribCmd(this, "filling", false));
        if (this.filling) {
            this.cmds.push(new Cmd(Graphics.ctx.fill, null));
        }
    };
    Graphics.prototype.lineStyle = function (thickness, color, alpha) {
        if (typeof color === "undefined") { color = 0; }
        if (typeof alpha === "undefined") { alpha = 1; }
        if (this.lineing)
            this.cmds.push(new Cmd(Graphics.ctx.stroke, null));
        this.cmds.push(new SetAttribCmd(Graphics.ctx, "lineWidth", thickness), new SetColorAttribCmd(Graphics.ctx, "strokeStyle", color, alpha, this.sprite), new SetAttribCmd(this, "lineing", thickness != undefined));
    };

    //public function beginGradientFill(type: String, colors: Array, alphas: Array, ratios: Array, matrix: Matrix= null, spreadMethod: String= "pad", interpolationMethod: String= "rgb", focalPointRatio: Number= 0): void;
    Graphics.prototype.clear = function () {
        this.filling = false;
        this.lineing = false;
        this.cmds = [];
    };
    Graphics.prototype.copyFrom = function (sourceGraphics) {
        this.cmds = sourceGraphics.cmds.concat();
    };
    Graphics.prototype.drawCircle = function (x, y, radius) {
        this.cmds.push(new Cmd(Graphics.ctx.beginPath, null), new Cmd(Graphics.ctx.arc, [x, y, radius, 0, Math.PI * 2]), new Cmd(Graphics.ctx.closePath, null), new Cmd(Graphics.ctx.fill, null));
    };

    //public function drawEllipse(x: Number, y: Number, width: Number, height: Number): void;
    Graphics.prototype.drawRect = function (x, y, width, height) {
        if (this.filling)
            this.cmds.push(new Cmd(Graphics.ctx.fillRect, [x, y, width, height]));
        if (this.lineing)
            this.cmds.push(new Cmd(Graphics.ctx.strokeRect, [x, y, width, height]));
    };

    //public function drawRoundRect(x: Number, y: Number, width: Number, height: Number, ellipseWidth: Number, ellipseHeight: Number= null): void;
    Graphics.prototype.lineTo = function (x, y) {
        this.cmds.push(new Cmd(Graphics.ctx.lineTo, [x, y]));
    };

    Graphics.prototype.moveTo = function (x, y) {
        this.cmds.push(new Cmd(Graphics.ctx.moveTo, [x, y]));
    };

    Graphics.prototype.curveTo = function (controlX, controlY, anchorX, anchorY) {
        this.cmds.push(new Cmd(Graphics.ctx.quadraticCurveTo, [controlX, controlY, anchorX, anchorY]));
    };
    Graphics.prototype.cubicCurveTo = function (controlX1, controlY1, controlX2, controlY2, anchorX, anchorY) {
        this.cmds.push(new Cmd(Graphics.ctx.bezierCurveTo, [controlX1, controlY1, controlX2, controlY2, anchorX, anchorY]));
    };

    Graphics.prototype.update = function () {
        this.lineing = false;
        this.filling = false;
        for (var key in this.cmds) {
            this.cmds[key].update();
        }
        Graphics.ctx.closePath();
        if (this.filling)
            Graphics.ctx.fill();
        if (this.lineing)
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
    function SetAttribCmd(target, name, value) {
        _super.call(this, null, null);
        this.target = target;
        this.name = name;
        this.value = value;
        this.update();
    }
    SetAttribCmd.prototype.update = function () {
        this.target[this.name] = this.value;
    };
    return SetAttribCmd;
})(Cmd);

var SetColorAttribCmd = (function (_super) {
    __extends(SetColorAttribCmd, _super);
    function SetColorAttribCmd(target, name, color, alpha, sprite) {
        this.color = color;
        this.alpha = alpha;
        this.sprite = sprite;
        _super.call(this, target, name, null);
    }
    SetColorAttribCmd.prototype.update = function () {
        this.value = "rgba(" + (this.color >> 16 & 0xff) + "," + (this.color >> 8 & 0xff) + "," + (this.color & 0xff) + "," + this.alpha * this.sprite.alpha + ")";
        _super.prototype.update.call(this);
    };
    return SetColorAttribCmd;
})(SetAttribCmd);
/**
* ...
* @author lizhi
*/
var Sprite = (function () {
    function Sprite() {
        this.children = [];
        this.ctrls = [];
        this.graphics = new Graphics();
        this.alpha = 1;
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.graphics.sprite = this;
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
        for (var key in this.ctrls) {
            this.ctrls[key].update();
        }

        v.ctx.setTransform(1, 0, 0, 1, 0, 0);
        v.ctx.translate(this.x, this.y);
        v.ctx.rotate(this.rotation * Math.PI / 180);
        v.ctx.scale(this.scaleX, this.scaleY);
        this.graphics.update();
    };
    return Sprite;
})();
/**
* ...
* @author lizhi
*/
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
var Ctrl = (function () {
    function Ctrl() {
    }
    Ctrl.prototype.update = function () {
    };
    return Ctrl;
})();
/**
* ...
* @author lizhi
*/
var SpriteSheet = (function () {
    function SpriteSheet(image, imageWidth, imageHeight, numCols, numRows, centerX, centerY) {
        if (typeof centerX === "undefined") { centerX = 0; }
        if (typeof centerY === "undefined") { centerY = 0; }
        this.animations = {};
        this.animationNames = [];
        this.image = image;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.numCols = numCols;
        this.numRows = numRows;
        this.centerX = centerX;
        this.centerY = centerY;
    }
    SpriteSheet.prototype.update = function (target, frame, currentAnimationName) {
        target.graphics.clear();
        var frames = this.animations[currentAnimationName];
        if (frames) {
            var f = frames[Math.floor(frame) % frames.length];
        } else {
            var f = Math.floor(frame) % (this.numCols * this.numRows);
        }

        var ox = f % this.numCols;
        var oy = Math.floor(f / this.numCols);
        var sw = this.imageWidth / this.numCols;
        var sh = this.imageHeight / this.numRows;
        target.graphics.drawImage(this.image, sw * ox, sh * oy, sw, sh, -this.centerX, -this.centerY, sw, sh);
    };
    SpriteSheet.prototype.addAnimation = function (name, frames) {
        this.animations[name] = frames;
        this.animationNames.push(name);
    };
    return SpriteSheet;
})();
/**
* ...
* @author lizhi
*/
var SpriteSheetCtrl = (function (_super) {
    __extends(SpriteSheetCtrl, _super);
    function SpriteSheetCtrl(target, sheet, fps) {
        if (typeof fps === "undefined") { fps = 1; }
        _super.call(this);
        this.frame = 0;
        this.target = target;
        this.sheet = sheet;
        this.fps = fps;
    }
    SpriteSheetCtrl.prototype.update = function () {
        this.frame += this.fps;
        this.sheet.update(this.target, this.frame, this.currentAnimationName);
    };

    SpriteSheetCtrl.prototype.play = function (name, frame) {
        if (typeof frame === "undefined") { frame = 0; }
        this.currentAnimationName = name;
        this.frame = frame;
    };
    return SpriteSheetCtrl;
})(Ctrl);
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
        var _this = this;
        this.shapes = [];
        var canvas = document.getElementById("canvas1");

        this.view = new View(canvas);
        var sheet = new SpriteSheet(new BitmapData("rockman.png"), 500, 350, 10, 7, 500 / 10 / 2);
        sheet.addAnimation("run", [3, 4, 5]);
        sheet.addAnimation("stand", [0, 1, 2]);
        sheet.addAnimation("attack1", [42, 43, 44, 45]);
        var c = 100;
        while (c-- > 0) {
            var ss = new Sprite();
            if (Math.random() < .5)
                ss.scaleX = -1;
            var ssc = new SpriteSheetCtrl(ss, sheet, Math.random() / 3);
            ssc.play(sheet.animationNames[Math.floor(sheet.animationNames.length * Math.random())], Math.random() * 100);
            ssc.frame = 100 * Math.random();
            ss.ctrls.push(ssc);
            ss.x = Math.floor(Math.random() * 400);
            ss.y = Math.floor(Math.random() * 400);
            this.view.addChild(ss);
        }
        this.view.children.sort(function (n1, n2) {
            return n1.y - n2.y;
        });

        var s = new Sprite();
        this.view.addChild(s);
        this.view.canvas.addEventListener("mousemove", function (e) {
            return _this.mouseMoveHander(e);
        });
    }
    App.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () {
            return _this.update();
        }, 1000 / 24);
    };

    App.prototype.mouseMoveHander = function (e) {
        var c = 3;
        while (c-- > 0) {
            var s = new Shape3D(Math.random() * 1000, 0x000);
            this.view.addChild(s);
            s.x = this.view.mouseX;
            s.y = this.view.mouseY;
            this.shapes.push(s);
        }
    };
    App.prototype.update = function () {
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

        //this.graphics.beginBitmapFill(new BitmapData("1.jpg"));
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
        this.alpha = this.power / 150;
        this.vy += .1;
        this.vx *= .95;
        this.vy *= .95;
        this.x += this.vx;
        this.y += this.vy;
    };
    return Shape3D;
})(Sprite);
