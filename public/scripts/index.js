function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

$(document).ready(function() {

  $.get('/getUser',function(data){
    var string = JSON.stringify(data);
    var obj = JSON.parse(string);
    console.log(obj);
    $('#updateUser').html(obj);
  })

  $("#about").click(function() {
    location.href = "/about";
  });
    $("#calculate-button").click(function() {
        var text = $("#analysis-text").val();
        var language = $("#language-dropdown").val();
		$.ajax({
			type: "GET",
			url: "/amzapi/"+text+"/"+language,
			data: {},
			success: function(data) {
				var string = JSON.stringify(data);
                var objectValue = JSON.parse(string);
                $("#results-box").html("Result: " + objectValue["Sentiment"]);
                $("#positive").html("Positive: " + objectValue["SentimentScore"]["Positive"]);
                $("#negative").html("Negative: " + objectValue["SentimentScore"]["Negative"]);
                $("#mixed").html("Mixed: " + objectValue["SentimentScore"]["Mixed"]);
                $("#neutral").html("Neutral: " + objectValue["SentimentScore"]["Neutral"]);
                $.post("/hist/"+text+"/"+objectValue["Sentiment"],function(result){
                    if(result=="not logged in"){
                      console.log(result);
                      //$("#history-box tr").hide();
                    } else if (result =="cannot be found"){
                      console.log(result);
                    } else{
                      $.get("/hist", function(data) {
                        //$("#history-box tr").show();
                        //$("#history-box").show();
                        //$("#history-box").remove();
                        //$("#history-box").append("<tr><th>History</th></tr>");
                      });
                    }
                })
			}
		});
    });
    
    $("#clear-button").click(function() {
        $("#analysis-text").val('');
		
	});
});
