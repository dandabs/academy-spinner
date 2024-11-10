var data = JSON.parse(localStorage.getItem("scoreboard"));

if (data == null) {
	data = {};
}

function load_scoreboard(names) {
	var list = document.getElementById("scoreboard_list");
	
	for (var i = 0; i < names.length; i++) {
		var name = names[i];

		if (data[name] == undefined) {
			data[name] = 0;
		}
	}

	data_sorted = [];

	for (var i = 0; i < names.length; i++) {
		var name = names[i];
		data_sorted.push([name, data[name]]);
	}

	data_sorted.sort(function(a, b) {
		return b[1] - a[1];
	});

	for (var i = 0; i < data_sorted.length; i++) {
		add_scoreboard_entry(data_sorted[i][0], list, data);
	}

	localStorage.setItem("scoreboard", JSON.stringify(data));
}

function add_scoreboard_entry(name, scoreboard_list, data) {
	scoreboard_list.innerHTML += `<li>${name} - ${data[name]}</li>`;
}

load_scoreboard(["Aaron Millen", "Connor Forde", "Charlotte McKnight", "Matthew Jordan", "James Liam Butler", "Dan Adams", "Dylan McKenzie", "Dylan Brânda"]);