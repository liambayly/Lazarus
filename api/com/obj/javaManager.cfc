component displayname="javaManager" hint="I run the java server side command system"{

	public string function checkMemory(){
		var urlRet = '';
		var runtime = CreateObject("java","java.lang.Runtime").getRuntime();
		var fm = runtime.freememory();
			fm = int((fm/1024)/1024);
			usedmem = 1270-fm;
			urlRet = 'Free Memory ' & fm & 'megs' & '/' & 'Used Memory: ' & usedmem & 'megs';
		return urlRet;
	}
	
	public void function clearMemory(){
		jvObj = createObject("java", "java.lang.System");
		jvObj.gc();
		jvObj.runFinalization();
	}
	
} 