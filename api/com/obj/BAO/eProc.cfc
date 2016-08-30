component accessors="true" displayname="eProc" hint="I manage and create the stored procedure calls for europa"{
	property name="name" type="string" required="true" hint="I am the name of the procedure bieng called";
	property name="dataSource" type="string" required="false" hint="I am the datasource used" default="EuropaEnterprise";
	property name="types" type="array" required="true" hint="I am an array of casting types passed to the procedure";
	property name="values" type="array" required="true" hint="I am an array of values matched to the casting types";
	property name="orderBy" type="string" required="false" hint="I am the order by" default="id";
	property name="result" type="query" hint="I am the return value from the object";
	property name="output" type="boolean" hint="I set wethere there is data returned from the procedure" default="false";
	property name="log" type="array" hint="I am the log file for this object I can be outputted to see whats happening";


	public void function init(){
		//Reset the values, this runs everytime new is called.
		this.setName('');
		this.setTypes(['NONE']);
		this.setValues(['NONE']);
		this.setLog(ArrayNew(1));
		this.setDataSource('EuropaEnterprise');
		
	}

	public void function addLog(required string iName, required string iVal){
		//This function appends the log 
		var tmpL = this.getLog();
		ArrayAppend(tmpL,arguments.iName & '-' & arguments.iVal);
	}

	public void function exec(){
		//Build the Stored Procedure
		var spService = new storedproc();
		var tmpVal = this.getValues();
		var tmpTyp = this.getTypes();
			spService.setDatasource(this.getDataSource()); 
			spService.setProcedure(this.getName());
				
			//Setting Log 
			addLog('DataSource',this.getDataSource());
			addLog('ProcedureName',this.getName());
//writeOutput('DataSource: #this.getDataSource()#<br/>');
//writeOutput('ProcedureName: #this.getName()#<br/>');
				
			//Check and see if types and values are set or not passed. 
			if(tmpTyp[1] NEQ 'NONE' && tmpVal[1] NEQ 'NONE'){
				//Checks to see if the values and types are the same length
				if(ArrayLen(this.getTypes()) IS ArrayLen(this.getValues())){
					//Loop through the values and types to create the proc params
					for(i=1;i LTE ArrayLen(this.getValues());i=i+1) {
						//Convert Common to SQL Type
						
						var SQLTmpType = 'cf_sql_' & tmpTyp[i];
						//Check to see if the value is blank, if so set the procparam to null
						
						//Add to Logs
						addLog('Type_orig#i#',tmpTyp[i]);
						addLog('Type_convert#i#',SQLTmpType);
//writeOutput('Type_orig#i#: #tmpTyp[i]#<br/>');
//writeOutput('Type_convert#i#: #SQLTmpType#<br/>');
						
						if(tmpVal[i] IS ''){
							spService.addParam(cfsqltype=SQLTmpType, type="in",NULL=true); 
							addLog('ParamLine#i#','spService.addParam(cfsqltype=#SQLTmpType#, type="in",NULL=true);');
//writeOutput('ParamLine#i#: spService.addParam(cfsqltype=#SQLTmpType#, type="in",NULL=true);<br/>');
						}else{
							spService.addParam(cfsqltype=SQLTmpType, type="in",value=tmpVal[i]); 
							addLog('ParamLine#i#','spService.addParam(cfsqltype=#SQLTmpType#, type="in",value=#tmpVal[i]#);');
//writeOutput('ParamLine#i#: spService.addParam(cfsqltype=#SQLTmpType#, type="in",value=#tmpVal[i]#);<br/>');
						}
					}
					//proc params built
				}
				//Values  and type lengths compared
			}
//writeDump(spService);
			//checking values and types to see if they were passed.
			if(this.getOutput()){
				spService.addProcResult(name="rs1");
				result = spService.execute();
				finalResult = result.getProcResultSets();
				this.setResult(finalResult.rs1);
			}else{
				result = spService.execute();
			}
	}
} 