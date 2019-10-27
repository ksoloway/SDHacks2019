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
    $("#calculate-button").click(function() {
        var text = $("#analysis-text").val();
        var language = $("#language-dropdown").val();
		$.ajax({
			type: "GET",
			url: "/amzapi/"+text+"/"+language,
			data: {},
			success: function(data) {
                console.log(data);
				var string = JSON.stringify(data);
                var objectValue = JSON.parse(string);
                $("#results-box").html("Result: " + objectValue["Sentiment"]);
                $("#positive").html("Positive: " + objectValue["SentimentScore"]["Positive"]);
                $("#negative").html("Negative: " + objectValue["SentimentScore"]["Negative"]);
                $("#mixed").html("Mixed: " + objectValue["SentimentScore"]["Mixed"]);
                $("#neutral").html("Neutral: " + objectValue["SentimentScore"]["Neutral"]);
			}
		});
    });
    
    $("#clear-button").click(function() {
        $("#analysis-text").val('');
		
	});
});
