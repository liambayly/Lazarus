
component restpath="/javaManager" rest="true"
{
	remote string function checkMemory() httpmethod="GET" restpath="/checkMemory" produces="application/json" {
		var javaManager = CreateObject("component", "com.obj.javaManager");
		var mtmp = javaManager.checkMemory();
		return mtmp;
	}


	remote string function clearMemory() httpmethod="GET" restpath="/clearMemory" produces="application/json" {
		var javaManager = CreateObject("component", "com.obj.javaManager");
		javaManager.clearMemory();
		return 'Memory Cleared';
	} 
}