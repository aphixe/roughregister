(function (window) {
    function Enemy(mouseX, mouseY, userdata) {
        this.view = new createjs.Bitmap("smily.png");
        this.view.scaleX = this.view.scaleY = .28;
        this.view.regX = this.view.regY = 100;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.fixedRotation = true;
        fixDef.friction = 0;
        fixDef.restitution = 1;    //Bouncing rate
        fixDef.shape = new box2d.b2CircleShape(27 / SCALE);
//        fixDef.shape = new box2d.b2PolygonShape();
//        fixDef.shape.SetAsBox(20/SCALE, 20/SCALE);
        fixDef.filter.groupIndex = -8;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.position.x = mouseX / SCALE;
        bodyDef.position.y = mouseY / SCALE;
        bodyDef.allowSleep = false;
        bodyDef.userData = userdata;

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        var xVel = parseInt(document.getElementById("Xvel").value, 10);
        var yVel = parseInt(document.getElementById("Yvel").value);
        document.getElementById("MousePos").innerHTML = "Mouse X: " + mouseX + " Mouse Y: " + mouseY;

        this.view.body.SetLinearVelocity(new box2d.b2Vec2(5, 0));

        this.view.onTick = tick;
    }

    function tick(e) {
        if (this.body != null) {
            if (this.body.m_linearVelocity.x > 5) {
                this.body.m_linearVelocity.x = 5
            }
            if (this.body.m_linearVelocity.y > 5) {
                this.body.m_linearVelocity.y = 5
            }
            this.x = this.body.GetPosition().x * SCALE;
            this.y = this.body.GetPosition().y * SCALE;
//            if (this.body.m_linearVelocity.y < 1 && this.body.m_linearVelocity.x < 1) {
//                this.body.SetLinearVelocity(new box2d.b2Vec2(5, 0));
//            }
        }
    }
    window.Enemy = Enemy;
}
)(window);