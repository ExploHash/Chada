var io = {};
var cookieParser = require("cookie-parser")

module.exports = {
    init: function(io, store){
        io = io;
        this.store = store;
        var self = this;
        io.on('connection', function(socket){//wanneer een socket connectie
            console.log("CONNECTION");
            var session = self.getSession(socket); //verkrijf gebruikers sessie
            if(session && session.name){//check of die bestaat voor authorizatie
                console.log("AUTHORIZED");
                socket.join('room1', function(){//join een room
                    socket.broadcast.to('room1').emit('message', "Connected " + session.name);
                    socket.on('message', function(msg){//wanneer er een bericht wordt ontvangen
                        let session = self.getSession(socket); //check opnieuw voor sessie
                        if(session && session.name){//opnieuw check authorisatie
                            console.log("Received", msg, "from name", session.name);
                            socket.broadcast.to('room1').emit('message', session.name + ": " + msg); //echo de message naar alle andere gebruikers
                        }else{//disconnect wanneer geen geldige sessie
                            socket.disconnect('unauthorized');
                        }
                    });
                });
            }else{//disconnect wanneer geen geldige sessie
                socket.disconnect('unauthorized');
            }
            socket.on('disconnect', function(){
                console.log("DISCONNECT");
            });
        });
    },
    getSession(socket){
        //haal het sid van de cookie
        var cookie = socket.client.request.headers.cookie;
        var location = cookie.indexOf("connect.sid") + 12; 
        var sid = cookie.substring(location + 4, cookie.indexOf(";", location)).split(".")[0];

        var sids = Object.keys(this.store.sessions);
        if(sids.includes(sid)){//loop door de ids van de memorystore om te kijke of die bestaat
            var session = JSON.parse(this.store.sessions[sid]); //verkijg de sessie en parse hem
            if(session.isLoggedIn){//check of de user is ingelogd
                return session;
            }else{
                return false;
            }
        }
    },
}
