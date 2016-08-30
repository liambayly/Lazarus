component accessors="true" displayname="eVal" hint="Evaluates strings based on criteria" {
	property name="str" type="string" required="false" hint="I am the item to evaluate" default=" ";
	property name="type" type="string" required="false" hint="I am the type to evaluate" default=" ";
	property name="result" type="boolean" required="false" hint="I am the return" default="false";
	
	public void function init(){
		this.setStr('');
		this.setType('');
		this.setResult(false);
	}
	
	public void function exec(){
		if(IsValid(this.getType(), this.getStr())){
			this.setResult(true);
		}
	}
	
	
}