const MESSAGES = {
  WORKER_EXIT : "WE",
  CALCULATE: "calculate",
  INIT : "init"
};

let ChildDT = null;
let child  = null;

const loadChild = (ChildDT)=>{
    if(!ChildDT){
      importScripts('./child.js');
    }
};

const sendMessage = (message, payload = [])=>{
    console.log(`message: ${message}, payload: ${payload}`);

    if(typeof message === "string"){
        postMessage({message,payload});
    }else{
        // in case of returning the received data back
        postMessage(message);
    }
}

onmessage = (e)=> {
  console.log('Message received from main script');
  if(e.data && e.data.message){
    switch(e.data.message){
        case MESSAGES.WORKER_EXIT:
            close();
            break;
        case MESSAGES.CALCULATE:
            sendMessage(e.data.message, e.data.payload.reduce((t,v)=>t*v,1));
            break;
        case MESSAGES.INIT:
            loadChild(ChildDT);
            child = !!child || new Child();
            setTimeout(()=>sendMessage(e.data), 5000);
            break;
    }
  }
  
}

onerror = function(value) {
    console.log(value.message);
}