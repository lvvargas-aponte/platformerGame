class Sprite {
    constructor({
                    position,
                    imageSrc,
                    frameRate = 1,
                    animations,
                    frameBuffer = 2,
                    loop = true,
                    autoplay = true
    }) {
        this.position = position;
        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
            this.width = this.image.width / this.frameRate;
            this.height = this.image.height;
        }
        this.image.src = imageSrc;
        this.loaded = false;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.frameBuffer = frameBuffer;
        this.animations = animations;
        this.loop = loop;
        this.autoplay = autoplay;
        this.currentAnimation;

        if (this.animations) {
            for (let key in this.animations) {
                const image = new Image();
                image.src = this.animations[key].imageSrc;
                this.animations[key].image = image;
            }
        }
    }

    draw() {
        if (!this.loaded) return;
        //animation happens here, not the best so could be enhanced
        const cropBox = {
            position: {
                x: this.width * this.currentFrame,
                y: 0,
            },
            width: this.width,
            height: this.height,
        }
        c.drawImage(
            this.image,
            cropBox.position.x,
            cropBox.position.y,
            cropBox.width,
            cropBox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        this.updateFrames();
    }

    play() {
        this.autoplay = true;
    }

    updateFrames() {

        if (!this.autoplay) return;
        this.elapsedFrames++;

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) this.currentFrame++
            else if (this.loop) this.currentFrame = 0;
        }
        //below same as in (this.currentAnimation && this.currentAnimation.onComplete)
        if (this.currentAnimation?.onComplete) {
            if (this.currentFrame === this.frameRate - 1 && !this.currentAnimation.isActive){
                this.currentAnimation.onComplete();
                this.currentAnimation.isActive = true;
            }

        }


    }

}

class Player extends Sprite {
    constructor({collisionBlocks = [], imageSrc, frameRate, animations, loop}) {
        super({imageSrc, frameRate, animations, loop})
        this.position = {
            x: 200,
            y: 200
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.sides = {
            bottom: this.position.y + this.height
        }
        this.gravity = 1;

        /*this.width = 25;
        this.height = 25;
*/
        this.collisionBlocks = collisionBlocks;
    }

    /*    draw() {
            c.fillStyle = 'blue';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }*/
    update() {
        /*c.fillStyle = 'rgba(0,0,255, 0.5)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);*/
        this.position.x += this.velocity.x;

        this.updateHitbox();

        this.checkForHorizontalCollisions();
        this.applyGravity();

        //this.sides.bottom = this.position.y + this.height;

        //hitbox
        this.updateHitbox();
       /* //hitbox visible location
        c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
*/
        //check for vertical collisions
        this.checkForVerticalCollisions();

    }

    handleInput(keys) {
        if (this.preventInput) return;
       this.velocity.x = 0;
        if (keys.d.pressed) {
            this.switchSprite('runRight');
            this.velocity.x = 5;
            this.lasDirection = 'right';
        } else if (keys.a.pressed) {
            this.switchSprite('runLeft');
            this.velocity.x = -5;
            this.lasDirection = 'left'
        } else {
            if (this.lasDirection == 'left') {
                this.switchSprite('idleLeft')
            } else
                this.switchSprite('idleRight');
        }
    }

    switchSprite(name) {
        if (this.image === this.animations[name].image) return
        this.currentFrame = 0;
        this.image = this.animations[name].image;
        this.frameRate = this.animations[name].frameRate;
        this.frameBuffer = this.animations[name].frameBuffer;
        this.loop = this.animations[name].loop;
        this.currentAnimation = this.animations[name];
    }

    updateHitbox() {
        //hitbox
        this.hitbox = {
            position: {
                x: this.position.x + 58,
                y: this.position.y + 38,
            },
            width: 50,
            height: 50,
        }
    }

    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];
            if (
                //right check
                this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                //left check
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                //top check
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                //bottom check
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                //collision on x-axis moving left
                if (this.velocity.x < 0) {
                    const offset = this.hitbox.position.x - this.position.x;
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                    break;
                }
                if (this.velocity.x > 0) {
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                    this.position.x = collisionBlock.position.x - offset - 0.01;
                    break;
                }

            }
        }
    }

    applyGravity() {
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;
    }

    checkForVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];
            if (
                //right check
                this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                //left check
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                //top check
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                //bottom check
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                //collision on y-axis moving left
                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    const offset = this.hitbox.position.y - this.position.y;
                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                    break;
                }
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
                    this.position.y = collisionBlock.position.y - offset - 0.01;
                    break;
                }

            }
        }
    }
}


