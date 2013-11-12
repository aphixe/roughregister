var EventEmitter = require("events").EventEmitter;

var votes = {};
EventEmitter.call(votes);
votes.__proto__ = EventEmitter.prototype;

var rounds = [
        {
            flipLeft: [],
            flipRight: []
        }
    ],
    defaultAnimation = "flipLeft";

rounds.last = function () { return rounds[rounds.length - 1]; };

function roundAndRound() {
    var lastRound = rounds[rounds.length - 1];
    rounds.push({});

    var maxVoted = defaultAnimation,
        maxVotes = lastRound[defaultAnimation] || 0;
    Object.keys(lastRound).forEach(function (animation) {
        var voteCount = lastRound[animation].length;
        if (voteCount > maxVotes) {
            maxVotes = voteCount;
            maxVoted = animation;
        }
    });

    votes.emit("winner", maxVoted, lastRound);
}

votes.on("increment", function (animation, voter) {
    var round = rounds[rounds.length - 1],
        voters = round[animation] || (round[animation] = []);

    if (!~voters.indexOf(voter)) {
        voters.push(voter);
        sendLog("Thanks for sending vote for " + animation + "!");
    } else {
        sendLog("You're being smart, but you really can't vote twice :)");
    }
});

var intervalId;
votes.on("start", function () {
    intervalId = setInterval(roundAndRound, 5000);
});
votes.on("stop", function () {
    clearInterval(intervalId);
});

module.exports = votes;
