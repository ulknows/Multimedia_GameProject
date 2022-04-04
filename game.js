//environment
var game
var background
var screenWidth = 1800
var screenHeight = 900
var state = 1

//setting
var bgSound = false

//character
var character

//entity
var warp;
var countMon = 2
var monster = []
var killedCondition = 2

function init() {
    //game and background
    if (state == 1) {
        game = new Scene()
        background = new Sprite(game, "map_1.png", screenWidth, screenHeight)
        background.setSpeed(0, 0)
        background.setPosition(900, 450)

        //monster and character
        character = Player()
        for (let i = 0; i < countMon; i++) {
            monster[i] = new Monster()
        }

        buildSound();

        //game settings
        game.start();
    } else if (state == 2) {
        background.changeImage("map_2.png")
        character.setPosition(440, 380)

        //monster and character
        for (let i = 0; i < countMon; i++) {
            monster[i] = new Monster()
        }

        //game settings
        killedCondition += 4
    } else if (state == 3) {
        background.changeImage("map_3.png")
        character.setPosition(440, 380)

        //monster and character
        for (let i = 0; i < countMon; i++) {
            monster[i] = new Monster()
        }

        //game settings
        killedCondition += 4
    }
}

var created = false

function update() {
    if (state == 1) {
        //game update
        game.clear()
        background.update()
        if (bgSound) {
            backgroundSound.play()
        }

        //entity check
        entityCheck()

        //character update
        character.checkKeys()
        character.update()
        character.fireball.update()
        character.fireball.positionCheck()

        document.getElementById("characterStatus").innerHTML = showStats()
    } else if (state == 2) {
        //game update
        game.clear()
        background.update()
        if (bgSound) {
            backgroundSound.play()
        }

        //entity check
        entityCheck()

        //character update
        character.checkKeys()
        character.update()
        character.fireball.update()
        character.fireball.positionCheck()

        document.getElementById("characterStatus").innerHTML = showStats()
    }
}

function buildSound() {
    fireballSound = new Sound("fireball.mp3")
    flySound = new Sound("b_fly.wav")
    backgroundSound = new Sound("videoplayback_1.mp4")
}

function entityCheck() {
    //monster movement and collision check
    for (let i = 0; i < countMon; i++) {
        monster[i].wriggle()
        monster[i].update()
        character.checkCollision(monster[i])
        character.fireball.checkCollision(monster[i])
    }

    //check condition to next level
    if (character.killedCount >= killedCondition) {
        warp = new Warp();
        warp.update()
        warp.checkCollision(character)
    }
}

showStats = function() {
    var status = "<table><th><strong>Character</strong></th><th></th>"
    if (character.skillPoint > 0) {
        status += "<tr><td>Skillpoint : " + character.skillPoint + "<td></tr><tr></tr>"
    }

    status += "<tr><td>HP: " + character.characterHP + "/" + character.characterMHP + "</td><td>";
    if (character.skillPoint > 0) {
        status += "<button id=\"upgradeHP\">Press (A) to upgrade</button>"
    }
    status += "</td></tr>"

    status += "<tr><td>damage : " + character.characterATK + "</td><td>";
    if (character.skillPoint > 0) {
        status += "<button id=\"upgradeATK\">Press (S) to upgrade</button>"
    }
    status += "</td></tr>"

    status += "<tr><td>defend : " + character.characterDEF + "</td><td>";
    if (character.skillPoint > 0) {
        status += "<button id=\"upgradeDEF\">Press (D) to upgrade</button>"
    }
    status += "</td></tr>"

    status += "<tr><td>speed: " + character.characterSPD + "</td><td>";
    if (character.skillPoint > 0) {
        status += "<button id=\"upgradeSPD\">Press (F) to upgrade</button>"
    }
    status += "</td></tr>"

    return status;
}

