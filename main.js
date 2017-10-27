const MESSAGES = {
  WORKER_EXIT : "WE",
  CALCULATE: "calculate",
  INIT : "init"
};

const STATUSES = {
	ACTIVE: 'Active',
	INACTIVE: 'Inactive'
};

class Application {
	constructor(){
		this.worker = null;

		this.initialized = false;

		// user input and output
		this.form = [];

		this.form.first = document.querySelector('#number1');
		this.form.second = document.querySelector('#number2');
		this.form.result = document.querySelector("#result");

		this.form.terminateClient = document.querySelector("#terminateClient");
		this.form.terminateWorker = document.querySelector("#terminateWorker");
		this.form.reset = document.querySelector("#reset");
		this.form.status = document.querySelector("#status");

		this.initialize();
	}

	initialize(){
		// disable the inputs
		this.form.first.disabled = true;
		this.form.second.disabled = true;

		this.updateStatus(false);

		if(
			window.Worker && 
			this.form.reduce((r,e)=>!!r && !!e, true)
		){
			try{
				// webWorker Load
				this.worker = new Worker('./worker.js');

				// event assignments
				this.worker.onmessage = this.onMessage.bind(this);
				
				this.form.first.onchange = this.onChange.bind(this);
				this.form.second.onchange = this.onChange.bind(this);

				this.form.reset.onClick = this.onReset.bind(this);
				this.form.terminateClient.onclick = this.onTerminateClient.bind(this);
				this.form.terminateWorker.onclick = this.onTerminateWorker.bind(this);

				// initilaize the app
				this.sendMessage(MESSAGES.INIT);
			} catch(ex) {
				console.error(`Error in initialization: ${ex.message}`);
			}
		}
	}

	onReset(){
		this.initialize();
	}

	onTerminateClient(event){
		event.preventDefault();
		this.form.first.disabled = true;
		this.form.second.disabled = true;
		this.worker.terminate();
		this.updateStatus(false);
	}

	onTerminateWorker(event){
		event.preventDefault();
	 	this.form.first.disabled = true;
		this.form.second.disabled = true;
		this.sendMessage(MESSAGES.WORKER_EXIT);
		this.updateStatus(false);
	}

	onChange(){
		this.sendMessage(MESSAGES.CALCULATE, [this.form.first.value,this.form.second.value]);
	}

	onMessage(e) {
		if(e.data && e.data.message){
			switch(e.data.message){
			case MESSAGES.INIT:
				this.form.first.disabled = false;
			  	this.form.second.disabled = false;
			  	this.initialized = true;
			  	break;			  	
			case MESSAGES.CALCULATE:
			    this.form.result.textContent = e.data.payload;
			  	break;
			}
		}
		this.updateStatus();
	}

	sendMessage(message, payload = []){
		this.worker.postMessage({message,payload});
	}

	updateStatus(state = true){
		this.initialized = state;
		this.form.status.textContent = this.initialized ? STATUSES.ACTIVE : STATUSES.INACTIVE;
	}

	reset(){

	}
}

let app = new Application();