class Graphics {
    static ctx: CanvasRenderingContext2D;
    cmds: Array<Cmd> = [];
    //beginBitmapFill(bitmap: BitmapData, matrix: Matrix= null, repeat: Boolean= true, smooth: Boolean= false): void;/
    beginFill(color: any) {
        this.cmds.push(new SetAttribCmd("fillStyle", color));
    }
    //public function beginGradientFill(type: String, colors: Array, alphas: Array, ratios: Array, matrix: Matrix= null, spreadMethod: String= "pad", interpolationMethod: String= "rgb", focalPointRatio: Number= 0): void;
    clear(): void{}
    copyFrom(sourceGraphics: Graphics): void{
        this.cmds = sourceGraphics.cmds.concat();   
    }
    //public function cubicCurveTo(controlX1: Number, controlY1: Number, controlX2: Number, controlY2: Number, anchorX: Number, anchorY: Number): void;/
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
        this.cmds.push(
            new Cmd(Graphics.ctx.fillRect, [x, y, width, height]),
            new Cmd(Graphics.ctx.strokeRect, [x, y, width, height])
        );
    }
    //public function drawRoundRect(x: Number, y: Number, width: Number, height: Number, ellipseWidth: Number, ellipseHeight: Number= null): void;
    endFill(): void {
        this.cmds.push(
            new Cmd(Graphics.ctx.closePath, null),
            new Cmd(Graphics.ctx.fill, null)
        )
        this.beginFill("#000");
    }
    lineStyle(thickness: number, color: any): void {
        this.cmds.push(
            new SetAttribCmd("lineWidth", thickness),
            new SetAttribCmd("strokeStyle", color)
        );
    }
    lineTo(x: number, y: number): void {
        this.cmds.push(
            new Cmd(Graphics.ctx.lineTo, [x, y])
        );
    }

    moveTo(x: number, y: number): void {
        this.cmds.push(
            new Cmd(Graphics.ctx.beginPath,null),
            new Cmd(Graphics.ctx.moveTo, [x, y])
            );
    }

    update() {
        Graphics.ctx.fillStyle = "#000";
        Graphics.ctx.strokeStyle = "#000";
        Graphics.ctx.beginPath();
        for (var key in this.cmds) {
            this.cmds[key].update();
        }
        Graphics.ctx.closePath();
        Graphics.ctx.fill();
        Graphics.ctx.stroke();
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
    name: string;
    value: any;
    constructor(name: string, value: any) {
        super(null,null);
        this.name = name;
        this.value = value;
    }
    update() {
        Graphics.ctx[this.name] = this.value;
    }
}