function Player() {
    //creating character and set position
    var tCharacter = new Sprite(game, "Carbon Ghost.png", 128, 94)
    tCharacter.setPosition(440, 380)
    tCharacter.setSpeed(0)

    //creating fireball
    tCharacter.fireball = FireBall()
    tCharacter.angleCharacter = "down"

    //setting status of character
    tCharacter.characterHP = 100
    tCharacter.characterMHP = 100
    tCharacter.characterATK = 50
    tCharacter.characterDEF = 50
    tCharacter.characterSPD = 100
    tCharacter.skillPoint = 0
    tCharacter.killedCount = 0;

    //animation of character
    tCharacter.loadAnimation(64, 94, 16, 23)
    tCharacter.generateAnimationCycles()
    tCharacter.renameCycles(new Array("down", "right", "up", "left"))
    tCharacter.setAnimationSpeed(500)
    tCharacter.setCurrentCycle("down")
    tCharacter.pauseAnimation()

    tCharacter.checkKeys = function() {
        characterMovementSpeed = Math.floor((this.characterSPD / 100) * 2.5)
        if (keysDown[K_LEFT]) {
            angleCharacter = 'left'
            tCharacter.playAnimation()
            tCharacter.changeXby(0 - characterMovementSpeed)
            tCharacter.setMoveAngle(270)
            tCharacter.setCurrentCycle("left")
        }
        if (keysDown[K_RIGHT]) {
            angleCharacter = 'right'
            tCharacter.playAnimation()
            tCharacter.changeXby(characterMovementSpeed)
            tCharacter.setMoveAngle(90)
            tCharacter.setCurrentCycle("right")
        }
        if (keysDown[K_UP]) {
            angleCharacter = 'up'
            tCharacter.playAnimation()
            tCharacter.changeYby(0 - characterMovementSpeed)
            tCharacter.setMoveAngle(0)
            tCharacter.setCurrentCycle("up")
        }
        if (keysDown[K_DOWN]) {
            angleCharacter = 'down'
            tCharacter.playAnimation()
            tCharacter.changeYby(characterMovementSpeed)
            tCharacter.setMoveAngle(180)
            tCharacter.setCurrentCycle("down")
        }
        if (keysDown[K_LEFT] || keysDown[K_RIGHT] || keysDown[K_UP] || keysDown[K_DOWN]) {
            flySound.play()
        }

        if (keysDown[K_SPACE]) {
            if (this.fireball.getAvailable()) {
                this.fireball.fire()
                fireballSound.play()
            }
        }

        if (this.skillPoint > 0) {
            if (keysDown[K_A]) {
                this.upgrade(1)
            } else if (keysDown[K_S]) {
                this.upgrade(2)
            } else if (keysDown[K_D]) {
                this.upgrade(3)
            } else if (keysDown[K_F]) {
                this.upgrade(4)
            }
        }
    }

    tCharacter.upgrade = function(status) {
        switch (status) {
            case (1):
                this.characterMHP += 10
                this.characterHP = this.characterMHP
                this.skillPoint--
                    break;
            case (2):
                this.characterATK += 10
                this.skillPoint--
                    break;
            case (3):
                this.characterDEF += 10
                this.skillPoint--
                    break;
            case (4):
                this.characterSPD += 10
                this.skillPoint--
                    break;
        }
    }

    tCharacter.checkCollision = function(monster) {
        if (monster.collidesWith(this)) {
            this.characterHP -= monster.monsterATK;
            console.log(this.characterHP + ' / ' + this.characterMHP)
            if (this.characterHP <= 0) {
                game.stop()
            }
            monster.reset()
            character.skillPoint++;
            character.killedCount++;
        }
    }

    return tCharacter
}

function Warp() {
    if (state == 1) {
        var tWarp = new Sprite(game, "./portal.gif", 100, 200)
        tWarp.setPosition(1200, 400)
        tWarp.setSpeed(0)

        tWarp.checkCollision = function(character) {
            if (this.collidesWith(character)) {
                state++
                killedCondition = 10 + character.killedCount
                init()

            }
        }

        return tWarp
    } else if (state == 2) {
        var tWarp = new Sprite(game, "./portal.gif", 100, 200)
        tWarp.setPosition(1200, 400)
        tWarp.setSpeed(0)

        tWarp.checkCollision = function(character) {
            if (this.collidesWith(character)) {
                state++
                killedCondition = 10 + character.killedCount
                init()
            }
        }

        return tWarp
    } else {


        return tWarp
    }
}

