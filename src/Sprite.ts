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
	matrix:Matrix;
	worldMatrix:Matrix;
    parent: Sprite;
    constructor() {
		this.graphics.sprite=this;
		this.matrix=new Matrix();
		this.worldMatrix=new Matrix();
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
		this.matrix.identity();
		this.matrix.translate(this.x,this.y);
		this.matrix.rotate(this.rotation);
		this.matrix.scale(this.scaleX,this.scaleY);
		this.worldMatrix.copy(this.matrix);
		if(this.parent){
			this.worldMatrix.prepend(this.parent.worldMatrix);
		}
        v.ctx.setTransform(this.worldMatrix.a, this.worldMatrix.b, this.worldMatrix.c, this.worldMatrix.d, this.worldMatrix.tx, this.worldMatrix.ty);
        this.graphics.update();
		
		for (var key in this.children) {
            var s = this.children[key];
            s.update(v);
        }
    }
} 