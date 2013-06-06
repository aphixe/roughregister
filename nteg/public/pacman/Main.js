var box2d = {
    b2Vec2: Box2D.Common.Math.b2Vec2,
    b2BodyDef: Box2D.Dynamics.b2BodyDef,
    b2Body: Box2D.Dynamics.b2Body,
    b2FixtureDef: Box2D.Dynamics.b2FixtureDef,
    b2Fixture: Box2D.Dynamics.b2Fixture,
    b2World: Box2D.Dynamics.b2World,
    b2MassData: Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape: Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw: Box2D.Dynamics.b2DebugDraw
};

var SCALE = 30;
var player1Speed = .7;
var stage, world, debug;
var keys = [];
var playerScore = 0;
var velocity = 5;
var life = 3;
var freeze=1/60;


function init() {
    stage = new createjs.Stage(document.getElementById("canvas"));
    debug = document.getElementById("debug");


    setupPhysics();

    //    debug.onmousedown = function (e) {
    //        var b = new Ball(e.target.mouseX, e.target.mouseY, "ball");
    //        stage.addChild(b.view);
    //    }

    stage.onMouseMove = function (e) {
        //stage.children[1].body.m_xf.position.y = e.target.mouseY / SCALE;
        document.getElementById("MouseLoc").innerHTML = "X: " + e.target.mouseX + " Y: " + e.target.mouseY;
    }

    createjs.Ticker.addListener(this);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
}

function handleKeyDown(evt) {
    keys[evt.keyCode] = true;
}


function handleKeyUp(evt) {
    keys[evt.keyCode] = false;
}


