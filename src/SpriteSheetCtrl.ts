/**
 * ...
 * @author lizhi
 */
class SpriteSheetCtrl extends Ctrl{
	target:Sprite;
	fps:number;
	frame:number =0;
	sheet:SpriteSheet;
	currentAnimationName:string;
	constructor(target:Sprite,sheet:SpriteSheet,fps:number=1) {
		super();
		this.target=target;
		this.sheet=sheet;
		this.fps=fps;
	}
	update():void{
		this.frame+=this.fps;
		this.sheet.update(this.target,this.frame,this.currentAnimationName);
	}
	
	play(name:string,frame:number=0):void{
		this.currentAnimationName=name;
		this.frame=frame;
	}
}