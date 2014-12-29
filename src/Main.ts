/**
 * ...
 * @author lizhi
 */
class Main 
{
	
	static main():void 
	{
		var app = new App();
		app.start();
		
	}
}

class App {
    view: View;
    timerToken: number;
    shapes: Array<Shape3D> = [];
    constructor() {
        var canvas =<HTMLCanvasElement> document.getElementById("canvas1");

        this.view = new View(canvas);
		var c =100;
		while(c-->0){
			var ss = new Sprite();
			var ssc=new SpriteSheetCtrl(ss,new BitmapData("rockman.png"),500,350,10,7,Math.random()/3);
			ssc.frame=100*Math.random();
			ss.ctrls.push(ssc);
			ss.x=Math.floor(Math.random()*400);
			ss.y=Math.floor(Math.random()*400);
			this.view.addChild(ss);
		}
		
		var s = new Sprite();
		this.view.addChild(s);
		this.view.canvas.addEventListener("mousemove", (e:MouseEvent) => this.mouseMoveHander(e));
    }

    start() {
        this.timerToken = setInterval(() => this.update(), 1000/24);
    }

	mouseMoveHander(e){
		 var c = 3;
        while (c-- > 0) {
            var s = new Shape3D(Math.random() * 1000, 0x000);
            this.view.addChild(s);
            s.x = this.view.mouseX;
            s.y = this.view.mouseY;
            this.shapes.push(s);
        }
	}
    update() {
        var d = new Date();
        var t = d.getTime();
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            var s: Shape3D = this.shapes[i];
            s.update2(t);
            if (s.power <= 0) {
                this.shapes.splice(i, 1);
                if (s.parent) {
                    s.parent.removeChild(s);
                }
            }
        }
        this.view.render();
    }

    stop() {
        clearTimeout(this.timerToken);
    }

}

class Shape3D extends Sprite {
    id: number;
    power: number = 100 + 50 * Math.random();
    vx: number;
    vy: number;
    rSpeed: number = Math.random() / 300;
    constructor(id: number, color: number) 
    {
        super();
        this.id = id;
        this.graphics.beginFill(color);
		//this.graphics.beginBitmapFill(new BitmapData("1.jpg"));
        var j = Math.floor( 16 * Math.random()/2)*2;
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
            var dx = cr * Math.cos(ca)
                var dy = cr * Math.sin(ca);
            if (i == 0) {
                if (!isB) this.graphics.moveTo(dx, dy);
            } else {
                if (!isB) this.graphics.lineTo(dx, dy);
               // else vs.push(new Point(dx, dy));
            }
        }

        var speed = 10 * (.2 + Math.random());
        var a3 = 2 * Math.PI * Math.random();
        this.vx = Math.sin(a3) * speed;
        this.vy = Math.cos(a3) * speed;
    }

    update2(t: number): void 
    {
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
    }
}