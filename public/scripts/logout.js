$(document).ready(function() {
    $("#logout-button").click(function() {
        $.ajax({
			type: "PUT",
			url: "/logout",
			data: {},
			success: function(username) {
                if(username=="not logged in"){
                    console.log(username);
                } else{
                    console.log(username);
                    location.href="/";
                }
			}
		});
        // clear history here
        
    });

    
});
