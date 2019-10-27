$(document).ready(function() {
    $("#add-login-button").click(function() {
		var usr = $("#add-login").val();
		var pwd = $("#password").val();
		$.ajax({
			type: "GET",
			url: "/login/"+usr+"/"+pwd,
			data: {},
			success: function(data) {
				console.log(data);
			}
		});
    });

    $("#add-signup-button").click(function() {
		var usr = $("#add-signup").val();
		var pwd = $("#add-password").val();
		$.ajax({
			type: "POST",
			url: "/signup/"+usr+"/"+pwd,
			data: {},
			success: function(data) {
				console.log(data);
			}
		});
    });
    
    
});

