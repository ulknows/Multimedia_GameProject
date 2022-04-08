//environment
var game
var background
var screenWidth = 1800
var screenHeight = 900
var stage = 1

//setting
var bgSound = true

//character
var character

//entity
var warp;
var countMon = 2
var monster = []
var killedCondition = 0
var killedCollision = 0

var upgradeCount = 10
var boss;
var cooldown = 0
var maxCooldown = 100
var missile;

//debug
var debug = false
var killedDebug = 0
var startStage = 3

if (debug) {
    killedCondition = killedDebug
    stage = 3
}

function init() {
    //game and background
    if (stage == 1) {
        game = new Scene()
        background = new Sprite(game, "./environment/map_1.png", screenWidth, screenHeight)
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
    } else if (stage == 2) {
        if (!debug) {
            background.changeImage("./environment/map_2.png")
        } else {
            game = new Scene()
            background = new Sprite(game, "./environment/map_2.png", screenWidth, screenHeight)
            background.setSpeed(0, 0)

            //monster and character
            character = Player()
            for (let i = 0; i < countMon; i++) {
                monster[i] = new Monster()
            }

            buildSound();

            //game settings
            game.start();
        }

        character.setPosition(440, 380)

        //monster and character
        for (let i = 0; i < countMon; i++) {
            monster[i] = new Monster()
        }
    } else if (stage == 3) {
        if (!debug) {
            background.changeImage("./environment/map_3.png")
        } else {
            game = new Scene()
            background = new Sprite(game, "./environment/map_3.png", screenWidth, screenHeight)
            background.setSpeed(0, 0)

            //monster and character
            character = Player()
            for (let i = 0; i < countMon; i++) {
                monster[i] = new Monster()
            }

            buildSound();

            //game settings
            game.start();
        }

        character.setPosition(440, 380)

        //monster and character
        for (let i = 0; i < countMon; i++) {
            monster[i] = new Monster()
        }
        missile = new Missile();
    }
}

var created = false

function update() {
    //game update
    game.clear()
    background.update()
    if (bgSound) {
        backgroundSound.play()
    }

    //character update
    character.checkKeys()
    character.update()
    character.fireball.update()
    character.fireball.positionCheck()

    if (stage == 3) {
        if (character.killedCount >= killedCondition && spawnboss == false) {
            boss = new Boss();
            spawnboss = true
        }

        if (character.killedCount >= killedCondition) {
            boss.wriggle()
            boss.update()
            missile.update();
        }
    }

    if (spawnboss) {
        missile.checkCollision()
    }

    //entity check
    entityCheck()

    document.getElementById("characterStatus").innerHTML = showPlayerStats()
    document.getElementById("monsterStatus").innerHTML = showEntityStats()
}

function buildSound() {
    fireballSound = new Sound("./sound/fireball.mp3")
    flySound = new Sound("./sound/b_fly.wav")
    backgroundSound = new Sound("./sound/videoplayback_1.mp4")
}
var spawnboss = false;

function entityCheck() {
    //monster movement and collision check
    for (let i = 0; i < countMon; i++) {
        monster[i].wriggle()
        monster[i].update()
        character.checkCollision(monster[i], 'monster')
        character.fireball.checkCollision(monster[i], 'monster')
        if (character.killedCount > 4) {
            monster[i].level = parseInt(character.killedCount / 4)
        }
    }

    if (stage == 3) {
        character.checkCollision(boss, 'boss')
        character.fireball.checkCollision(boss, 'boss')
    }

    //check condition to next level
    else if (character.killedCount >= killedCondition) {
        warp = new Warp();
        warp.update()
        warp.checkCollision(character)
    }

}

showPlayerStats = function() {
    var status = "<table><th><strong>Character</strong></th><th></th>"

    status += "<tr><td>Fireball : "
    if (character.fireball.getAvailable()) {
        status += "Available"
    } else {
        status += "Cooldown"
    }
    status += "</td></tr>"

    if (character.skillPoint > 0) {
        status += "<tr><td>Skillpoint : " + character.skillPoint + "<td></tr><tr></tr>"
    }

    status += "<tr><td>HP: " + character.characterHP + "/" + character.characterMHP + "</td><td>";
    if (character.skillPoint > 0) {
        status += "<button>Press (A) to upgrade</button>"
    }
    status += "</td></tr>"

    status += "<tr><td>damage : " + character.characterATK + "</td><td>";
    if (character.skillPoint > 0) {
        status += "<button>Press (S) to upgrade</button>"
    }
    status += "</td></tr>"

    status += "<tr><td>speed: " + character.characterSPD + "</td><td>";
    if (character.skillPoint > 0) {
        status += "<button>Press (D) to upgrade</button>"
    }
    status += "</td></tr>"

    return status;
}

