class CollisionBlock {
    constructor({position}) {
        this.position = position;
        this.width = 64;
        this.height = 64;
    }
    draw() {
        //collision blocks visibility must be 0 transparency when in PROD
        c.fillStyle = 'rgba(255, 0, 0, 0.25)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}