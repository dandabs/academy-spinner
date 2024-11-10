var scoreboard_data = JSON.parse(localStorage.getItem("scoreboard"));

if (scoreboard_data == null) {
	scoreboard_data = {};
}

function loadScoreboard() {
	names = [
		"Aaron Millen",
		"Connor Forde",
		"Charlotte McKnight",
		"Matthew Jordan",
		"James Liam Butler",
		"Dan Adams",
		"Dylan McKenzie",
		"Dylan Brânda"
	]

	console.log("Loading scoreboard");
	var list = document.getElementById("scoreboard_list");

	scoreboard_list.innerHTML = "";

	for (var i = 0; i < names.length; i++) {
		var name = names[i];

		if (scoreboard_data[name] == undefined) {
			scoreboard_data[name] = 0;
		}
	}

	data_sorted = [];

	for (var i = 0; i < names.length; i++) {
		var name = names[i];
		data_sorted.push([name, scoreboard_data[name]]);
	}

	data_sorted.sort(function (a, b) {
		return a[1] - b[1]; // Sort by reverse score
	});

	for (var i = 0; i < data_sorted.length; i++) {
		addScoreboardEntry(data_sorted[i][0], list, scoreboard_data, i + 1);
	}
}

function addScoreboardEntry(name, scoreboard_list, scoreboard_data, placement) {
	placement_suffix = "th";

	if (placement == 1) {
		placement_suffix = "st";
	} else if (placement == 2) {
		placement_suffix = "nd";
	} else if (placement == 3) {
		placement_suffix = "rd";
	}

	scoreboard_list.innerHTML += `<li class="scoreboard-item">
		<p>${placement}${placement_suffix}. ${name}</p>
		<input type="text" id="${name}-scoreboard" value=${scoreboard_data[name]} oninput="saveData('${name}')" onfocusout="loadScoreboard()">
	</li>`;
}

function saveData(name) {
	elemtent = document.getElementById(`${name}-scoreboard`);
	scoreboard_data[name] = parseInt(elemtent.value);

	localStorage.setItem("scoreboard", JSON.stringify(scoreboard_data));
}

loadScoreboard();