function FireBall() {
    var fireballAvailable = true
    var fireballShown = false
    var sFireball = new Sprite(game, "./element/fire_ball.png", 30, 20)
    sFireball.hide()

    sFireball.getAvailable = function() {
        return fireballAvailable
    }

    sFireball.fire = function() {
        this.show()
        fireballShown = true

        this.setSpeed(15)
        this.setBoundAction(DIE)
        this.setPosition(character.x, character.y)
        switch (angleCharacter) {
            case ('up'):
                this.setAngle(0)
                break
            case ('down'):
                this.setAngle(180)
                break
            case ('left'):
                this.setAngle(270)
                break
            case ('right'):
                this.setAngle(90)
                break
        }
        this.setSpeed(15)
    }

    sFireball.positionCheck = function() {
        if (sFireball.x < 0 || sFireball.x > 1440 || sFireball.y < 0 || sFireball.y > 900 || !fireballShown) {
            fireballAvailable = true
        } else {
            fireballAvailable = false
        }
    }

    sFireball.checkCollision = function(monster) {
        if (monster.collidesWith(this)) {

            monster.monsterHP -= character.characterATK
            console.log(monster.monsterHP + '/' + monster.monsterMHP)
            if (monster.monsterHP <= 0) {
                monster.reset()
                character.skillPoint++;
                character.killedCount++;
                console.log('Skill Point : ' + character.skillPoint)
            }

            this.reset()
        }
    }
    sFireball.reset = function() {
        this.setPosition(1440, 900)
        this.hide()
    }

    return sFireball
}

function Monster() {
    //monster control
    var speed = 4
    var hitboxPlayer = 20
    var rangePlayerSpawn = 200

    //creating monster
    if (state == 1) {
        var tMonster = new Sprite(game, "Shadow Brute.png", 64, 256);
        tMonster.loadAnimation(64, 256, 16, 32)
    } else if (state == 2) {
        var tMonster = new Sprite(game, "Harvey_Beach.png", 64, 128);
        tMonster.loadAnimation(64, 128, 16, 32)
    }
    tMonster.generateAnimationCycles()
    tMonster.setAnimationSpeed(500)

    //monster stats
    tMonster.setSpeed(0);
    tMonster.monsterMHP = Math.floor((((Math.random() * 100) % 25) - 35) + character.characterMHP);
    tMonster.monsterHP = this.monsterMHP
    tMonster.monsterATK = Math.floor(this.monsterHP / 10);


    tMonster.wriggle = function() {
        //change direction
        if (this.x > character.x + hitboxPlayer) {
            this.changeXby(0 - speed)
        } else if (this.x < character.x - hitboxPlayer) {
            this.changeXby(speed)
        }
        if (this.y > character.y + hitboxPlayer) {
            this.changeYby(Math.floor(0 - (speed / (screenWidth / screenHeight))))
        } else if (this.y < character.y - hitboxPlayer) {
            this.changeYby(Math.floor(speed / (screenWidth / screenHeight)))
        }
    }
    tMonster.reset = function() {
        //set new random position
        do {
            newX = Math.random() * this.cWidth;
            newY = Math.random() * this.cHeight;
            this.setPosition(Math.floor(newX), Math.floor(newY));
            tMonster.monsterMHP = ((Math.random() % 25) - 35) + character.characterMHP;
            tMonster.monsterHP = this.monsterMHP
            tMonster.monsterATK = Math.floor(this.monsterHP / 10);
        } while (this.x < character.x + rangePlayerSpawn && this.x > character.x - rangePlayerSpawn && this.y < character.y + rangePlayerSpawn && this.y > character.y - rangePlayerSpawn)
    }
    tMonster.reset();
    return tMonster;
}