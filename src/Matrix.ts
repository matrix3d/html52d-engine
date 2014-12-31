/**
 * ...
 * @author lizhi
 */

class Matrix{
	public static var DEG_TO_RAD:number=Math.PI/180;
	constructor Matrix(a:number=1, b:number=0, c:number=0, d:number=1, tx:number=0, ty:number=0):void {
		this.setValues(a,b,c,d,tx,ty);
	}
	setValues(a:number, b:number, c:number, d:number, tx:number, ty:number):void {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.tx = tx;
		this.ty = ty;
	}
	
	append(m:Matrix):void {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		if (m.a != 1 || m.b != 0 || m.c != 0 || m.d != 1) {
			this.a  = a1*m.a+c1*m.b;
			this.b  = b1*m.a+d1*m.b;
			this.c  = a1*m.c+c1*m.d;
			this.d  = b1*m.c+d1*m.d;
		}
		this.tx = a1*m.tx+c1*m.ty+this.tx;
		this.ty = b1*m.tx+d1*m.ty+this.ty;
	}

	prepend(m:Matrix):void {
		var a1 = this.a;
		var c1 = this.c;
		var tx1 = this.tx;

		this.a  = m.a*a1+m.c*this.b;
		this.b  = m.b*a1+m.d*this.b;
		this.c  = m.a*c1+m.c*this.d;
		this.d  = m.b*c1+m.d*this.d;
		this.tx = m.a*tx1+m.c*this.ty+m.tx;
		this.ty = m.b*tx1+m.d*this.ty+m.ty;
	}
	rotate(angle:number):void {
		angle = angle*Matrix2D.DEG_TO_RAD;
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);

		var a1 = this.a;
		var b1 = this.b;

		this.a = a1*cos+this.c*sin;
		this.b = b1*cos+this.d*sin;
		this.c = -a1*sin+this.c*cos;
		this.d = -b1*sin+this.d*cos;
	}
	scale(x:number, y:number):void {
		this.a *= x;
		this.b *= x;
		this.c *= y;
		this.d *= y;
	}
	translate(x:number, y:number):void {
		this.tx += this.a*x + this.c*y;
		this.ty += this.b*x + this.d*y;
	}

	identity(){
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
	}

	invert() {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		var tx1 = this.tx;
		var n = a1*d1-b1*c1;

		this.a = d1/n;
		this.b = -b1/n;
		this.c = -c1/n;
		this.d = a1/n;
		this.tx = (c1*this.ty-d1*tx1)/n;
		this.ty = -(a1*this.ty-b1*tx1)/n;
	}
	
	transformPoint (x:number, y:number, pt:any) {
		pt = pt||{};
		pt.x = x*this.a+y*this.c+this.tx;
		pt.y = x*this.b+y*this.d+this.ty;
		return pt;
	}
	decompose (target:any) {
		if (target == null) { target = {}; }
		target.x = this.tx;
		target.y = this.ty;
		target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
		target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

		var skewX = Math.atan2(-this.c, this.d);
		var skewY = Math.atan2(this.b, this.a);

		var delta = Math.abs(1-skewX/skewY);
		if (delta < 0.00001) {
			target.rotation = skewY/Matrix2D.DEG_TO_RAD;
			if (this.a < 0 && this.d >= 0) {
				target.rotation += (target.rotation <= 0) ? 180 : -180;
			}
			//target.skewX = target.skewY = 0;
		} else {
			//target.skewX = skewX/Matrix2D.DEG_TO_RAD;
			//target.skewY = skewY/Matrix2D.DEG_TO_RAD;
		}
		return target;
	}
	
	copy(matrix:Matrix) {
		return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	}
	clone() {
		return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
	}
}