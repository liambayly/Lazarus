<cfcomponent accessors="true" displayname="eModule" hint="Invokes Custom Tags">
	<cfproperty name="moduleType"			type="string" required="true"	hint="I determine which type of cfmoculde call to use, Template or Name"/>
	<cfproperty name="moduleValue"			type="string" required="true"	hint="Path to access the Custom Tag"/>
	<cfproperty name="attributeCollection"	type="struct" required="false"	hint="Structure of attribute names and values passed to the Custom Tag"/>
	<cfproperty name="result"				type="string" required="false"	hint="I am the return"/>

	<cffunction name="init" returntype="void">
		<cfset this.setModuleType('template') />
		<cfset this.setModuleValue('') />
		<cfset this.setAttributeCollection(structNew()) />
		<cfset this.setResult('') />
	</cffunction>

	<cffunction name="eModule" returntype="string">
		<cfsavecontent variable="result">
			<cfswitch expression="#moduleType#">
				<cfcase value="template">
					<cfmodule template="#moduleValue#" attributecollection="#attributeCollection#">
				</cfcase>
				<cfcase value="name">
					<cfmodule name="#moduleValue#" attributecollection="#attributeCollection#">
				</cfcase>
				<cfdefaultcase>
					An invalid moduleType was passed to the eModule function.<br/><br/>
				</cfdefaultcase>
			</cfswitch>
		</cfsavecontent>

		<cfset this.setResult(result)/>
	</cffunction>	

</cfcomponent>