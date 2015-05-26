/**
 * ...
 * @author lizhi
 */
class View extends Sprite{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    mouseX: number = 0;
    mouseY: number = 0;
    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        Graphics.ctx = this.ctx;
        canvas.addEventListener("mousemove", (e:MouseEvent) => this.mouseMoveHander(e));
    }

    mouseMoveHander(e:MouseEvent): void {
        var rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }

    render() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update(this);
    }
} 