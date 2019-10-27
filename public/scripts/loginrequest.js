$(document).ready(function() {
    $("#add-login-button").click(function() {
        if($("#add-login").val()!=''){
            var usr = $("#add-login").val();
        } else{
            return;
        }
		if($("#password").val()!=''){
            var pwd = $("#password").val();
        } else{
            return;
        }
		$.ajax({
			type: "GET",
			url: "/login/"+usr+"/"+pwd,
			data: {},
			success: function(username) {
                if(username=="doesn't exist"){
                    console.log(username);
                } else if(username=="wrong password"){
                    console.log(username);
                } else{
                    console.log(username);
                }
			}
		});
    });

    $("#add-signup-button").click(function() {
        if($("#add-signup").val()!=''){
            var usr = $("#add-signup").val();
        } else{
            return;
        }
		if($("#add-password").val()!=''){
            var pwd = $("#add-password").val();
        } else{
            return;
        }
		$.ajax({
			type: "POST",
			url: "/signup/"+usr+"/"+pwd,
			data: {},
			success: function(username) {
                if(username=="already exist"){
                    console.log("already exist");
                } else{
                    console.log(username);
                }
				
			}
		});
    });
    
    
});
