component accessors="true" displayname="eCompare" hint="I compare objects to each other and return a boolean" {
	property name="result" type="boolean" required="false" hint="I am the eval" default=" ";
	property name="source" type="string" required="true" hint="I am the souce value";
	property name="value" type="string" required="true" hint="I am the comparison value";
	
	public void function init(){
		this.setResult(false);
	}
	
	public void function exec(){
		this.setResult(false);
				if(Compare(this.getSource(),this.getValue()) EQ 0){
					this.setResult(true);
				}
	}
	
	
}