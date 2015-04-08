/**
 * ...
 * @author lizhi
 */
class Graphics {
    static ctx: CanvasRenderingContext2D;
	filling:boolean;
	lineing:boolean;
    cmds: Array<Cmd> = [];
	sprite:Sprite;
    drawImage(bitmap: BitmapData,sx:number=0,sy:number=0,swidth:number=0,sheight:number=0,x:number=0,y:number=0,width:number=0,height:number=0): void{
		 this.cmds.push(
			swidth==0?
			new Cmd(Graphics.ctx.drawImage, [bitmap.image,sx,sy])
			:
			new Cmd(Graphics.ctx.drawImage, [bitmap.image,sx,sy,swidth,sheight,x,y,width,height])
		);
	}
    beginFill(color: number=0,alpha:number=1) {
        this.cmds.push(
			new SetColorAttribCmd(Graphics.ctx,"fillStyle", color,alpha,this.sprite),
			new Cmd(Graphics.ctx.beginPath, null),
			new SetAttribCmd(this,"filling", true)
		);
    }
    endFill(): void {
        this.cmds.push(
            new Cmd(Graphics.ctx.closePath, null),
			new SetAttribCmd(this,"filling", false)
        )
        if(this.filling){
			this.cmds.push(new Cmd(Graphics.ctx.fill, null));
		}
    }
    lineStyle(thickness: number, color: number=0,alpha:number=1): void {
		if(this.lineing)this.cmds.push(new Cmd(Graphics.ctx.stroke,null));
        this.cmds.push(
            new SetAttribCmd(Graphics.ctx,"lineWidth", thickness),
            new SetColorAttribCmd(Graphics.ctx,"strokeStyle", color,alpha,this.sprite),
			new SetAttribCmd(this,"lineing", thickness!=undefined)
        );
    }
    //public function beginGradientFill(type: String, colors: Array, alphas: Array, ratios: Array, matrix: Matrix= null, spreadMethod: String= "pad", interpolationMethod: String= "rgb", focalPointRatio: Number= 0): void;
    clear(): void{
		this.filling=false;
		this.lineing=false;
		this.cmds=[];
	}
    copyFrom(sourceGraphics: Graphics): void{
        this.cmds = sourceGraphics.cmds.concat();   
    }
	drawCircle(x: number, y: number, radius: number): void{
        this.cmds.push(
            new Cmd(Graphics.ctx.beginPath,null),
            new Cmd(Graphics.ctx.arc, [x, y, radius, 0, Math.PI * 2]),
            new Cmd(Graphics.ctx.closePath, null),
            new Cmd(Graphics.ctx.fill, null)
        );
    }
	//public function drawEllipse(x: Number, y: Number, width: Number, height: Number): void;
	drawRect(x: number, y: number, width: number, height: number): void{
		if(this.filling)this.cmds.push(new Cmd(Graphics.ctx.fillRect, [x, y, width, height]));
		if(this.lineing)this.cmds.push(new Cmd(Graphics.ctx.strokeRect, [x, y, width, height]));
    }
    //public function drawRoundRect(x: Number, y: Number, width: Number, height: Number, ellipseWidth: Number, ellipseHeight: Number= null): void;
    lineTo(x: number, y: number): void {
        this.cmds.push(
            new Cmd(Graphics.ctx.lineTo, [x, y])
        );
    }

    moveTo(x: number, y: number): void {
        this.cmds.push(
            new Cmd(Graphics.ctx.moveTo, [x, y])
            );
    }
	
	curveTo(controlX:Number, controlY:Number, anchorX:Number, anchorY:Number): void {
        this.cmds.push(
            new Cmd(Graphics.ctx.quadraticCurveTo, [controlX,controlY, anchorX,anchorY])
        );
    }
	cubicCurveTo(controlX1: Number, controlY1: Number, controlX2: Number, controlY2: Number, anchorX: Number, anchorY: Number): void {
        this.cmds.push(
            new Cmd(Graphics.ctx.bezierCurveTo, [controlX1, controlY1,controlX2,controlY2,anchorX,anchorY])
        );
    }

    update() {
		this.lineing=false;
		this.filling=false;
		if(!this.filling)
		Graphics.ctx.beginPath();
        for (var key in this.cmds) {
            this.cmds[key].update();
        }
		Graphics.ctx.closePath();
        if(this.filling)Graphics.ctx.fill();
        if(this.lineing)Graphics.ctx.stroke();
    }
} 

class Cmd {
    cmd: Function;
    args: Array<any>;
    constructor(cmd: Function, args: Array<any>) {
        this.cmd = cmd;
        this.args= args;
    }
    update() {
        this.cmd.apply(Graphics.ctx, this.args);
    }
}

class SetAttribCmd extends Cmd {
	target:any;
    name: string;
    value: any;
    constructor(target:any,name: string, value: any) {
        super(null,null);
		this.target=target;
        this.name = name;
        this.value = value;
		this.update();
    }
    update() {
        this.target[this.name] = this.value;
    }
}

class SetColorAttribCmd extends SetAttribCmd {
	target:any;
    name: string;
    value: any;
	color:number;
	alpha:number;
	sprite:Sprite;
    constructor(target:any,name: string, color: number,alpha:number,sprite:Sprite) {
		this.color=color;
		this.alpha=alpha;
		this.sprite=sprite;
        super(target,name,null);
    }
    update() {
        this.value="rgba("+(this.color>>16&0xff)+","+(this.color>>8&0xff)+","+(this.color&0xff)+","+this.alpha*this.sprite.alpha+")";
		super.update();
    }
}