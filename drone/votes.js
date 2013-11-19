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
    var lastRound = rounds.last();
    rounds.push({});

    var systemKeys = ["allVoters"];

    var maxVoted = defaultAnimation,
        maxVotes = lastRound[defaultAnimation] || 0;
    Object.keys(lastRound).forEach(function (animation) {
        if (!~systemKeys.indexOf(animation)) {
            var voteCount = lastRound[animation].length;
            if (voteCount > maxVotes) {
                maxVotes = voteCount;
                maxVoted = animation;
            }
        }
    });

    votes.emit("winner", {
        animation: maxVoted,
        player: lastRound[maxVoted] && lastRound[maxVoted][0]
    });
}

votes.on("increment", function (animation, voter, callback) {
    if (!votes.intervalId) {
        callback("Voting hasn't started yet!");
        return;
    }

    var round = rounds.last(),
        voters = round[animation] || (round[animation] = []),
        allVoters = round.allVoters || (round.allVoters = []);

    if (!~voters.indexOf(voter) && !~allVoters.indexOf(voter)) {
        voters.push(voter);
        allVoters.push(voter);
    } else {
        callback("Unable to take that vote.");
    }
});

votes.on("start", function () {
    clearInterval(votes.intervalId);
    votes.intervalId = setInterval(roundAndRound, 5000);
});
votes.on("stop", function () {
    clearInterval(votes.intervalId);
    rounds.push({});
});

function debug(msg) {
    votes.emit("log", msg);
}

module.exports = votes;
