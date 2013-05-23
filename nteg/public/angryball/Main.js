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
var stage,world,debug;

function init(){
    stage = new createjs.Stage(document.getElementById("canvas"));
    debug = document.getElementById("debug");


    setupPhysics();

    new Cannon(30, 10, 10, 60,"wall");
    new Cannon(33, 10, 10, 60,"wall");
    new Cannon(31.5, 7, 60, 5,"wall");

    new Cannon(30, 5, 4, 30,"wall");
    new Cannon(33, 5, 4, 30, "wall");
    new Cannon(31.5, 2, 60, 5, "wall");

    new Cannon(30, 10, 10, 60, "wall");
    new Cannon(33, 10, 10, 60, "wall");
    new Cannon(31.5, 7, 60, 5, "wall");

    new Cannon(30, 5, 4, 30, "wall");
    new Cannon(33, 5, 4, 30, "wall");
    new Cannon(31.5, 2, 60, 5, "wall");

    var c = new Cannon(31.5, 2, 20, 20, "Boss");

    stage.addChild(c.view);

    debug.onmousedown = function (e) {
//        var mouseX = (); //- canvas.offsetLeft) / SCALE;
//        var mouseY = (e.target.mouseY); //- canvas.offsetTop) / SCALE;
        
        var b = new Ball(e.target.mouseX, e.target.mouseY);
        stage.addChild(b.view);
    }
    stage.onMouseMove = function (e) {
        document.getElementById("MouseLoc").innerHTML = "X: " + parseInt( e.target.mouseX / SCALE ,10)+ " Y: " + parseInt( e.target.mouseY / SCALE,10);
        var angle = parseFloat(Math.atan2(300 - e.target.mouseY, 600 - e.target.mouseX));
        //        var pos = c.view.body.GetPosition();
        //        pos.x = 10;
        //        pos.y=10
        //        //c.view.body.SetPositionAndAngle(pos, angle);
        //c.view.body.SetAngle(angle *Math.PI);
    }
    

    createjs.Ticker.addListener(this);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
}

function setupPhysics(){
    //createa a world and gravity and sleep body to true
    world = new box2d.b2World(new box2d.b2Vec2(0,50),true);

    var f = new Floor();
    stage.addChild(f.view);


    //create Ground
//    var fixDef = new box2d.b2FixtureDef();
//    fixDef.density = 1;
//    fixDef.friction = 0.5;
//    fixDef.shape = new box2d.b2PolygonShape();
//    fixDef.shape.SetAsBox(700 / SCALE, 20 / SCALE);

//    var bodyDef = new box2d.b2BodyDef();
//    bodyDef.type = box2d.b2Body.b2_staticBody;
//    bodyDef.position.x = 700 / SCALE;
//    bodyDef.position.y = 500 / SCALE;
//    //bodyDef.ApplyAngularImpulse(90);

//    var a = world.CreateBody(bodyDef);
//    a.CreateFixture(fixDef);

//    //var angle = a.GetAngle();
//    var pos = a.GetPosition();
//    a.SetAngle(-100*(180/Math.PI));
//    a.SetAngularVelocity(70);

    //setup debug draw
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite(debug.getContext('2d'));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(.5);
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit );
    world.SetDebugDraw(debugDraw);

}

function tick(){

    stage.update();
    world.DrawDebugData();
    world.Step(1/60,10,10);
    world.ClearForces();
}