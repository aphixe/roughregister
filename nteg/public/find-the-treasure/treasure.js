// Function to called on load of the window
window.onload = function () {
//checking the HTML5 history api support feature
    if (!HistoryApiCompatible()) {
        return;
    }
    //creating the click event for the link button
    CreateHistoryClick();

    //adding event handler popstate by for back button click
    window.setTimeout(function () {
        window.addEventListener("popstate", function (e) { ChangeDoors(location.pathname); }, false);
    }, 1);
}

// function to check History API feature
function HistoryApiCompatible() {
    return !!(window.history && history.pushState);
}

//Create click event for both the link buttons
function CreateHistoryClick() {
    AddClickEvent(document.getElementById("door1"));
    AddClickEvent(document.getElementById("door2"));
}

//adding click event for each button
// on the click event execute the anonymous function,
//which push the current link and prevent the default action for this event
function AddClickEvent(link) {
    link.addEventListener("click", function (e) {
        if (ChangeDoors(link.href)) {
            history.pushState(null, null, link.href);
            e.preventDefault();
        }
    }, true);
}


// function that will actually fetch the innherHTML of the next page
function ChangeDoors(href) {
    var xMLHttpRequest = new XMLHttpRequest();
    var nextHref = href.split("/").pop();
    xMLHttpRequest.open("GET", "/public/find-the-treasure/" + nextHref, false);
    xMLHttpRequest.send(null);
    if (xMLHttpRequest.status == 200) {
        document.getElementById("data").innerHTML = xMLHttpRequest.responseText;
        CreateHistoryClick();
        return true;
    }

    return false;    
}
