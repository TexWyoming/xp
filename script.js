$(document).ready(function() {
	$.ajax({
		type: "GET",
		url: "level_chart.csv",
		dataType: "text",
		success: process_level_chart
	});
});

var level_data = new Object();

function process_level_chart(csv_data) {
	var lines = csv_data.split("\n");
	for (var i=1; i<lines.length; i++) {
		var line = lines[i].trim();
		if (line.length < 1) continue;
		var split_line = line.split(",");
		var level_number = parseInt(split_line[0]);
		var level_xp = parseInt(split_line[1]);
		level_data[level_number] = level_xp;
	}
	$.ajax({
		type: "GET",
		url: "xp_chart.csv",
		dataType: "text",
		success: process_xp_chart
	});
}

function process_xp_chart(csv_data) {
	var current_level = 0;
	var current_xp = 0;
	var lines = csv_data.split("\n");
	for (var i=1; i<lines.length; i++) {
		line = lines[i].trim();
		if (line.length < 1) continue;
		var split_line = line.split(",");
		var xp_date = split_line[0].trim();
		var xp_name = split_line[1].trim();
		var xp_amount = parseInt(split_line[2]);
		current_xp += xp_amount;
		var level_flag = false;
		while (current_xp >= level_data[current_level + 1]) {
			level_flag = true;
			current_level += 1;
		}
		var row_class = "";
		var level_badge = "";
		if (level_flag) {
			row_class = ' class="success"';
			level_badge = ' [' + current_level + ']';                    
		}
		var new_row = '<tr' + row_class + '>'
		+ '<td>' + xp_date + '</td>'
		+ '<td>' + xp_name + '</td>'
		+ '<td>' + xp_amount + '</td>'
		+ '<td>' + current_xp + level_badge + '</td>'
		+ '</tr>';
		$('#table-body').append(new_row);
	}
	var next_xp = level_data[current_level + 1];
	var last_xp = level_data[current_level];
	
	// workaround for change from medium to fast xp rate
	if (current_level == 10) next_xp = 155000;
	if (current_level == 11) last_xp = 105000;
	
	var xp_this_level = current_xp - last_xp;
	var xp_between_levels = next_xp - last_xp;
	var past_percent = 100 * last_xp / next_xp;
	var percent_this_level = 100 * xp_this_level / next_xp;
	var percent_just_this_level = 100 * xp_this_level / xp_between_levels;
	$('#past-bar').css('width', past_percent + '%');
	$('#current-bar').css('width', percent_this_level + '%');
	$('#just-current-bar').css('width', percent_just_this_level + '%');
	$('#total-xp').append(current_xp + ' / ' + next_xp);
	$('#level').append(current_level + ': ' + xp_this_level + ' / ' + xp_between_levels);
}
