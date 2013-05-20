if (!('contains' in String.prototype))
    String.prototype.contains = function (str, startIndex) { return -1 !== this.indexOf(str, startIndex); };

$(document).ready(function () {
    if ('geolocation' in navigator) {
        document.getElementById('MyLocation').className = "show-it";
        DoTheTrick();
    }
    else {
        document.getElementById('NoHTML5').className = "show-it";
    }
});

function DoTheTrick() {
    var datetime = new Date(), api_key = 'f3fcfe4d1b8a4b0ef8176bc614c2a2e4', geocoder = new google.maps.Geocoder(), tag = '';
    $('#time').text(datetime);
    navigator.geolocation.getCurrentPosition(function (position) {
        var coords = position.coords;
        $('#latitude').text(coords.latitude);
        $('#longitude').text(coords.longitude);
        $('#altitude').text(coords.altitude);
        var mapOptions = {
            center: new google.maps.LatLng(coords.latitude, coords.longitude),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(coords.latitude, coords.longitude)
        });
        // To add the marker to the map, call setMap();
        marker.setMap(map);
        var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);


        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results) {
                    var arrAddress = results[0].address_components;
                    var itemRoute = '';
                    var itemLocality = '';
                    var itemCountry = '';
                    var itemPc = '';
                    var itemSnumber = '';
                    var itemStateOrCity = '';
                    $('#address').text(results[0].formatted_address);

                    // iterate through address_component array
                    $.each(arrAddress, function (i, address_component) {
                        //console.log("Components: " + i + "\r\n" + JSON.stringify(address_component));
                        //console.log('address_component:' + i);
                        if (address_component.types[0] == "route") {
                            itemRoute = address_component.long_name;
                        }
                        if (address_component.types[0] == "locality") {
                            itemLocality = address_component.long_name;
                        }
                        if (address_component.types[0] == "country") {
                            itemCountry = address_component.long_name;
                        }
                        if (address_component.types[0] == "postal_code_prefix") {
                            itemPc = address_component.long_name;
                        }
                        if (address_component.types[0] == "street_number") {
                            itemSnumber = address_component.long_name;
                        }
                        if (address_component.types[0].contains("sublocality")
                            || address_component.types[0].contains("administrative_area_level_")) {
                            itemStateOrCity += ("," + address_component.long_name);
                        }
                        //return false; // break the loop
                    });
                    tag = itemStateOrCity;
                    console.log("Searching with Tags: " + tag);
                    //console.log("formatted_address: " + results[0].formatted_address + "\r\n Comp 4: " + JSON.stringify(results[0].address_components[4]) + "\r\n Comp 5: " + JSON.stringify(results[0].address_components[5]));
                    
                    //Flickr
                    $.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=' + api_key + '&tags=' + tag + /*'&lat='+coords.latitude+'&lon='+coords.longitude+'&geo_context=2*/'&format=json&jsoncallback=?',
					function (data) {
					    var i, item, photo_url = '', img_str = '', len = data.photos.photo.length;
					    for (i = 0; i < (len - len + 10); i++) {
					        item = data.photos.photo[i];
					        photo_url = 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
					        larger_photo_url = 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
                            img_str += '<span>' +
                                            '<img src="' + photo_url + '" alt="' + item.title + '" ' +
                                            'onClick = "ShowBiggerPicture( \'' + larger_photo_url + '\',\'' + item.title + '\' )" />' +
                                        '</span>';
					    }
					    $('#images').html(img_str);
					});
                }
            } else {
                alert("Geocoder failed due to: " + status);
            }
        });

    }, handle_error);
};


function handle_error(err) {
    if (err.code == 1) {
        // user said no!
        document.getElementById('MyLocation').className = "hide-it";
        document.getElementById('NotTrusted').className = "show-it";
    }
    else {
        alert("Error " + err.code + "\r\n" + err.message);
    }
};

function ShowBiggerPicture(newImg_url, img_desc) {
    document.getElementById("largerImage").className = "fade-out";

    setTimeout(function () {
        var biggerPicture = document.getElementById("biggerPicture");
        biggerPicture.className = "show-it";
        biggerPicture.src = newImg_url;
        document.getElementById("imageDescription").innerHTML = img_desc;
    }, 900);

    

    setTimeout(function () {
        document.getElementById("largerImage").className = "fade-in";
    }, 1200);
};
