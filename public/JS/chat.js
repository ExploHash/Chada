var socket = io(); //websockets library

var chat = {
    init: function(){
        document.getElementById("text").addEventListener("keydown", function(e){//als iemand op enter drukt
            if(e.keyCode === 13){
                chat.sendMessage(e.target);
            }
        });
        chat.initializeSocket();
    },
    initializeSocket(){//start de event lsiteners
        socket.on('message', function(msg){
            console.log("Received", msg);
            chat.pushMessage(msg);
        });
        
        socket.on('disconnect', function(){
            chat.pushMessage("Verbinding verloren. Mogelijk is je sessie verlopen, refresh de pagina. Of je hebt geen internet meer.")
        });
    },
    sendMessage(el){//verzend een bericht naar de rest
        var message = "Jij: " + el.value;
        chat.pushMessage(message);
        socket.emit('message', el.value); //naar server
        el.value = "";
    },
    pushMessage: function(message){//laat een bericht zien in de textarea
        var textarea = document.getElementById("texta");
        textarea.innerHTML += message + "<br>";
        textarea.scroll(0,textarea.scrollHeight);
    }

}
window.addEventListener("load", function(){//laad event
    chat.init();
})