showEntityStats = function() {
    var monsStatus = ""

    if (monster.length <= 5) {
        for (let i = 0; i < monster.length; i++) {
            monsStatus += "<table><th><strong> Monster </strong></th>"

            monsStatus += "<tr><td>Level : " + monster[i].level + "</td></tr>"

            monsStatus += "<tr><td>HP: " + parseInt(monster[i].monsterHP) + "/" + parseInt(monster[i].monsterMHP) + "</td></tr>"

            monsStatus += "<tr><td>damage : " + monster[i].monsterATK + "</td></tr></table><br>";
        }
    } else {
        for (let i = 0; i < 5; i++) {
            monsStatus += "<table><th><strong> Monster </strong></th>"

            monsStatus += "<tr><td>Level : " + monster[i].level + "</td></tr>"

            monsStatus += "<tr><td>HP: " + parseInt(monster[i].monsterHP) + "/" + parseInt(monster[i].monsterMHP) + "</td></tr>"

            monsStatus += "<tr><td>damage : " + monster[i].monsterATK + "</td></tr></table><br>";
        }
    }

    if (spawnboss) {
        monsStatus += "<table><th><strong> Boss </strong></th>"

        monsStatus += "<tr><td>HP: " + parseInt(boss.bossHP) + "/" + parseInt(boss.bossMHP) + "</td></tr>"

        monsStatus += "<tr><td>damage : " + boss.bossATK + "</td></tr></table><br>";
    }

    return monsStatus;
}

function Player() {
    //creating character and set position
    var tCharacter = new Sprite(game, "./entity/player/Carbon Ghost.png", 128, 94)
    tCharacter.setPosition(440, 380)
    tCharacter.setSpeed(0)

    //creating fireball
    tCharacter.fireball = FireBall()
    tCharacter.angleCharacter = "down"

    //setting status of character
    if (debug) {
        tCharacter.characterHP = 900
        tCharacter.characterMHP = 900
        tCharacter.characterATK = 900
        tCharacter.characterDEF = 900
        tCharacter.characterSPD = 900
    } else {
        tCharacter.characterHP = 100
        tCharacter.characterMHP = 100
        tCharacter.characterATK = 50
        tCharacter.characterSPD = 100
    }
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
                this.characterSPD += 10
                this.skillPoint--
                    break;
        }
    }

    tCharacter.checkCollision = function(enemies, type) {
        if (type == 'monster') {
            if (enemies.collidesWith(this)) {
                this.characterHP -= enemies.monsterATK;
                killedCollision++;
                if (this.characterHP <= 0) {
                    game.stop()
                    death()
                }
                enemies.reset()

                for (let i = 0; i < countMon + parseInt(killedCollision / upgradeCount); i++) {
                    monster[i] = new Monster()
                }

                character.skillPoint++;
                character.killedCount++;
            }
        } else if (type == 'boss') {
            if (spawnboss) {
                if (boss.collidesWith(this)) {
                    this.characterHP -= boss.bossATK
                    this.reset()
                }
            }

        }

    }

    tCharacter.reset = function() {
        this.setPosition(440, 380)
    }

    return tCharacter
}

function Warp() {
    var countIncrease = 2

    if (stage == 1) {
        var tWarp = new Sprite(game, "./environment/portal.gif", 100, 200)
        tWarp.setPosition(1200, 400)
        tWarp.setSpeed(0)

        tWarp.checkCollision = function(character) {
            if (this.collidesWith(character)) {
                stage++
                killedCondition = countIncrease + character.killedCount
                init()

            }
        }
        return tWarp

    } else if (stage == 2) {
        var tWarp = new Sprite(game, "./environment/portal.gif", 100, 200)
        tWarp.setPosition(1200, 400)
        tWarp.setSpeed(0)

        tWarp.checkCollision = function(character) {
            if (this.collidesWith(character)) {
                stage++
                killedCondition = countIncrease + character.killedCount
                init()
            }
        }
        return tWarp

    } else if (stage == 3) {
        var tWarp = new Sprite(game, "./environment/portal.gif", 100, 200)
        tWarp.setPosition(1200, 400)
        tWarp.setSpeed(0)

        tWarp.checkCollision = function(character) {
            // stage = 0;
            if (this.collidesWith(character)) {
                console.log('End')
                window.location.href = "./Endgame_Win.html";
            }
        }
        return tWarp
    }

}

