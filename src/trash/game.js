var canvas, player, quadTree, ctx;
var scaler, askance, playerFaceDirection;
var leftSpawnTimeoutID, rightSpawnTimeoutID;

var drawObjects = [];
var paused = false;
var previousTime = performance.now();
var rektanglesGame;

var reset = function () {
    previousTime = performance.now();

    askance.reset();

    clearDrawObjectsOfName(enemyObjectType);
    clearDrawObjectsOfName(playerObjectType);
    window.keyState = {};
    scaler.reset();
    window.clearTimeout(rightSpawnTimeoutID);
    window.clearTimeout(leftSpawnTimeoutID);

    rightSpawnLoop();
    leftSpawnLoop();

    playerFaceDirection = 1;

    //make the friendly square
    player = new Rectangle(20, 20, 40, 40, 0, 0, XPhysicsBehaviorNormal, YPhysicsBehaviorNormal, XBoundaryBehaviorInCanvas, YBoundaryBehaviorInCanvas, playerObjectType, playerColor, null);
    drawObjects.push(player);
}

$(function () {

    rektanglesGame = function () {
        //get canvas and set height and width
        canvas = document.getElementById('canvas');
        canvas.setAttribute('width', gameWidth);
        canvas.setAttribute('height', gameHeight);
        ctx = canvas.getContext("2d");

        quadTree = new Quadtree(quadTreeBounds);
        scaler = new Scaler();
        askance = new Askance();

        backgroundMusicAudio.play();

        var desiredFps = 60;
        var desiredUpdateInterval = 1000 / desiredFps;
        var cumulativeDeltaTime = 0;
        var mainloop = function (currentTime) {
            if (!paused) {
                cumulativeDeltaTime += currentTime - previousTime;
                previousTime = currentTime;
        
                while (cumulativeDeltaTime >= desiredUpdateInterval) {
                    buildQuadTree();
                    updateGame(); // Pass elapsed time in seconds
                    cumulativeDeltaTime -= desiredUpdateInterval;
                }
        
                drawGame();
            }
        };

        var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            null;

        var recursiveAnim = function () {
            mainloop(performance.now());
            animFrame(recursiveAnim, canvas);
        };

        // start the mainloop
        reset();
        animFrame(recursiveAnim, canvas);

        $(document).keydown(function (e) {
            if (e.keyCode === 80 || e.keyCode === 27) {
                pauseToggle();
            }
        });

        $(document).on('change', '#sound-enabled-toggle', function () {
            soundToggle();
        });

        $(window).blur(function () {
            pauseToggle(true);
        });
    }
});

function updateGame() {
    //determine if there are any keys pushed at the current point
    keyPressActions();

    //loop for calculating and updating all objects positions/values. 
    for (var i = 0; i < drawObjects.length; i++) {
        var object = drawObjects[i];
        quadTree.insert(new SimpleRectangle(object.x, object.y, object.width || (object.radius * 2), object.height || (object.radius * 2), object.name));
        object.update();

        //roundFloatingPoints Numbers to 2 decimal places
        roundObjectVelocitiesAndPoints(object);
    }
    PlayerDeathTrigger(player);
    scaler.update();
    askance.score += 1 + (scaler.thousandsPlace * 1);
}

function drawGame() {
    //clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(drawGameText(), gameHeight, 0);

    for (var i = 0; i < drawObjects.length; i++) {
        var object = drawObjects[i];
        object.draw();
    }
}

//left the function here in case I need to do anything else but for now it's just clearing.
function buildQuadTree() {
    quadTree.clear();
}



function drawGameText() {
    var scoreCanvas = document.createElement('canvas');
    scoreCanvas.width = gameHeight;
    scoreCanvas.height = gameWidth * .1;
    var scoreCanvasContext = scoreCanvas.getContext('2d');
    scoreCanvasContext.fillStyle = '#FFF';
    if (askance.highScore > 0) {
        scoreCanvasContext.font = "15px Verdana";
        scoreCanvasContext.fillText("High Score", 0, (scoreCanvas.height * .25));
        scoreCanvasContext.font = "20px Verdana";
        scoreCanvasContext.fillText(askance.highScore, 0, (scoreCanvas.height * .5));
    }

    scoreCanvasContext.font = "15px Verdana";
    scoreCanvasContext.fillText("Score", (scoreCanvas.width * .40), (scoreCanvas.height * .25));
    scoreCanvasContext.font = "20px Verdana";
    scoreCanvasContext.fillText(askance.score, (scoreCanvas.width * .40), (scoreCanvas.height * .5));

    scoreCanvasContext.font = "15px Verdana";
    scoreCanvasContext.fillText("Deaths", (scoreCanvas.width * .75), (scoreCanvas.height * .25));
    scoreCanvasContext.font = "20px Verdana";
    scoreCanvasContext.fillText(askance.deaths, (scoreCanvas.width * .75), (scoreCanvas.height * .5));
    return scoreCanvas;
}

