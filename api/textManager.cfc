component restpath="/textManager" rest="true"
{
	remote string function Send(required string cellphone restargsource="Path", required string message restargsource="Path", required string service restargsource="Path") httpmethod="GET" restpath="/Send/{cellphone}/{message}/{service}" produces="application/json" {
		var textManager = CreateObject("component", "com.obj.textManager");
		var mtmp = 'Not Sent';
		textManager.send(arguments.cellphone, arguments.message, arguments.service);
		mtmp = 'Text Sent to ' & arguments.cellphone;
		return mtmp;
	} 
}