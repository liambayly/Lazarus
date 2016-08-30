component displayname="sendText" hint="I and the data object that sends texts to phones"{

	public void function send(required string cellnumber, required string message, required string service){
		var	eText = new BAO.eText();
			eText.setProvider([arguments.service]);
			eText.setCellNumber([arguments.cellnumber]);
			eText.setMessage(arguments.message);
			eText.exec();
	}

} 