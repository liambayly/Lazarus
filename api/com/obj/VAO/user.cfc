component{
	
	public boolean function validateEmail(val1){
		var tmpreturn = true;
				spService = new storedproc();
				spService.setDatasource("EuropaEnterprise"); 
				spService.setProcedure("spSearchTrainingUsers");
				spService.addParam(cfsqltype="cf_sql_varchar", type="in",NULL=true); 
				spService.addParam(cfsqltype="cf_sql_varchar", type="in",NULL=true); 
				spService.addParam(cfsqltype="cf_sql_varchar", type="in",value=arguments.val1); 
				spService.addParam(cfsqltype="cf_sql_varchar", type="in",NULL=true); 
				spService.addParam(cfsqltype="cf_sql_varchar", type="in",NULL=true); 
				spService.addParam(cfsqltype="cf_sql_varchar", type="in",NULL=true); 
				spService.addProcResult(name="rs1",resultset=1);
				result = spService.execute();
				finalResult = result.getProcResultSets();
				if(finalResult.rs1.id IS ''){
					tmpreturn = false;
				}else{
					tmpreturn = true;
				}
		return tmpreturn;
	}
	
}