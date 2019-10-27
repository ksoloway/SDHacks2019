$(document).ready(function() {
    $("#signup-button").click(function() {
        if($("#signup-username").val()!=''){
            var usr = $("#signup-username").val();
        } else{
            return;
        }
		if($("#signup-password").val()!=''){
            var pwd = $("#signup-password").val();
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
                    location.href="/loggedin";
                }
				
			}
		});
    });
});
  