function rightSpawnLoop() {
    //spawn rate modifications
    var rightRandomMax = 2500, rightRandomMin = 1500, rightRandomHeight = enemyDeafultHeight, rightRandomWidth = enemyDefaultWidth;
    if (scaler.base > 7250 && scaler.base < 7600) {
        rightRandomMax = 450;
        rightRandomMin = 450;
    }
    else if (scaler.base > 5200 && scaler.base < 5600) {
        rightRandomMax = 550;
        rightRandomMin = 550;
    }
    else if (scaler.base >= 2000 && scaler.base <= 2500) {
        rightRandomMax = 700;
        rightRandomMin = 700;
    }
    else {
        rightRandomMax = rightRandomMax - (scaler.multiplier * 100);
        rightRandomMin = rightRandomMin - (scaler.multiplier * 100);
        rightRandomMin = rightRandomMin < minimumSpawnInterval ? minimumSpawnInterval : rightRandomMin;
    }
    var spawnInterval = Math.round(Math.random() * (rightRandomMax - rightRandomMin)) + rightRandomMin;

    rightSpawnTimeoutID = setTimeout(function () {
        if (!(scaler.base >= 3600 && scaler.base <= 4100) && !(scaler.base > 5350 && scaler.base < 5650) && !(scaler.base > 7000 && scaler.base < 7250)) {
            var velocity = (defaultEnemyRectangleVelocity + scaler.multiplier) * -1;

            //height
            if ((scaler.base >= 2000 && scaler.base <= 2500) || (scaler.base > 4400 && scaler.base < 7600)) {
                //leave height the same as the default height
            }
            else if (scaler.base > 1000 && scaler.base < 3000) {
                rightRandomHeight = getRandomInt(enemyDeafultHeight + 20, enemyHeighestHeight);
            }
            else if (scaler.base > 1000) {
                rightRandomHeight = getRandomInt(enemyDeafultHeight, enemyHeighestHeight);
            }
            if (scaler.base > 5200 && scaler.base < 5350) {
                rightRandomWidth += 40;
            } else {
                rightRandomWidth = getRandomInt(enemyLowestWidth, enemyHeighestWidth);
            }
            var newEnemySpawn = new Rectangle(rightRandomWidth, rightRandomHeight, canvas.width + (distanceOutsideCanvasBeforeDie / 2), canvas.height - rightRandomHeight, Math.round(velocity), 0, null, YPhysicsBehaviorNormal, null, YBoundaryBehaviorInCanvas, enemyObjectType, null, OutOfCanvasDieBehavior);
            drawObjects.push(newEnemySpawn);
        }
        rightSpawnLoop();
    }, spawnInterval);
}

function leftSpawnLoop() {
    var leftRandomMax = 3500, leftRandomMin = 1500, leftRandomHeight = enemyDeafultHeight, leftRandomWidth = enemyDefaultWidth;
    if (scaler.base > 7000 && scaler.base < 7250) {
        leftRandomMax = 475;
        leftRandomMin = 475;
    }
    else if (scaler.base > 5200 && scaler.base < 5600) {
        leftRandomMax = 550;
        leftRandomMin = 550;
    }
    else if (scaler.base >= 3600 && scaler.base <= 4000) {
        leftRandomMax = 650;
        leftRandomMin = 650;
    }
    else {
        leftRandomMax = leftRandomMax - (scaler.multiplier * 100);
        leftRandomMin = leftRandomMin - (scaler.multiplier * 100);
        leftRandomMin = leftRandomMin < minimumSpawnInterval ? minimumSpawnInterval : leftRandomMin;
    }
    var spawnInterval = Math.round(Math.random() * (leftRandomMax - leftRandomMin)) + leftRandomMin;

    leftSpawnTimeoutID = setTimeout(function () {
        if (scaler.base > 2700 && !(scaler.base > 5175 && scaler.base < 5400) && !(scaler.base > 7250 && scaler.base < 7650)) {
            var velocity = defaultEnemyRectangleVelocity + scaler.multiplier;
            if (scaler.base > 7000) {
                //do nothing with the height
            }
            else if (scaler.base > 5400 && scaler.base < 5650) {
                leftRandomHeight -= 40;
            }
            else if (scaler.base > 4500) {
                leftRandomHeight = getRandomInt(enemyLowestHeight, enemyHeighestHeight);
            }
            else if (scaler.base >= 3600 && scaler.base <= 4100) {
                leftRandomHeight += 40;
            }
            var newEnemySpawn = new Rectangle(leftRandomWidth, leftRandomHeight, 0 - (distanceOutsideCanvasBeforeDie / 2), canvas.height - leftRandomHeight, Math.round(velocity), 0, null, YPhysicsBehaviorNormal, null, YBoundaryBehaviorInCanvas, enemyObjectType, null, OutOfCanvasDieBehavior)
            drawObjects.push(newEnemySpawn);
        }
        leftSpawnLoop();
    }, spawnInterval);
}

function pauseToggle(doPause) {
    paused = doPause === true ? true : !paused;
    if (paused) {
        askance.pauseCount += 1;
        if (askance.pauseCount > 75) {
            reset();
        }
        ctx.fillStyle = '#FFF';
        ctx.font = "72px Verdana";
        ctx.fillText("Paused", 275, 220);
        ctx.font = "15px Verdana";
        ctx.fillText("Press 'Esc' or 'P' to resume the game.", 265, 250);
        window.clearTimeout(rightSpawnTimeoutID);
        window.clearTimeout(leftSpawnTimeoutID);
    } else {
        previousTime = performance.now();
        rightSpawnLoop();
        leftSpawnLoop();
    }
    soundToggle();
}

function soundToggle() {
    if (paused === true) {
        soundOff();
    }
    else {
        var isChecked = $('#sound-enabled-toggle').is(':checked');
        $('#sound-enabled-toggle').blur();
        !isChecked ? soundOff() : soundOn();
    }
}

function soundOff() {
    backgroundMusicAudio.pause();
    window.playerJumpAudio = new Audio('');
    window.playerBlinkAudio = new Audio('');
    window.playerDeathAudio = new Audio('');
}

function soundOn() {
    backgroundMusicAudio.play();
    window.playerJumpAudio = playerJumpMusicAudioSetup();
    window.playerBlinkAudio = playerBlinkMusicAudioSetup();
    window.playerDeathAudio = playerDeathAudioSetup();
}