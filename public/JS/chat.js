var chat = {
    init(){
        //initialize socket
        this.socket = io(); //websockets library
        document.getElementById("text").addEventListener("keydown", function(e){//als iemand op enter drukt
            if(e.keyCode === 13){
                chat.sendMessage(e.target);
            }
        });
        chat.initializeSocket();
    },
    initializeSocket(){//start de event lsiteners
        this.socket.on("connect", function(){
            console.log("Connected!");
            chat.pushMessage("Welkom. Je bent verbonden met de chatserver.");
            //reset reconnectTimes
            if(parseInt(localStorage.getItem("reconnectTimes")) > 0){
                localStorage.setItem("reconnectTimes", 0);
            }
        });
        this.socket.on('message', function(msg){//wanneer een bericht binen komt
            chat.pushMessage(msg);
        });        
        this.socket.on('disconnect', function(){//Wanneer een socket disconnect
            var times = parseInt(localStorage.getItem("reconnectTimes") || 0); //verkrijg reconnect telling van cookie
            if(times < 3){//minder dan 3
                localStorage.setItem("reconnectTimes", ++times);
                chat.pushMessage("Connectie gefaald. Opnieuw proberen...");
                setTimeout(function(){//herlaad
                    window.location.reload();
                }, 1000);
            }else{
                localStorage.setItem("reconnectTimes", 0);
                chat.pushMessage("Mislukt. Mogelijk ben je uitgelogd of is de verbinding verloren. Refresh de pagina");
            }
        });
    },
    sendMessage(el){//verzend een bericht naar de rest
        var message = "Jij: " + el.value;
        chat.pushMessage(message);
        this.socket.emit('message', el.value); //naar server
        el.value = "";
    },
    pushMessage(message){//laat een bericht zien in de textarea
        var textarea = document.getElementById("texta");
        textarea.innerHTML += message + "<br>";
        textarea.scroll(0,textarea.scrollHeight);
    }

}
window.addEventListener("load", function(){//laad event
    chat.init();
})
