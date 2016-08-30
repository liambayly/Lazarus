component accessors="true" displayname="eStringBuilder" hint="Appends a string value and lets you retain it for the duration of the object" {
	property name="Str" type="string" required="false" hint="I am the order by" default=" ";
	
	
	public void function init(){
		this.setStr(' ');
	}
	
	public void function exec(val1){
		//var stringbldr = createObject("java", "java.lang.StringBuilder").init();
			tmps = this.getStr();
			tmpn = arguments.val1;
			tmpz = tmps & tmpn;
			this.setStr(tmpz);
	}
	
}