var game
var background
var character
var fireball
var angleCharacter

//environment
var screenWidth = 1800
var screenHeight = 900

var countMon = 2
var monster = []

var warp;

var skillPoint = 0;
var killed = 0;

function init() {
    game = new Scene()
    background = new Sprite(game, "map_1.png", screenWidth, screenHeight)
    character = new Player()
    fireball = new FireBall()
    for (let i = 0; i < countMon; i++) {
        monster[i] = new Monster()
    }


    background.setSpeed(0, 0)
    background.setPosition(900, 450)

    //start paused
    for (let i = 0; i < countMon; i++) {
        monster[i].wriggle()
    }
    game.start();
} // end init

var created = false

function update() {
    game.clear()
    character.checkKeys()

    for (let i = 0; i < countMon; i++) {
        monster[i].wriggle()
    }

    if (killed >= 2) {
        warp = new Warp();
    }

    background.update()
    character.update()
    fireball.update()
    fireball.positionCheck()

    document.getElementById("characterStatus").innerHTML = showStats()

    if (killed >= 2) {
        warp.update()
        warp.checkCollision(character)
    }
    for (let i = 0; i < countMon; i++) {
        monster[i].update()
        character.checkCollision(monster[i])
        fireball.checkCollision(monster[i])
    }
} // end update

showStats = function() {
    var status = "<table><th><strong>Character</strong></th><th></th>"
    status += "<tr><td>HP: " + character.characterHP + "/" + character.characterMHP + "</td><td>";
    if (skillPoint > 0) {
        status += "<button id=\"upgradeHP\" onclick=\"upgrade(1)\">+</div>"
    }
    status += "</td></tr>"

    status += "<tr><td>damage : " + character.characterATK + "</td><td>";
    if (skillPoint > 0) {
        status += "<button id=\"upgradeATK\">+</button>"
    }
    status += "</td></tr>"

    status += "<tr><td>defend : " + character.characterDEF + "</td><td>";
    if (skillPoint > 0) {
        status += "<button id=\"upgradeDEF\">+</button>"
    }
    status += "</td></tr>"

    status += "<tr><td>speed: " + character.characterSPD + "</td><td>";
    if (skillPoint > 0) {
        status += "<button id=\"upgradeSPD\">+</button>"
    }
    status += "</td></tr>"

    return status;
}

function upgrade(status) {
    switch (status) {
        case (1):
            character.characterMHP += 10
            character.characterHP = character.characterMHP
            break;
        case (2):
            character.characterATK += 10
            break;
        case (3):
            character.characterDEF += 10
            break;
        case (4):
            character.characterSPD += 10
            break;
    }
}

function Player() {
    var tCharacter = new Sprite(game, "Carbon Ghost.png", 128, 94)
    tCharacter.setPosition(440, 380)

    tCharacter.characterHP = 100
    tCharacter.characterMHP = 100
    tCharacter.characterATK = 50
    tCharacter.characterDEF = 50
    tCharacter.characterSPD = 50

    tCharacter.loadAnimation(64, 94, 16, 23)
    tCharacter.generateAnimationCycles()
    tCharacter.renameCycles(new Array("down", "right", "up", "left"))
    tCharacter.setAnimationSpeed(500)


    var lastPosition = [tCharacter.x, tCharacter.y]
    tCharacter.setSpeed(0)
    tCharacter.pauseAnimation()
    tCharacter.setCurrentCycle("down")

    tCharacter.checkKeys = function() {
        if (keysDown[K_LEFT]) {
            angleCharacter = 'left'
            tCharacter.playAnimation()
            tCharacter.changeXby(-3)
            tCharacter.setMoveAngle(270)
            tCharacter.setCurrentCycle("left")
        }
        if (keysDown[K_RIGHT]) {
            angleCharacter = 'right'
            tCharacter.playAnimation()
            tCharacter.changeXby(3)
            tCharacter.setMoveAngle(90)
            tCharacter.setCurrentCycle("right")
        }
        if (keysDown[K_UP]) {
            angleCharacter = 'up'
            tCharacter.playAnimation()
            tCharacter.changeYby(-3)
            tCharacter.setMoveAngle(0)
            tCharacter.setCurrentCycle("up")
        }
        if (keysDown[K_DOWN]) {
            angleCharacter = 'down'
            tCharacter.playAnimation()
            tCharacter.changeYby(3)
            tCharacter.setMoveAngle(180)
            tCharacter.setCurrentCycle("down")
        }
        if (keysDown[K_SPACE]) {
            if (fireball.getAvailable()) {
                fireball.fire()
            }
        }
    }

    tCharacter.checkCollision = function(monster) {
        if (monster.collidesWith(this)) {
            this.characterHP -= 20;
            console.log(this.characterHP + ' / ' + this.characterMHP)
            if (this.characterHP <= 0) {
                game.stop()
            }
            monster.reset()
        }
    }





    return tCharacter
}

function Warp() {
    var tWarp = new Sprite(game, "./portal.gif", 100, 200)
    tWarp.setPosition(1200, 400)
    tWarp.setSpeed(0)

    tWarp.checkCollision = function(character) {
        if (this.collidesWith(character)) {
            window.location.href = "./Stage_2.html";
        }
    }

    return tWarp
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
            monster.reset()
            skillPoint++;
            killed++;
            console.log('Skill Point : ' + skillPoint)
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
    var speed = 10
    var hitboxPlayer = 20
    var rangePlayerSpawn = 200

    var tMonster = new Sprite(game, "Shadow Brute.png", 64, 256);
    tMonster.loadAnimation(64, 256, 16, 32)
    tMonster.generateAnimationCycles()
    tMonster.setAnimationSpeed(500)

    tMonster.setSpeed(0);
    tMonster.wriggle = function() {
            //change direction by some random amount
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
            // console.log('Character [' + character.x + ' , ' + character.y + ']')
            // console.log('Monster [' + this.x + ' , ' + this.y + ']')
        } // end wriggle

    tMonster.reset = function() {
            //set new random position
            do {
                newX = Math.random() * this.cWidth;
                newY = Math.random() * this.cHeight;
                this.setPosition(Math.floor(newX), Math.floor(newY));
            } while (this.x < character.x + rangePlayerSpawn && this.x > character.x - rangePlayerSpawn && this.y < character.y + rangePlayerSpawn && this.y > character.y - rangePlayerSpawn)
        } // end reset

    tMonster.reset();
    return tMonster;
}