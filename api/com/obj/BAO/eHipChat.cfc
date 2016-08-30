component accessors="true" displayname="eHipChat" hint="This allows us to send notifications to the HipChat room EuropaSports under the user E Ninja" {
	property name="roomID" type="string" required="false" hint="I am the room ID I am optional" default="879326";
	property name="usrToken" type="string" required="false" hint="I am the auth Token sent to authorize" default="oQ8HpFIWMe11OnN6YONJsmJmbgCWklAqfNvGrF0c";
	property name="notificationColor" type="string" required="false" hint="I set the notification color background" default="purple";
	property name="messageFormat" type="string" required="false" hint="I set the message format text/html" default="html";
	property name="message" type="string" required="false" hint="I am the message" default="No Message sent";
	property name="notifyFlag" type="boolean" required="false" hint="I set the notification flag" default="true";
	
	//E Ninja Login for HipChat
	//notifications@europa-sports.net (Group in gmail)
	//europa999
	
	
	public void function init(){
		this.setRoomID('879326');
		this.setUsrToken('oQ8HpFIWMe11OnN6YONJsmJmbgCWklAqfNvGrF0c');
		this.setNotificationColor('purple');
		this.setMessageFormat('html');
		this.setMessage('No Message Sent');
		this.setNotifyFlag('true');
	}
	
	public void function exec(){
		stFields = {"color" = "#this.getNotificationColor()#", "message_format" = "#this.getMessageFormat()#", "message" = "#this.getMessage()#", "notify" = "#this.getNotifyFlag()#" };
	
		httpService = new http();
		httpService.setMethod("Post");
		httpService.setTimeOut(30);
		httpService.setURL("https://api.hipchat.com/v2/room/#this.getRoomID()#/notification");
		httpService.addParam(type="header", name='Content-Type', value='application/json');
		httpService.addParam(type="header", name='Authorization', value='Bearer #this.getUsrToken()#');
		httpService.addParam(type="body", value="#serializeJSON(stFields)#");
		httpService.objGet = httpService.send().getPrefix();
		httpService.content = httpService.objGet.filecontent;
	}
	
}