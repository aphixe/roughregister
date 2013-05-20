(function (window) {
    function Cannon(x, y, width, hieght, userdata) {
        this.view = new createjs.Bitmap("tile.png");
        this.view.regX = 36;
        this.view.regY = 36;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.shape = new box2d.b2PolygonShape();
        //fixDef.shape.m_centroid.x = 10;



        fixDef.shape.SetAsBox(width / SCALE, hieght / SCALE);

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.position.Set(x, y);
        bodyDef.userData = userdata;


        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        //this.view.body.m_sweep.localCenter.Set(10, 10);

        //document.getElementById("MouseLoc").innerHTML = "X: " + e.target.mouseX + " Y: " + e.target.mouseY;
        this.view.onTick = tick;

    }

    function tick(e) {
        if (this.body.m_userData == "Boss") {
            this.x = parseInt(this.body.GetPosition().x, 10);
            this.y = parseInt(this.body.GetPosition().y, 10);
            if(this.y>8)
                document.getElementById("Win").innerHTML = "You Win!"
                //"X: " + this.x + " Y: " + this.y;
        }

        //this.body.SetAngle();
        //this.body.SetAngularVelocity(70);
        //this.rotation = this.body.GetAngle() * (180 / Math.PI);
    }

    window.Cannon = Cannon;
}
)(window);