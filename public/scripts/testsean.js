$(document).ready(function() {
    $("#test-api-button").click(function() {
        var text = $("#test-api").val();
		$.ajax({
			type: "GET",
			url: "/amzapi/"+text+"/"+"English",
			data: {},
			success: function(data) {
				console.log(data);
			}
		});
	});
});