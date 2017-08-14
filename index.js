var Candidates = function(code) {
	if (code) this.code = code;
	this.cost = 9999;
};
Candidates.prototype.code = '';
Candidates.prototype.random = function(length) {
	while (length--) {
		this.code += String.fromCharCode(Math.floor(Math.random() * 255));
	}
};
Candidates.prototype.calcCost = function(compareTo) {
	var total = 0;
	for (i = 0; i < this.code.length; i++) {
		total +=
			(this.code.charCodeAt(i) - compareTo.charCodeAt(i)) *
			(this.code.charCodeAt(i) - compareTo.charCodeAt(i));
	}
	this.cost = total;
};
Candidates.prototype.combine = function(cand) {
	var pivot = Math.round(this.code.length / 2) - 1;

	var child1 = this.code.substr(0, pivot) + cand.code.substr(pivot);
	var child2 = cand.code.substr(0, pivot) + this.code.substr(pivot);

	return [new Candidates(child1), new Candidates(child2)];
};
Candidates.prototype.mutate = function(chance) {
	if (Math.random() > chance) return;

	var index = Math.floor(Math.random() * this.code.length);
	var upOrDown = Math.random() <= 0.5 ? -1 : 1;
	var newChar = String.fromCharCode(this.code.charCodeAt(index) + upOrDown);
	var newString = '';
	for (i = 0; i < this.code.length; i++) {
		if (i == index) newString += newChar;
		else newString += this.code[i];
	}

	this.code = newString;
};
var Group = function(goal, size) {
	this.members = [];
	this.goal = goal;
	this.stageNumber = 0;
	while (size--) {
		var gene = new Candidates();
		gene.random(this.goal.length);
		this.members.push(gene);
	}
};
Group.prototype.display = function() {
	document.body.innerHTML = '';
	document.body.innerHTML += '<h2>Stage: ' + this.stageNumber + '</h2>';
	document.body.innerHTML += '<ul>';
	for (var i = 0; i < this.members.length; i++) {
		document.body.innerHTML +=
			'<li>' + this.members[i].code + ' (' + this.members[i].cost + ')';
	}
	document.body.innerHTML += '</ul>';
};
Group.prototype.sort = function() {
	this.members.sort(function(a, b) {
		return a.cost - b.cost;
	});
};
Group.prototype.stage = function() {
	for (var i = 0; i < this.members.length; i++) {
		this.members[i].calcCost(this.goal);
	}

	this.sort();
	this.display();
	var children = this.members[0].combine(this.members[1]);
	this.members.splice(this.members.length - 2, 2, children[0], children[1]);

	for (var i = 0; i < this.members.length; i++) {
		this.members[i].mutate(0.5);
		this.members[i].calcCost(this.goal);
		if (this.members[i].code == this.goal) {
			this.sort();
			this.display();
			return true;
		}
	}
	this.stageNumber++;
	var scope = this;
	setTimeout(function() {
		scope.stage();
	}, 20);
};

var population = new Group('JavaScript', 25);
population.stage();
