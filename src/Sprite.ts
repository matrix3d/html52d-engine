/**
 * ...
 * @author lizhi
 */
class Sprite {
    children: Array<Sprite> = [];
	ctrls:Array<Ctrl>=[];
    graphics: Graphics=new Graphics();
	alpha:number=1;
    x: number=0;
    y: number=0;
    scaleX: number=1;
    scaleY: number=1;
    rotation: number = 0;
    parent: Sprite;
    constructor() {
		this.graphics.sprite=this;
    }

    addChild(s: Sprite) {
        s.parent = this;
        this.children.push(s);
    }

    removeChild(s: Sprite) {
        var i = this.children.indexOf(s);
        if(i!=-1) {
            this.children.splice(i, 1);
        }
    }

    update(v: View) {
		for(var key in this.ctrls){
			this.ctrls[key].update();
		}
		
        v.ctx.setTransform(1, 0, 0, 1, 0, 0);
        v.ctx.translate(this.x, this.y);
        v.ctx.rotate(this.rotation*Math.PI/180);
        v.ctx.scale(this.scaleX, this.scaleY);
        this.graphics.update();
    }
} 