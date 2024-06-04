//Returns a new Circle object of the specified size with a random position and random velocities.
function Circle(size, x, y, velx, vely, xPhysicsBehavior, yPhysicsBehavior, xBoundaryBehavior, yBoundaryBehavior, dieBehavior, transformBehavior, name, color, doFill, fillColor) {
    this.radius = size;
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.name = name || '';
    this.color = color || '#000';
    this.doFill = doFill || false;
    this.fillColor = fillColor || '#000'; 

    this.XPhysicsBehavior = xPhysicsBehavior || XPhysicsBehaviorNone;
    this.YPhysicsBehavior = yPhysicsBehavior || YPhysicsBehaviorNone;
    this.XBoundaryBehavior = xBoundaryBehavior || XBoundaryBehaviorNone;
    this.YBoundaryBehavior = yBoundaryBehavior || YBoundaryBehaviorNone;
    this.DieBehavior = dieBehavior || function () { };
    this.TransformBehavior = transformBehavior || function () { };
}


Circle.prototype.moveX = function () {
    this.x += this.velx;
}

Circle.prototype.moveY = function () {
    this.y += this.vely;
}

Circle.prototype.die = function () {
    this.DieBehavior(this);
}

Circle.prototype.update = function () {
    this.moveX();
    this.moveY();
    this.TransformBehavior(this);
    this.die();
}

Circle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    if (this.doFill === true) {
        ctx.fillStyle = this.fillColor;
        ctx.fill();
    }
    ctx.strokeStyle = this.color;
    ctx.stroke();
}