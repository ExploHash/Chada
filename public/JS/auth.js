var auth = {
    messageShown: false,
    init(){
        if(document.getElementsByClassName("registerform").length > 0){//als een register formulier word gesubmit
            document.getElementsByClassName("registerform")[0].addEventListener("submit", function(e){
                e.preventDefault();
                auth.submitForm(e.target, "/api/register");            
                return false;
            });
        }
        if(document.getElementsByClassName("loginform").length > 0){//als een loginform wordt gesubmit
            document.getElementsByClassName("loginform")[0].addEventListener("submit", function(e){
                e.preventDefault();
                auth.submitForm(e.target, "/api/login");
                return false;
            });
        }
    },
    submitForm(el, url){//maakt een call naar de
        //send
        $.post(url, $(el).serialize(), function(data) {//post naar api
            if(data.message){
                auth.showMessage(data.message);
            }else{
                auth.showMessage("Succesvol");
            }
            //small delay to give server the time to update the sessie
            setTimeout(function(){
                window.location = "/chat"
            }, 500);
        }).fail(function(data){
            if(data.responseJSON.message){
                auth.showMessage(data.responseJSON.message);
            }else{
                auth.showMessage("Something else went wrong")
            }
        });
    },
    showMessage(msg){//laat een message zien onder het form
        var el = document.getElementById("formerror");
        el.innerHTML = msg;
        el.style.maxHeight = "300px";
    }
}
window.addEventListener("load", function(){//load event
    auth.init();
})
