const apn = require("apn")
const http = require("http")
const firebase = require("firebase")

let Devtokens = []

var config = {
  apiKey:'AIzaSyA_bqPay-0lbnsKhoQMzRAHc-Hq8pSRTqc',
  authDomain:"https://watchdog-e8aec.firebaseio.com",
  databaseURL:"https://watchdog-e8aec.firebaseio.com",
  storageBucket:'watchdog-e8aec.ppapot.com'
}

firebase.initializeApp(config);

sendNotify=async()=>{
  await firebase.database().ref("/Device/").once('value', (member) => {
    var members = Object.values(member.val());
    Devtokens = []
    for (let i = 0; i < members.length; i++) {
      if(members[i].notifST == true) {
        Devtokens.push(members[i].token)
      }
    }
  })


  let service = new apn.Provider({
    cert: "./cert.pem",
    key: "./key.pem",
  });
  
  let note = new apn.Notification({
    alert:  "有人來訪",
  });
  note.topic = "tw.edu.csu.csie.watchDog";
  
  await service.send(note, Devtokens)
  
  service.shutdown()
}

firebase.database().ref("/status/butten").on('value', (member) => {
  var butten = member.val()
  if (butten)sendNotify()
  firebase.database().ref("/status").update({
    butten: false
  })
  
})
