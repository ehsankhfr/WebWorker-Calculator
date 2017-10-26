const CLIENT_EXIT = "CE";

class Application {
	constructor(){
		this.worker = null;

		this.first = document.querySelector('#number1');
		this.second = document.querySelector('#number2');
		this.result = document.querySelector("#result");

		if(
			window.Worker && 
			this.first && 
			this.second && 
			this.result
		){
			try{
				// webWorker Load
				this.worker = new Worker('./worker.js');

				// event assignments
				this.first.onchange = this.onChange.bind(this);
				this.second.onchange = this.onChange.bind(this);
				this.worker.onmessage = this.onMessage.bind(this);
			} catch(ex) {
				console.error(`Error in initialization: ${ex.message}`);
			}
		}

	}

	onChange(){
		const values = [this.first.value,this.second.value];

		if(values.map(v=>v.toUpperCase()).indexOf(CLIENT_EXIT) > -1){
			console.log(`Terminating worker by ${CLIENT_EXIT}`);
			this.result.textContent = "-";
			return this.worker.terminate();
		}else{
			this.worker.postMessage(values);
		  	console.log('Message posted to worker');	
		}
	}

	onMessage(e) {
		this.result.textContent = e.data;
		console.log('Message received from worker');
	}
}

let app = new Application();