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
var playerScore = new Array(0, 0);

function init() {
    stage = new createjs.Stage(document.getElementById("canvas"));
    debug = document.getElementById("debug");


    setupPhysics();

    debug.onmousedown = function (e) {
        var b = new Ball(e.target.mouseX, e.target.mouseY, "ball");
        stage.addChild(b.view);
    }

    stage.onMouseMove = function (e) {
       stage.children[1].body.m_xf.position.y = e.target.mouseY / SCALE;
//        document.getElementById("MouseLoc").innerHTML = "X: " + e.target.mouseX + " Y: " + e.target.mouseY;
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
    // left/right arrows
    if (keys[87]) {
        //change horizontal left movement speed
        document.getElementById("keydown").innerHTML = stage.children[0].body.m_xf.position.y;
        stage.children[0].body.m_xf.position.y -= player1Speed;
    }
    else if (keys[83]) {
        //change horizontal right movement speed
        document.getElementById("keydown").innerHTML = stage.children[0].body.m_xf.position.y;
        stage.children[0].body.m_xf.position.y += player1Speed;
    }
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

    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}
function setupPhysics() {
    //createa a world and gravity and sleep body to true
    world = new box2d.b2World(new box2d.b2Vec2(0, 0), true);

    createWalls(600, 0, 800, 5, "upHorizontalWall");
    createWalls(600, 500, 800, 5, "downHorizontalWall");
    //createWalls(1300, 500, 5, 500, "wall");

    var p1 = new Floor(30, 250, 15, 65, "player1");
    stage.addChild(p1.view);

    var p2 = new Floor(1250, 250, 15, 65, "player2");
    stage.addChild(p2.view);

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
    //world.DrawDebugData();
    world.Step(1 / 60, 10, 10);
    world.ClearForces();
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    handleInteractions();
}