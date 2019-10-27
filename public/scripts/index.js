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

  $.get("/hist", function(data) {      
    var i;
    for (i = 0; i < 3; i++) {
      if (data[i][0].length > 50){
        data[i][0] = data[i][0].substring(0,50) + "...";
      }
    }
  
    $("#row-one").html("<div  name='button'>"+data[0][0]+" , "+data[0][1]+"</div>");
    $("#row-two").html("<div  name='button'>"+data[1][0]+" , "+data[1][1]+"</div>");
    $("#row-three").html("<div  name='button'>"+data[2][0]+" , "+data[2][1]+"</div>");
  });

  $.get('/getUser',function(data){
    var string = JSON.stringify(data);
    var obj = JSON.parse(string);
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
                      //$("#history-box tr").hide();
                    } else if (result =="cannot be found"){
                    } else{
                      $.get("/hist", function(data) {
                        
                        var i;
                        for (i = 0; i < 3; i++) {
                          if (data[i][0].length > 50){
                            data[i][0] = data[i][0].substring(0,50) + "...";
                          }
                        }
              
                        $("#row-one").html("<div  name='button'>"+data[0][0]+" , "+data[0][1]+"</div>");
                        $("#row-two").html("<div  name='button'>"+data[1][0]+" , "+data[1][1]+"</div>");
                        $("#row-three").html("<div  name='button'>"+data[2][0]+" , "+data[2][1]+"</div>");
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