function FireBall() {
    var fireballAvailable = true
    var fireballShown = false
    var sFireball = new Sprite(game, "./entity/player/fire_ball.png", 30, 20)
    sFireball.hide()

    // [x, y]
    var lastFireAxis = [0, 0]

    sFireball.getAvailable = function() {
        return fireballAvailable
    }

    sFireball.fire = function() {
        this.show()
        fireballShown = true
        lastFireAxis = [character.x, character.y]

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
        if (sFireball.x < 0 || sFireball.x > 1440 || sFireball.y < 0 || sFireball.y > 900 || !fireballShown || (Math.abs(lastFireAxis[0] - sFireball.x) >= 300) || (Math.abs(lastFireAxis[1] - sFireball.y) >= 300)) {
            fireballAvailable = true
        } else {
            fireballAvailable = false
        }
    }

    sFireball.checkCollision = function(enemies, type) {
        if (type == 'monster') {
            if (enemies.collidesWith(this)) {
                enemies.monsterHP -= character.characterATK
                if (enemies.monsterHP <= 0) {
                    enemies.reset()
                    character.skillPoint++;
                    character.killedCount++;
                    console.log('Skill Point : ' + character.skillPoint)
                }

                this.reset()
            }
        } else if (type == 'boss') {
            if (spawnboss) {
                if (boss.collidesWith(this)) {
                    boss.bossHP -= character.characterATK
                    console.log('boss : ' + boss.bossHP + ' / ' + boss.bossMHP)
                    if (boss.bossHP <= 0) {
                        boss.killed()
                    }

                    this.reset()
                }
            }

        }
    }
    sFireball.reset = function() {
        this.setPosition(1440, 900)
        this.hide()
    }

    return sFireball
}
var lastx = 1300
var lasty = 450

function Boss() {

    var tBoss = new Sprite(game, './entity/monsters/FBoss.gif', 192, 224)
    tBoss.show()
    tBoss.setPosition(lastx, lasty)
    tBoss.setSpeed(0)
    tBoss.monsterHP = 1000

    //stats
    tBoss.bossMHP = 1000
    tBoss.bossHP = tBoss.bossMHP
    tBoss.bossATK = 50

    tBoss.wriggle = function() {
        if (cooldown >= maxCooldown) {
            var atkType = parseInt(Math.random() * 100) % 3
            console.log("atkType: " + atkType)
            if (atkType == 0) {
                console.log('insite 0')
                tBoss.setPosition(1300, 150)
                lastx = 1300
                lasty = 150
                missile.fire()
                cooldown = 0;
            } else if (atkType == 1) {
                console.log('insite 1')
                tBoss.setPosition(1300, 450)
                lastx = 1300
                lasty = 450
                missile.fire()
                cooldown = 0;
            } else if (atkType == 2) {
                console.log('insite 2')
                tBoss.setPosition(1300, 750)
                lastx = 1300
                lasty = 750
                missile.fire()
                cooldown = 0;
            }
        } else {
            cooldown++
        }
    }

    tBoss.killed = function() {
        tBoss.hide()
        window.location.href = './Endgame_Win.html'
    }
    return tBoss
}

function Missile() {
    //Boss fire
    tMissile = new Sprite(game, "./entity/monsters/spell.png", 240, 160);
    tMissile.hide();
    tMissile.reset = function() {
        this.setPosition(boss.x, boss.y);
        this.hide();
    }

    tMissile.fire = function() {
        this.show();
        this.setSpeed(15);
        this.setBoundAction(DIE);
        this.setPosition(boss.x, boss.y);
        this.setAngle(270);
        this.setSpeed(15);
    }

    tMissile.checkCollision = function() {
        if (character.collidesWith(this)) {
            character.characterHP -= boss.bossATK
            if (character.characterHP <= 0) {
                game.stop()
                death()
            }
            this.reset()
        }
    }

    return tMissile;
}

function Monster() {
    //monster control
    var speed = 4
    var hitboxPlayer = 20
    var rangePlayerSpawn = 200

    //creating monster
    if (stage == 1) {
        var tMonster = new Sprite(game, "./entity/monsters/Shadow_Brute.png", 64, 256)
        tMonster.loadAnimation(64, 256, 16, 32)
    } else if (stage == 2) {
        var tMonster = new Sprite(game, "./entity/monsters/Harvey_Beach.png", 64, 128)
        tMonster.loadAnimation(64, 128, 16, 32)
    } else if (stage == 3) {
        var tMonster = new Sprite(game, "./entity/monsters/Angry_Roger.png", 127, 127)
        tMonster.loadAnimation(127, 127, 31.75, 31.75)
    }
    tMonster.generateAnimationCycles()
    tMonster.setAnimationSpeed(500)

    //monster stats
    tMonster.setSpeed(0);
    tMonster.level = 1
    tMonster.monsterMHP = 100;
    tMonster.monsterHP = 100
    tMonster.monsterATK = 10;

    tMonster.lastHP = 0;
    tMonster.defaultHP = 100

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

        do {
            newX = Math.random() * this.cWidth;
            newY = Math.random() * this.cHeight;
            this.setPosition(Math.floor(newX), Math.floor(newY));
            tMonster.monsterMHP = Math.floor(100 * ((this.level / 10) + 1.1))

            tMonster.monsterHP = this.monsterMHP
            tMonster.monsterATK = parseInt(Math.floor(this.monsterHP / 10))
        }
        while (this.x < character.x + rangePlayerSpawn && this.x > character.x - rangePlayerSpawn && this.y < character.y + rangePlayerSpawn && this.y > character.y - rangePlayerSpawn)
    }

    tMonster.reset();
    return tMonster;
}

function death() {
    window.location.href = './Endgame_die.html'
}