$(document).ready(function() {
	
	$.get("/people", function(data) {
		$("#get-all-container").html(JSON.stringify(data, null, 2));
	});
	
	$("#add-person-button").click(function() {
		$.ajax({
			type: "POST",
			url: "/people",
			data: {name: $("#add-person").val()},
			success: function() {
				$.get("/people", function(data) {
					$("#get-all-container").html(JSON.stringify(data, null, 2));
				});
			}
		});
	});
	
	$("#get-friends-button").click(function() {
		location.href = "/test"
	});
	
	$("#add-friend-button").click(function() {
		var personID = $("#add-friend-self").val();
		var friendID = $("#add-friend-friend").val();
		$.ajax({
			type: "PUT",
			url: "/people/" + personID,
			data: {id: friendID},
			success: function() {
				$.get("/people", function(data) {
					$("#get-all-container").html(JSON.stringify(data, null, 2));
				});
			}
		});
	});
	
	$("#remove-person-button").click(function() {
		var personID = $("#remove-person").val();
		$.ajax({
			type: "DELETE",
			url: "/people/" + personID,
			success: function() {
				$.get("/people", function(data) {
					$("#get-all-container").html(JSON.stringify(data, null, 2));
				});
			}
		});
	});
	
});