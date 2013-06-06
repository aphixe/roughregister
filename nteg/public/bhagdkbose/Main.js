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
var stage, world, debug;
var keys = [];
var velocity = 5;
var freeze = 1 / 40;
var myDataRef = new Firebase('https://uwf503fwck1.firebaseio-demo.com/');
var dir = 0;
var playerId = 1;
var noOfPlayer = 1;

function UpdateListener() {
    var b2Listener = Box2D.Dynamics.b2ContactListener;

    //Add listeners for contact
    var listener = new b2Listener;

    //    listener.BeginContact = function (contact) {
    //        console.log("BeginContact");
    //    }

    //    listener.EndContact = function (contact) {
    //    }

    listener.PostSolve = function (contact, impulse) {
        console.log("PostSolve");
        var p1 = contact.GetFixtureA().GetBody().GetUserData();
        var p2 = contact.GetFixtureB().GetBody().GetUserData();
        if ((p1 == 'ball' && p2 == 'enemies') || (p2 == 'ball' && p1 == 'enemies')) {
            document.getElementById("player1Score").innerHTML = "DK Bose Looses";
            freeze = 0;
        }

        else if ((p1 == 'ball' && p2 == 'Victory') || (p2 == 'ball' && p1 == 'Victory')) {
            document.getElementById("player1Score").innerHTML = "DK Bose Win";
            freeze = 0;
        }
    }

    //    listener.PreSolve = function (contact, oldManifold) {
    //    }

    this.world.SetContactListener(listener);
}
function init() {
    stage = new createjs.Stage(document.getElementById("canvas"));
    debug = document.getElementById("debug");

    setupPhysics();

    createjs.Ticker.addListener(this);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
    UpdateListener();
}

function handleKeyDown(evt) {
    keys[evt.keyCode] = true;
}

function handleKeyUp(evt) {
    keys[evt.keyCode] = false;
}


function handleInteractions() {

    var newDir = dir;
    //change vertical top movement speed
    if (keys[87]) {
        newDir = 1;
    } //change vertical bottom movement speed
    else if (keys[83]) {
        newDir = 3;
    } //change horizontal left movement speed
    else if (keys[65]) {
        newDir = 4;
    } //change horizontal right movement speed
    else if (keys[68]) {
        newDir = 2;
    }
    if (newDir != dir) {
        dir = newDir;
        DirectionChange(playerId);
    }
}

function UpdateStage(newDir, playerId, sNOP) {
    switch (newDir) {
        case 0:
            for (var i = noOfPlayer; i < sNOP; i++) {
                var b = new Ball(800, 45, "enemies", i);
                stage.addChild(b.view);
                            }
            break;
        case 1:
            stage.children[playerId].body.m_linearVelocity.x = 0;
            stage.children[playerId].body.m_linearVelocity.y = -velocity;
            stage.children[playerId].body.SetAngle(-Math.PI / 2);
            break;
        case 2:
            stage.children[playerId].body.m_linearVelocity.x = velocity;
            stage.children[playerId].body.m_linearVelocity.y = 0;
            stage.children[playerId].body.SetAngle(0);
            break;
        case 3: stage.children[playerId].body.m_linearVelocity.x = 0;
            stage.children[playerId].body.m_linearVelocity.y = velocity;
            stage.children[playerId].body.SetAngle(Math.PI / 2);
            break;
        case 4:
            stage.children[playerId].body.m_linearVelocity.x = -velocity;
            stage.children[playerId].body.m_linearVelocity.y = 0;
            stage.children[playerId].body.SetAngle(-Math.PI);
            break;

        default: stage.children[playerId].body.m_linearVelocity.x = 0;
            stage.children[playerId].body.m_linearVelocity.y = 0;
            break;
    }
}
function NewJoinee() {
    var newPlayerCount = noOfPlayer + 1;
    playerId = newPlayerCount;
    document.getElementById('joinGame').disabled = true;
    myDataRef.push({ playerId: noOfPlayer, direction: 0, noOfPlayer: newPlayerCount });
    //myDataRef.remove();
}

myDataRef.on('child_added', function (snapshot) {

    var message = snapshot.val();
    document.getElementById("msg").innerHTML = "Id: " + message.playerId + "  dir: " + message.direction;

    UpdateStage(message.direction, message.playerId, message.noOfPlayer)
    if (message.noOfPlayer > 0) {
        noOfPlayer = message.noOfPlayer;
    }
    if (message.x != undefined && message.y != undefined) {
        stage.children[message.playerId].body.SetPosition(new box2d.b2Vec2(message.x, message.y));
    }

});

function DirectionChange(playerId) {
    myDataRef.push({ playerId: playerId, direction: dir,
        x: stage.children[playerId].body.m_xf.position.x,
        y: stage.children[playerId].body.m_xf.position.y
    });
    //myDataRef.remove();
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
//Create Boundary
    createWalls(450, 8, 440, 5, "wall");
    createWalls(450, 590, 440, 5, "wall");
    createWalls(0, 300, 5, 290, "wall");
    createWalls(900, 300, 5, 290, "wall");

    //createWalls(600, 60, 1, 50, "wall", Math.PI / 6);
    //L1 H1
    createWalls(170, 76, 80, 1, "wall");
    //H2
    createWalls(600, 76, 290, 1, "wall");
    //H3
    createWalls(750, 180, 145, 1, "wall");

    //L1 V1
    createWalls(90, 150, 1, 70, "wall");
    // V2
    createWalls(313, 180, 1, 100, "wall");
    //V3
    createWalls(600, 100, 1, 20, "wall");
    //V4
    createWalls(605, 200, 1, 20, "wall");
    //V5
    createWalls(810, 160, 1, 20, "wall");


    //L2 H1
    createWalls(120, 280, 110, 1, "wall");
    //H2
    createWalls(425, 280, 110, 1, "wall");
    //H3
    createWalls(660, 280, 60, 1, "wall");

    //L2 V1
    createWalls(90, 368, 1, 90, "wall");
    //V2
    createWalls(313, 430, 1, 90, "wall");
    //V3
    createWalls(600, 360, 1, 80, "wall");
    //V4
    createWalls(810, 380, 1, 140, "wall");

    //L3 H
    createWalls(450, 520, 360, 1, "wall");
    //createWinWall(884, 126, 1, 30, "Win Wall");
}

function ResetGame() {
    myDataRef.remove();
}
function setupPhysics() {
    //createa a world and gravity and sleep body to true
    world = new box2d.b2World(new box2d.b2Vec2(0, 0), true);

    CreateMaze();

    var v = new VictoryWall(884, 126, 5, 50, "Victory");
    stage.addChild(v.view);

    var b = new Ball(40, 560, "ball", 0);
    stage.addChild(b.view);

    

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