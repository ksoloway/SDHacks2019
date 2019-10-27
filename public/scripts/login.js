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

  $("#logout").click(function() {
    location.href = "/";
  });

  $("#about").click(function() {
    location.href = "/about";
  });

  $("#login-button").click(function() {
    if($("#login-username").val()!=''){
        var usr = $("#login-username").val();
    } else{
        return;
    }
    if($("#login-password").val()!=''){
            var pwd = $("#login-password").val();
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
                    location.href = "/loggedin";
                }
      }
    });
    });
  
});
