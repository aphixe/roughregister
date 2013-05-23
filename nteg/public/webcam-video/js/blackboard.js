window.onload = function () {
    var btnAdd = document.getElementById("buttonAdd");
    var myCanvas = document.getElementById("myCanvas");
    var curColor = $('#selectColor option:selected').val();
    var curWidth = $('#selectWidth option:selected').val();
    var image = "../Images/WebTexture.jpg";
    if (myCanvas) {
        var isDown = false;
        var ctx = myCanvas.getContext("2d");
        var canvasX, canvasY;
        ctx.lineWidth = curWidth;

        $(myCanvas)
                        .mousedown(function (e) {
                            isDown = true;
                            ctx.beginPath();
                            canvasX = e.pageX - myCanvas.offsetLeft;
                            canvasY = e.pageY - myCanvas.offsetTop;
                            ctx.moveTo(canvasX, canvasY);
                        })
                                     .mousemove(function (e) {
                                         if (isDown != false) {
                                             canvasX = e.pageX - myCanvas.offsetLeft;
                                             canvasY = e.pageY - myCanvas.offsetTop;
                                             ctx.lineTo(canvasX, canvasY);
                                             ctx.strokeStyle = curColor;
                                             ctx.lineWidth = curWidth;
                                             ctx.stroke();
                                         }
                                     })
                        .mouseup(function (e) {
                            isDown = false;
                            ctx.closePath();
                        });
    }

    $('#selectColor').change(function () {
        curColor = $('#selectColor option:selected').val();
    });

    $('#selectWidth').change(function () {
        curWidth = $('#selectWidth option:selected').val();
    });

    // Use the db.js library, define a schema,
    // and listen for events


    db.open({
        name: 'database',
        version: 2,
        schema: {
            items: {
                key: {
                    keyPath: 'id',
                    autoIncrement: true
                },
                indexes: {
                    color: { unique: false }
                }
            }
        }
    }).done(function (server) {

        // The database was successfully opened. We can
        // run transactions using the server varaible

        // Listen for the document ready event, as we will
        // be working with the dom

        $(function () {

            // Cache some selectors

            var add = $('#add'),
			items = $('#items');

            var colors = ['blue', 'green', 'yellow', 'pink', 'black'];

            // On dom.ready, select all items and update the #items ul
            server.items.query().filter().execute().done(function (results) {

                if (!results) {
                    return;
                }

                $.each(results, function () {
                    createItem(this);
                });

            });

            // Listen for clicks on the add button
            add.click(function () {
                image = myCanvas.toDataURL();
                var item = {
                    text: image,
                    color: colors[4]
                };

                server.items.add(item).done(function () {
                    createItem(item);
                });

                // If you wish to update an item:
                // server.items.update({id:123, color:'pink', text:'asdf'});
            });

            // When an item is clicked, remove it from the database.
            $('#items').on('click', 'li:not(#add)', function () {
                var item = $(this);
                server.items.remove(item.data('id')).done(function () {
                    item.fadeOut();
                });
            });

            function createItem(item) {
                var tmp = $('<li><img></img></li>');

                tmp.addClass(item.color)
				.data('id', item.id)
				.find('img').attr({ src: item.text });

                items.prepend(tmp);
            }

        });

    }).fail(function (error) {

        console.error("An error occured: ", error);

    });

};

