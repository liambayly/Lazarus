<cfcomponent accessors="true" displayname="eDirectory" hint="Retrieves the directory information">
	<cfproperty name="type" type="string" required="false" hint="The action of the directory IE list" default="list"/>
	<cfproperty name="path" type="string" required="true" hint="the directory path"/>
	<cfproperty name="result" type="query" required="false" hint="I am the return"/>

	<cffunction name="init" returntype="void">
		<cfset this.setType('list')/>
		<cfset this.setPath('')/>
		<cfset this.setResult(QueryNew("Name", "VarChar"))/>
	</cffunction>

	<cffunction name="exec" returntype="void">
		<cfdirectory action="#this.getType()#" directory="#this.getPath()#" name="tmpRet"/>
		<cfset this.setResult(tmpRet)/>
	</cffunction>

</cfcomponent>