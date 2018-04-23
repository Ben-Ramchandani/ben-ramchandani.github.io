var Die = /** @class */ (function () {
    function Die(parentDiv, onDiceClick) {
        this.parentDiv = parentDiv;
        this.onDiceClick = onDiceClick;
        this.containerDiv = document.createElement("div");
        this.containerDiv.className = "dieContainer";
        this.dieDiv = this.makeDie();
        this.containerDiv.appendChild(this.dieDiv);
        this.parentDiv.appendChild(this.containerDiv);
        this.faceIndex = 0;
        this.currentAngle = [0, 0, 0];
    }
    Die.prototype.getValue = function () {
        return this.faceIndex + 1;
    };
    Die.prototype.makeDie = function () {
        var die = document.createElement("div");
        die.className = "die";
        die.onclick = this.onDiceClick;
        var sides = ["front", "right", "top", "bottom", "left", "back"];
        for (var i = 0; i < 6; i++) {
            var figure = document.createElement("figure");
            figure.className = sides[i];
            figure.innerText = (i + 1).toString();
            die.appendChild(figure);
        }
        return die;
    };
    Die.prototype.roll = function () {
        var randInt = Math.floor(Math.random() * 6);
        var angles = Die.cubeFaces[randInt].slice();
        for (var i = 0; i < 3; i++) {
            angles[i] += 360 * (Math.floor(Math.random() * 3) - 1);
        }
        if (angles[0] === this.currentAngle[0] &&
            angles[1] === this.currentAngle[1] &&
            angles[2] === this.currentAngle[2]) {
            angles[0] += 360;
            angles[2] -= 360;
        }
        this.rotateTo(angles);
        this.faceIndex = randInt;
        return this.faceIndex + 1;
    };
    Die.prototype.rotateTo = function (angles) {
        this.dieDiv.style.transform =
            "rotateX(" + angles[0] + "deg) rotateY(" + angles[1] + "deg) rotateZ(" + angles[2] + "deg)";
        this.currentAngle = angles;
    };
    Die.cubeFaces = [
        [0, 0, 0],
        [0, -90, 0],
        [-90, 0, 0],
        [90, 0, 0],
        [0, 90, 0],
        [180, 0, 0]
    ];
    return Die;
}());
var DiceArea = /** @class */ (function () {
    function DiceArea(diceholderDiv, onRoll, initialDie) {
        this.diceholderDiv = diceholderDiv;
        this.dice = [];
        this.dice = [];
        this.diceholderDiv.classList.add("diceHolder");
        initialDie = initialDie || 0;
        for (var i = 0; i < initialDie; i++) {
            this.addDie();
        }
        this.onRoll = onRoll;
    }
    DiceArea.prototype.updateTotal = function () {
        var sum = 0;
        for (var i = 0; i < this.dice.length; i++) {
            sum += this.dice[i].getValue();
        }
        if (this.onRoll) {
            this.onRoll(sum);
        }
    };
    Object.defineProperty(DiceArea.prototype, "diceCount", {
        get: function () {
            return this.dice.length;
        },
        enumerable: true,
        configurable: true
    });
    DiceArea.prototype.rollDice = function () {
        this.dice.forEach(function (die) { return die.roll(); });
        this.updateTotal();
    };
    DiceArea.prototype.rollDie = function (dieId) {
        if (this.dice[dieId]) {
            this.dice[dieId].roll();
            this.updateTotal();
        }
        else {
            throw Error("Die with ID " + dieId + " does not exist.");
        }
    };
    DiceArea.prototype.addDie = function () {
        var _this = this;
        var index = this.dice.length;
        this.dice.push(new Die(this.diceholderDiv, function () { return _this.rollDie(index); }));
        this.updateTotal();
        return this.dice.length;
    };
    DiceArea.prototype.removeLast = function () {
        if (this.dice.length === 0) {
            return 0;
        }
        this.diceholderDiv.removeChild(this.dice[this.dice.length - 1].containerDiv);
        var die = this.dice.pop();
        this.updateTotal();
        return this.dice.length;
    };
    return DiceArea;
}());
