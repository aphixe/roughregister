(function (window) {
    function VictoryWall(x, y, width, hieght, userdata) {

        this.view = new createjs.Bitmap("Vic.png");
        //this.view.scaleX = this.view.scaleY = .28;
        this.view.regX = 5;
        this.view.regY = 50;

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

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        this.view.onTick = tick;
    }

    function tick(e) {
        if (this.body != null) {
            this.x = this.body.GetPosition().x * SCALE;
            this.y = this.body.GetPosition().y * SCALE;
        }
    }
    window.VictoryWall = VictoryWall;
}
)(window);