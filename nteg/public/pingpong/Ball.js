(function (window) {
    function Ball(mouseX, mouseY, userdata) {
        this.view = new createjs.Bitmap("soccer.png");
        this.view.regX = this.view.regY = 32.5;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.0001;
        fixDef.restitution = 1;    //Bouncing rate
        fixDef.shape = new box2d.b2CircleShape(32.5/ SCALE);

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.position.x = 600 / SCALE;
        bodyDef.position.y = 350 / SCALE;
        bodyDef.userData = userdata;

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        var xVel = parseInt(document.getElementById("Xvel").value, 10);
        var yVel = parseInt(document.getElementById("Yvel").value);
        document.getElementById("MousePos").innerHTML = "Mouse X: " + mouseX + " Mouse Y: " + mouseY;

        this.view.body.SetLinearVelocity(new box2d.b2Vec2(xVel, -yVel));

        this.view.onTick = tick;
    }

    function tick(e) {
        if (this.body != null) {
            this.x = this.body.GetPosition().x * SCALE;
            this.y = this.body.GetPosition().y * SCALE;
            this.rotation = this.body.GetAngle() * (180 / Math.PI);
            if (this.x / SCALE > 47) {
                UpdateScore("p2");
                world.DestroyBody(this.body);
                this.body = null;
                this.image = null;
            }
            else if (this.x / SCALE < -1) {
                UpdateScore("p1");
                world.DestroyBody(this.body);
                this.body = null;
                this.image = null;
            }
        }
    }
    function UpdateScore(playerName) {
        if (playerName == "p1") {
            playerScore[1] += 1;
            document.getElementById("player2Score").innerHTML = "Player 2 Score: " + playerScore[1];
        }
        else if (playerName == "p2") {
            playerScore[0] += 1;
            document.getElementById("player1Score").innerHTML = "Player 1 Score: " + playerScore[0];
        }

    }

    window.Ball = Ball;
}
)(window);