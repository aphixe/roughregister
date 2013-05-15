(function (window) {
    function Floor(x, y, width, hieght, userdata) {
        if (userdata == "player1") {
            this.view = new createjs.Bitmap("1.png");
        }
        if (userdata == "player2") {
            this.view = new createjs.Bitmap("2.png");
        }
        this.view.regX = 15;
        this.view.regY = 65;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(width / SCALE, hieght / SCALE);

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = x / SCALE;
        bodyDef.position.y = y / SCALE;


        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        this.view.onTick = tick;

    }

    function tick(e) {
        this.x = this.body.GetPosition().x * SCALE;
        this.y = this.body.GetPosition().y * SCALE;
        this.body.SetAngle(0);
        this.body.SetAngularVelocity(70);
    }

    window.Floor = Floor;
}
)(window);