window.addEventListener('keydown', (event) =>{
    if (player.preventInput) return
    switch (event.key) {
        case 'w':

            for (let i = 0; i < doors.length; i++) {
                const door = doors[i];
                if(
                    player.hitbox.position.x + player.hitbox.width <= door.position.x + door.width &&
                    //left check
                    player.hitbox.position.x >= door.position.x &&
                    //top check
                    player.hitbox.position.y + player.hitbox.height >= door.position.y &&
                    //bottom check
                    player.hitbox.position.y <= door.position.y + door.height
                ) {
                    player.velocity.x = 0;
                    player.velocity.y = 0;
                    player.preventInput = true;
                    player.switchSprite('enterDoor');
                    door.play();
                    return
                }
            }
            //jump velocity of player
            if (player.velocity.y ===0 ){
                player.velocity.y = -20;
            }
            break
        case 'a':
            //moving player to left
            keys.a.pressed = true;

            break
        case 'd':
            //moving player to the right
            keys.d.pressed = true;

            break

        //case 's':
    }
})

window.addEventListener('keyup', (event) =>{
    switch (event.key) {
        case 'a':
            keys.a.pressed = false;

            break

        case 'd':
            //moving player to the right
            keys.d.pressed = false;

            break

        //case 's':
    }
})

window.addEventListener('touchstart', e => {
    console.log('beep')
})
window.addEventListener('touchmove', e => {
    console.log('beep')
})
window.addEventListener('touchend', e => {
    console.log('beep')
})