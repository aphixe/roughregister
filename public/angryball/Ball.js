(function (window) {
    function Ball(mouseX, mouseY) {
        this.view = new createjs.Bitmap("soccer.png");
        this.view.regX = this.view.regY = 50;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 5;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.8;    //Bouncing rate
        fixDef.shape = new box2d.b2CircleShape(50 / SCALE);

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        //        bodyDef.position.x = Math.random() * 800 / SCALE;
        bodyDef.position.x = 0 / SCALE;

        bodyDef.position.y = 350 / SCALE;

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        var xVel = parseInt(document.getElementById("Xvel").value, 10);
        var yVel = parseInt(document.getElementById("Yvel").value);
        document.getElementById("MousePos").innerHTML = "Mouse X: " + mouseX + " Mouse Y: " + mouseY;
        //document.getElementById("BallVel").innerHTML ="X vel: " +xVel+"  Y vel: "+yVel;
        // this.view.body.ApplyForce(box2d.b2Vec2(0, 50), this.view.body.GetWorldCenter(box2d.b2Vec2(0, 50)));

        this.view.body.SetLinearVelocity(new box2d.b2Vec2(xVel, -yVel));
        //this.view.body.SetAngularVelocity(.2);
        //this.view.body.SetAngle(1 * Math.PI);

        this.view.onTick = tick;
    }

    function tick(e) {
        if (this.body != null) {
            this.x = this.body.GetPosition().x * SCALE;
            this.y = this.body.GetPosition().y * SCALE;
            this.rotation = this.body.GetAngle() * (180 / Math.PI);
            if (parseInt(document.getElementById("Xvel").value, 10) == 26) {
                world.DestroyBody(this.body);
                this.body = null;
            }
        }
    }

    window.Ball = Ball;
}
)(window);