function Rectangle(width, height, startingPointX, startingPointY, velx, vely, xPhysicsBehavior, yPhysicsBehavior, xBoundaryBehavior, yBoundaryBehavior, name, color, dieBehavior) {
    this.width = width;
    this.height = height;
    this.x = startingPointX;
    this.y = startingPointY;
    this.maxY = 0;
    this.velx = velx;
    this.vely = vely;

    this.name = name;
    this.color = color || '#000';
    this.isBottomTouching = false;
    this.canBlink = true;

    // this.XPhysicsBehavior = xPhysicsBehavior || XPhysicsBehaviorNone;
    // this.YPhysicsBehavior = yPhysicsBehavior || YPhysicsBehaviorNone;
    // this.XBoundaryBehavior = xBoundaryBehavior || XBoundaryBehaviorNone;
    // this.YBoundaryBehavior = yBoundaryBehavior || YBoundaryBehaviorNone;
    // this.DieBehavior = dieBehavior || OutOfCanvasDieBehavior;
}

Rectangle.prototype.moveX = function () {
    this.x += this.velx;

    // this.XBoundaryBehavior(this);
    // this.XPhysicsBehavior(this);
}

Rectangle.prototype.moveY = function () {
    this.y +=this.vely;
    // this.YBoundaryBehavior(this);
    // this.YPhysicsBehavior(this); 
}

Rectangle.prototype.die = function() {
    // this.DieBehavior(this);
}

Rectangle.prototype.update = function () {
    this.moveX();
    this.moveY();
    this.die();
}

Rectangle.prototype.draw = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.name === playerObjectType) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect((playerFaceDirection === 1) ? this.x + this.width - 10 : this.x , this.y + 2, 10,5);
    }
}