
$(document).ready(function() {

    $("#document-button").click(function() {
      $("#url-input").toggle();
      $("#parse-button").toggle();
    });

    $("#parse-button").click(function(){
      var text = $('#url-input').val();
      const exampleImage = text;
        const worker = new Tesseract.TesseractWorker();
        worker.recognize(exampleImage)
            .progress(progress => $("#analysis-text").val("loading"))
            .then(result => {
              console.log('result', result);
              $("#analysis-text").val(result.text);
            })
            .finally(() => worker.terminate()
            ).catch(e => {
              console.log(e);
            });
    });

    $("#signup").click(function() {
      location.href = "/signup";
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
            }
});
});
$("#clear-button").click(function() {
  $("#analysis-text").val('');

});

    
  });
  
  
  