(function (window) {
    function Floor() {
        this.view = new createjs.Bitmap("tile.png");
        this.view.regX = 18;
        this.view.regY = 18;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(600 / SCALE, 18 / SCALE);

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = 700 / SCALE;
        bodyDef.position.y = 400 / SCALE;


        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        this.view.onTick = tick;

    }

    function tick(e) {
        this.x = this.body.GetPosition().x * SCALE;
        this.y = this.body.GetPosition().y * SCALE;
        this.body.SetAngle(0);
        this.body.SetAngularVelocity(70);
        //this.rotation = this.body.GetAngle() * (180 / Math.PI);
    }

    window.Floor = Floor;
}
)(window);