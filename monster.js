//frogLib.js
//Objects for frog game



function Monster(){
    tMonster = new Sprite(game, "Shadow Brute_1.png", 40, 40);
    tMonster.setSpeed(10);
    tMonster.wriggle = function(){
        //change direction by some random amount
        newDir = (Math.random() * 90) - 45;
        this.changeAngleBy(newDir);
    } // end wriggle
    tMonster.reset = function(){
        //set new random position
        newX = Math.random() * this.cWidth;
        newY = Math.random() * this.cHeight;
        this.setPosition(newX, newY);
    } // end reset
    tMonster.reset();
    return tMonster;
  } // end Fly