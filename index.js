//canvas and context code
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

let parsedCollisions;
let collisionBlocks;

let background;

let doors;

const player = new Player({
    imageSrc: './images/king/idle.png',
    frameRate: 11,
    animations: {
        idleRight: {
            frameRate: 11,
            frameBuffer: 2,
            loop: true,
            imageSrc: './images/king/idle.png',
        },
        idleLeft: {
            frameRate: 11,
            frameBuffer: 2,
            loop: true,
            imageSrc: './images/king/idleLeft.png',
        },
        runRight: {
            frameRate: 8,
            frameBuffer: 4,
            loop: true,
            imageSrc: './images/king/runRight.png'
        },
        runLeft: {
            frameRate: 8,
            frameBuffer: 4,
            loop: true,
            imageSrc: './images/king/runLeft.png'
        },
        //every time the characted goes through a door the following attributes must be set
        enterDoor: {
            frameRate: 8,
            frameBuffer: 4,
            loop: false,
            imageSrc: './images/king/enterDoor.png',
            onComplete: () => {
                //console.log('animation completed')
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level++
                        if (level === 4) {
                            level = 1;
                        }
                        levels[level].init();
                        player.switchSprite('idleRight');
                        player.preventInput = false;
                        gsap.to(overlay, {
                            opacity: 0,
                        })
                    }
                })
            },
        },
    },
});

let level = 1;
let levels = {
    1: {
        init: () => {
            parsedCollisions = collisionsLevel1.parse2D();
            collisionBlocks = parsedCollisions.createObjectFrom2D();
            player.collisionBlocks = collisionBlocks;

            if (player.currentAnimation)
                player.currentAnimation.isActive = false;

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,

                },
                imageSrc: './images/backgroundLevel1.png',
            })
            doors = [
                new Sprite({
                    position: {
                        x: 763,
                        y: 273,
                    },
                    imageSrc: './images/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false
                })
            ]
        }
    },
    2: {
        init: () => {
            parsedCollisions = collisionsLevel2.parse2D();
            collisionBlocks = parsedCollisions.createObjectFrom2D();
            player.collisionBlocks = collisionBlocks;
            player.position.x = 96;
            player.position.y = 140;

            if (player.currentAnimation)
                player.currentAnimation.isActive = false;

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,

                },
                imageSrc: './images/backgroundLevel2.png',
            })
            doors = [
                new Sprite({
                    position: {
                        x: 772,
                        y: 336,
                    },
                    imageSrc: './images/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false
                })
            ]
        }
    },
    3: {
        init: () => {
            parsedCollisions = collisionsLevel3.parse2D();
            collisionBlocks = parsedCollisions.createObjectFrom2D();
            player.collisionBlocks = collisionBlocks;
            player.position.x = 786;
            player.position.y = 212;

            if (player.currentAnimation)
                player.currentAnimation.isActive = false;

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,

                },
                imageSrc: './images/backgroundLevel3.png',
            })
            doors = [
                new Sprite({
                    position: {
                        x: 176,
                        y: 335,
                    },
                    imageSrc: './images/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false
                })
            ]
        }
    },
}
//const collisionsBlocks = [];






const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
const overlay = {
    opacity: 0,
}
function animate() {
    window.requestAnimationFrame(animate);

    background.draw();
    /*collisionBlocks.forEach(CollisionBlock => {
        CollisionBlock.draw();
    });*/

    doors.forEach((door) => {
        door.draw();
    });

    player.handleInput(keys);
    player.draw();
    player.update();

    c.save();
    c.globalAlpha = overlay.opacity;
    c.fillStyle = 'black';
    c.fillRect(0,0, canvas.width, canvas.height);
    c.restore();


}

levels[level].init();
animate();