function handleInteractions() {

    var collision = world.m_contactList;
    if (collision != null) {
        var A = collision.GetFixtureA().m_body.m_userData;
        var B = collision.GetFixtureB().m_body.m_userData;
        console.log("Shape1: " + A + "   Shape2: " + B);
        if ((A == 'ball' && B == 'food') || (B == 'ball' && A == 'food')) {
            if (A == 'food') {
                world.DestroyBody(collision.GetFixtureA().m_body);
            }
            else {
                world.DestroyBody(collision.GetFixtureB().m_body);
            }
            playerScore++;
            document.getElementById("player1Score").innerHTML = "Player 1 Score: " + playerScore;
        }
        else if ((A == 'enemy' && B == 'ball') || (B == 'enemy' && A == 'ball')) {
            life--;
            freeze = 0;
            if (life <= 0) {
                document.getElementById("Message").innerHTML = "You Loose!<br> Press F5 to restart.";
            }
            else {
                document.getElementById("Message").innerHTML = "Life: " + life;
            }
        }
    }

    // left/right arrows
    if (keys[87]) {
        //change vertical top movement speed
        //document.getElementById("keydown").innerHTML = stage.children[0].body.m_xf.position.y;
        stage.children[0].body.m_linearVelocity.x = 0;
        stage.children[0].body.m_linearVelocity.y = -velocity;
        stage.children[0].body.SetAngle(-Math.PI / 2);
    }
    else if (keys[83]) {        //change vertical bottom movement speed
        //document.getElementById("keydown").innerHTML = stage.children[0].body.m_xf.position.y;
        stage.children[0].body.m_linearVelocity.x = 0;
        stage.children[0].body.m_linearVelocity.y = velocity;
        stage.children[0].body.SetAngle(Math.PI / 2);
    }
    else if (keys[65]) {
        //change horizontal left movement speed
        document.getElementById("keydown").innerHTML = stage.children[0].body.m_xf.position.xy
        stage.children[0].body.m_linearVelocity.x = -velocity;
        stage.children[0].body.m_linearVelocity.y = 0;
        stage.children[0].body.SetAngle(-Math.PI);
    }
    else if (keys[68]) {
        //change horizontal right movement speed
        document.getElementById("keydown").innerHTML = stage.children[0].body.m_xf.position.x;
        stage.children[0].body.m_linearVelocity.x = velocity;
        stage.children[0].body.m_linearVelocity.y = 0;
        stage.children[0].body.SetAngle(0);
    }
    else if (keys[69]) {
        //change horizontal right movement speed
        document.getElementById("keydown").innerHTML = stage.children[0].body.m_xf.position.x;
        stage.children[0].body.m_linearVelocity.x = 0;
        stage.children[0].body.m_linearVelocity.y = 0;
    }
    //document.getElementById("player2Score").innerHTML = "Ball Location: ( " + stage.children[0].body.m_xf.position.x * SCALE + " , " + stage.children[0].body.m_xf.position.y * SCALE + " )";
    //console.log("XVel: " + stage.children[0].body.m_linearVelocity.x + "  YVel: " + stage.children[0].body.m_linearVelocity.y);

}
function createWalls(x, y, width, hieght, userdata) {
    var fixDef = new box2d.b2FixtureDef();
    fixDef.density = 1;
    fixDef.friction = 0.5;
    fixDef.shape = new box2d.b2PolygonShape();
    fixDef.shape.SetAsBox(width / SCALE, hieght / SCALE);

    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_staticBody;
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    bodyDef.userData = userdata;

    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function CreateMaze() {
    createWalls(450, 8, 440, 5, "wall");
    createWalls(450, 590, 440, 5, "wall");
    createWalls(0, 300, 5, 290, "wall");
    createWalls(900, 300, 5, 290, "wall");

    //Vertical L1
    createWalls(450, 105, 15, 85, "wall");

    //Left  wall L1
    createWalls(139, 85, 75, 15, "wall");
    createWalls(325, 85, 50, 15, "wall");

    //Right wall L1
    createWalls(575, 85, 50, 15, "wall");
    createWalls(760, 85, 75, 15, "wall");

    //Left wall L2
    createWalls(139, 175, 75, 15, "wall");
    createWalls(325, 175, 50, 15, "wall");

    //Right wall L2
    createWalls(575, 175, 50, 15, "wall");
    createWalls(760, 175, 75, 15, "wall");

    //Left L3
    createWalls(175, 300, 110, 40, "wall");

    //center  L3
    createWalls(450, 300, 100, 40, "wall");

    //Right L3
    createWalls(730, 300, 110, 40, "wall");

    //Vertical L4
    createWalls(450, 490, 15, 85, "wall");

    //Left wall L4
    createWalls(139, 420, 75, 15, "wall");
    createWalls(325, 420, 50, 15, "wall");

    //Right wall L4
    createWalls(575, 420, 50, 15, "wall");
    createWalls(760, 420, 75, 15, "wall");

    //Left  wall L5
    createWalls(139, 510, 75, 15, "wall");
    createWalls(325, 510, 50, 15, "wall");

    //Right wall L5
    createWalls(575, 510, 50, 15, "wall");
    createWalls(760, 510, 75, 15, "wall");



}

function CreateFood(x, y) {
    var fixDef = new box2d.b2FixtureDef();
    fixDef.density = 0;
    fixDef.shape = new box2d.b2CircleShape(5 / SCALE);
    fixDef.filter.groupIndex = -8;

    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_kinematicBody;
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    bodyDef.userData = "food";

    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}
function CreateFoods() {
    for (var i = 0; i < 38; i++) {
        if (i < 7 || (i > 9 && i < 15) || (i > 22 && i < 28) || (i > 30 && i < 38)) {
            CreateFood(80 + (i * 20), 40);
            CreateFood(80 + (i * 20), 130);
            CreateFood(80 + (i * 20), 220);
            CreateFood(80 + (i * 20), 370);
            CreateFood(80 + (i * 20), 465);
            CreateFood(80 + (i * 20), 555);
        }
    }

    for (var i = 0; i < 27; i++) {
        if (i < 10 || i > 16) {
            CreateFood(245, 40 + (i * 20));
            CreateFood(405, 40 + (i * 20));
            CreateFood(495, 40 + (i * 20));
            CreateFood(655, 40 + (i * 20));
        }
        else if (i >= 12 && i <= 15) {
            CreateFood(320, 30 + (i * 20));
            CreateFood(585, 30 + (i * 20));
        }
        if (i <= 24) {
            CreateFood(30, 40 + (i * 20));
        }
        CreateFood(865, 40 + (i * 20));
    }
}

function CreateEnemy() {
    //var b = new Enemy(800, 400, "enemy");
    stage.addChild((new Enemy(200, 140, "enemy")).view);
    stage.addChild((new Enemy(800, 100, "enemy")).view);
    stage.addChild((new Enemy(200, 500, "enemy")).view);
    stage.addChild((new Enemy(600, 450, "enemy")).view);
    stage.addChild((new Enemy(500, 350, "enemy")).view);
    stage.addChild((new Enemy(600, 200, "enemy")).view);

}

function setupPhysics() {
    //createa a world and gravity and sleep body to true
    world = new box2d.b2World(new box2d.b2Vec2(0, 0), true);

    CreateMaze();

    CreateFoods();

    var b = new Ball(40, 560, "ball");
    stage.addChild(b.view);

    CreateEnemy();
    //createWalls(1300, 500, 5, 500, "wall");



    //    var p1 = new Floor(100, 250, 40,40, "player1");
    //    stage.addChild(p1.view);

    //var p2 = new Floor(1250, 250, 15, 65, "player2");
    //stage.addChild(p2.view);

    //setup debug draw
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite(debug.getContext('2d'));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0);
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

}

function tick() {

    stage.update();
    world.DrawDebugData();
    world.Step(freeze, 10, 10);
    world.ClearForces();
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    handleInteractions();
}