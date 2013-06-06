(function (window) {
    function Ball(mouseX, mouseY, userdata) {
        this.view = new createjs.Bitmap("Pacman.png");
        this.view.scaleX = this.view.scaleY = .09;
        this.view.regX = this.view.regY = 300;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.fixedRotation = true;
        fixDef.friction = 0;
        fixDef.restitution = 0;    //Bouncing rate
        fixDef.shape = new box2d.b2CircleShape(25 / SCALE);
        fixDef.filter.groupIndex = 3;
        //        fixDef.filter.categoryBits = 0x0002;
        //        fixDef.filter.maskBits = 0x0004;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.position.x = mouseX / SCALE;
        bodyDef.position.y = mouseY / SCALE;
        bodyDef.allowSleep = false;
        bodyDef.userData = userdata;
        bodyDef.angle = Math.PI/2;

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        var xVel = parseInt(document.getElementById("Xvel").value, 10);
        var yVel = parseInt(document.getElementById("Yvel").value);
        document.getElementById("MousePos").innerHTML = "Mouse X: " + mouseX + " Mouse Y: " + mouseY;

        //this.view.body.SetLinearVelocity(new box2d.b2Vec2(5, 0));

        this.view.onTick = tick;
    }

    function tick(e) {
        if (this.body != null) {
            this.x = this.body.GetPosition().x * SCALE;
            this.y = this.body.GetPosition().y * SCALE;
            this.rotation = this.body.GetAngle() * (180 / Math.PI);
            
        }
    }
    
    window.Ball = Ball;
}
)(window);