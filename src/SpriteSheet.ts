/**
 * ...
 * @author lizhi
 */

class SpriteSheet{
	image:BitmapData;
	imageWidth:number;
	imageHeight:number;
	numCols:number;
	numRows:number;
	centerX:number;
	centerY:number;
	animations:any={};
	animationNames:Array<string>=[];
	constructor(image:BitmapData,imageWidth:number,imageHeight:number,numCols:number,numRows:number,centerX:number=0,centerY:number=0) {
		this.image=image;
		this.imageWidth=imageWidth;
		this.imageHeight=imageHeight;
		this.numCols=numCols;
		this.numRows=numRows;
		this.centerX=centerX;
		this.centerY=centerY;
	}
	update(target:Sprite,frame:number,currentAnimationName:string):void{
		target.graphics.clear();
		var frames= this.animations[currentAnimationName];
		if(frames){
			var f =<number>frames[Math.floor(frame)%frames.length];
		}else{
			var f = Math.floor(frame)%(this.numCols*this.numRows);
		}
		
		var ox = f%this.numCols;
		var oy=Math.floor(f/this.numCols);
		var sw =this.imageWidth/this.numCols;
		var sh=this.imageHeight/this.numRows;
		target.graphics.drawImage(this.image,sw*ox,sh*oy,sw,sh,-this.centerX,-this.centerY,sw,sh);
	}
	addAnimation(name:string,frames:Array<number>):void{
		this.animations[name]=frames;
		this.animationNames.push(name);
	}
}