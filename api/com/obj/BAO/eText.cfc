component accessors="true" displayname="eText" hint="Sends Text to Phone" {
	property name="provider" type="array" required="true" hint="I am an array of service providers";
	property name="cellNumber" type="array" required="true" hint="I am an array of cell numbers";
	property name="result" type="boolean" required="false" hint="I am the return" default="false";
	property name="message" type="string" required="true" hint="I am the message sent to the phone" default="";
	
	public void function init(){
		this.setProvider(['NONE']);
		this.setCellNumber(['NONE']);
		this.setResult(false);
		this.setMessage('');
	}
	
	public void function exec(){
		var tmpVal = this.getProvider();
		var tmpTyp = this.getCellNumber();
		
		//Check and see if types and values are set or not passed. 
			if(tmpTyp[1] NEQ 'NONE' && tmpVal[1] NEQ 'NONE'){
				//Checks to see if the values and types are the same length
				if(ArrayLen(this.getProvider()) IS ArrayLen(this.getCellNumber())){
					//Loop through the values and types to create the proc params
					for(i=1;i LTE ArrayLen(this.getCellNumber());i=i+1) {
						var theProvider = '';
						var theNumber = tmpTyp[i];
						 switch(Ucase(tmpVal[i])) { 
						 	case 'VERIZON':
						 		theProvider = '@vtext.com';
						 	break;
						 	case 'ATT':
						 		theProvider = '@txt.att.net';
						 	break;
						 	case 'SPRINT':
						 		theProvider = '@messaging.sprintpcs.com';
						 	break;
						 }
						 
						 var theEmail = theNumber & theProvider;
						 var mailerService = new mail();
							 mailerService.setTo(theEmail);
							 mailerService.setFrom('web@europasports.com');
							 mailerService.setSubject('');
							 mailerService.send(body=this.getMessage);
					}
					//proc params built
				}
				//Values  and type lengths compared
			}
			this.setResult('true');
	}
	
	
}