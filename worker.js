const WORKER_EXIT = "WE";

onmessage = function(e) {
  console.log('Message received from main script');
  if(e.data.map(v=>v.toUpperCase()).indexOf(WORKER_EXIT) > -1){
      close();
      console.log(`Terminating worker by ${WORKER_EXIT}`);
  }else{
      let result = e.data.reduce((total,v)=>total*v,1);
      result = !!result ? result : 0;
      var workerResult = `Result: ${result}`;
      console.log('Posting message back to main script');
      postMessage(workerResult);
      importScripts('hehe.js');
  }
}

onerror = function(value) {
    console.log(value);
}