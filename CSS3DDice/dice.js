var Die = function(diceArea, dieIdNum) {
	Die.counter = Die.counter || 0;
	Die.counter += 1;
	var dieId = dieIdNum;
	
	var makeDie = function(diceHolder, dieId, areaName) {
		container = document.createElement("div");
		container.className = "container";
		diceHolder.appendChild(container);
		container.innerHTML = '    <div class="die" onClick="DiceArea.Areas[\'' + areaName + '\'].rollDie(' + dieId + ')">\n      <figure class="front">1</figure>\n      <figure class="back">6</figure>\n      <figure class="right">3</figure>\n      <figure class="left">4</figure>\n      <figure class="top">5</figure>\n      <figure class="bottom">2</figure>\n    </div>';
		return container;
	}
	
	var containerDiv = makeDie(diceArea.diceHolderDiv, dieId, diceArea.name);
	var dieDiv = containerDiv.getElementsByClassName("die")[0];
	var holder = diceArea.diceHolderDiv;
	this.value = 1;
	
	
	this.getDiv = function() {return containerDiv;};
	this.getDieId = function() {return dieId;};
	
	this.rotateTo = function(angles) {//angles:[x, y, z]
		dieDiv.style['transform', 'MozTransform', 'WebkitTransform'] = "rotateX(" + angles[0] + "deg) rotateY(" + angles[1] + "deg) rotateZ(  " + angles[2] + "deg)";
	};
	
	this.del = function() {
		holder.removeChild(containerDiv);
		Die.counter -= 1;
	}
}

Die.cubeFaces = [ [0, 0, 0], [90, 0, 0], [0, -90, 0], [0, 90, 0], [270, 0, 0], [180, 0, 0] ]; // One rotation for each possible face to be shown.

Die.prototype.roll = function() {
	var randInt = Math.floor( Math.random() * 6 ); //0 <= randInt <= 5.
	var angles = Die.cubeFaces[randInt].slice();
	
	for (var i = 0; i<3; i++) {
		angles[i] += 360 * (Math.floor( Math.random()*3) - 1);
	}
	
	if(angles[0] == 0 && angles[1] == 0 && angles[2] == 0) {//Always spin
		angles[0] =  360;
		angles[2] = -360;
	}

	this.rotateTo(angles);
	this.value = randInt + 1;
	return (randInt + 1);
};

Die.prototype.show = function(n) { this.rotateTo(Die.cubeFaces[n-1]);};





var DiceArea = function(diceAreaDiv, areaName) {
	DiceArea.Areas = DiceArea.Areas || {};
	DiceArea.Areas[areaName] = this;
	this.dice = new Array();
	this.name = areaName;
	this.diceAreaDiv = diceAreaDiv;
	//Try and find a diceHolder
	var diceHolderarr = diceAreaDiv.getElementsByClassName("diceHolder");
	if(diceHolderarr.length >0 && diceHolderarr[0].tagName.toLowerCase() == "div") {
		this.diceHolderDiv = diceAreaDiv.getElementsByClassName("diceHolder")[0];
	} else {
		console.warn("DiceArea: cannot find a diceHolder div in " + areaName + ", one will be made.");
		var holderDiv = document.createElement("div");
		holderDiv.className = "diceHolder";
		diceAreaDiv.appendChild(holderDiv);
		this.diceHolderDiv = holderDiv;
	}
	this.totalValue = 0;
	//Called everytimg the sum of the dice values changes,
	//can be overwritten.
	this.displaySum = function(sum) {};
	return this;
}


DiceArea.prototype.updateSum = function() {
	var sum = 0;
	for (var i=0; i<this.dice.length; i++) {
		sum += this.dice[i].value;
	}
	this.totalValue = sum;
	this.displaySum(sum);
};

DiceArea.prototype.rollDice = function() {
	var sum = 0;
	for (var i=0; i<this.dice.length; i++) {
		sum += this.dice[i].roll();
	}
	this.totalValue = sum;
	this.displaySum(this.totalValue);
};

DiceArea.prototype.rollDie = function(dieId) {
	this.dice[dieId].roll();
	this.updateSum();
};

DiceArea.prototype.addDie = function() {
	var id = this.dice.length;
	this.dice.push(new Die(this, id));
	this.updateSum();
	return id;
};

DiceArea.prototype.removeLast = function() {
	if (this.dice.length === 0) {
		return;
	}
	var die = this.dice.pop().del();
	this.updateSum();
}
