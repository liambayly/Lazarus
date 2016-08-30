<cfcomponent accessors="true" displayname="eSpreadsheet" hint="Invokes Custom Tags">
	<cfproperty name="action" type="string" required="true"	hint="One of the following:read Reads the contents of an XLS format file.update Adds a new sheet to an existing XLS file. You cannot use the uppdate action to change an existing sheet in a file. For more information, see Usage.write Writes a new XLS format file or overwrites an existing file."/>
	<cfproperty name="source" type="string" required="true" hint="The pathname of the file to read. , The pathname of the file that is written."/>
	<cfproperty name="name" type="string" required="true" hint="read action:  The variable in which to store the spreadsheet file data. Specify name or query.write and update actions:  A variable containing CSV-format data or an ColdFusion spreadsheet object containing the data to write. Specify the name or query."/>
	<cfproperty name="excludeHeaderRow" type="boolean" required="false"	hint="If set to true, excludes the headerrow from being included in the query results.The attribute helps when you read Excel as a query. When you specify the headerrow attribute, the column names are retrieved from the header row. But they are also included in the first row of the query. To not include the header row, set true as the attribute value."/>
	<cfproperty name="query" required="true" hint="read action:  The query in which to store the converted spreadsheet file. Specify format, name, or query.write and update actions:  A query variable containing the data to write. Specify name or query."/>
	<cfproperty name="columns" type="string" required="false" hint="Column number or range of columns. Specify a single number, a hypen-separated column range, a comma-separated list, or any combination of these; for example: 1,3-6,9."/>
	<cfproperty name="columnNames" type="string" required="false" hint="Comma-separated column names."/>
	<cfproperty name="format" type="string" required="false" hint="Format of the data represented by the name variable.All: csv On read, converts an XLS file to a CSV variable.On update or write, Saves a CSV variable as an XLS file.Read only: html Converts an XLS file to an HTML variable.The cfspreadsheet tag always writes spreadsheet data as an XLS file. To write HTML variables or CSV variables as HTML or CSV files, use the cffile tag."/>
	<cfproperty name="headerRow" type="string" required="false" hint="Row number that contains column names."/>
	<cfproperty name="overWrite" type="boolean" required="false" hint="A Boolean value specifying whether to overwrite an existing file."/>
	<cfproperty name="password" type="string" required="false" hint="Set a password for modifying the sheet.Note: Setting a password of the empty string does no unset password protection entirely; you are still prompted for a password if you try to modify the sheet."/>
	<cfproperty name="rows" type="string" required="false" hint="The range of rows to read. Specify a single number, a hypen-separated row range, a comma-separated list, or any combination of these; for example: 1,3-6,9."/>
	<cfproperty name="sheet" type="string" required="false" hint="Number of the sheet. For the read action, you can specify sheet or sheetname."/>
	<cfproperty name="sheetName" type="string" required="false" hint="Name of the sheet For the read action, you can specify sheet or sheetname.For write and update actions, the specified sheet is renamed according to the value you specify for sheetname."/>
	<cfproperty name="spreadSheet" requried="false" hint="I am the spreadsheet object"/>
	<cfproperty name="result" required="false"	hint="I am the return"/>

	<cffunction name="init" returntype="void">
		<cfset this.setAction('write') />
		<cfset this.setExcludeHeaderRow('false')/>
		<cfset this.setName('tmp')/>
		<cfset this.setQuery('retval')/>
		<cfset this.setFormat('CSV')/>
		<cfset this.setSheetName('main')/>
		<cfset this.setResult('') />
	</cffunction>

	<cffunction name="exec">
		<cfswitch expression="#ucase(this.getAction())#">
			<cfcase value="READ">
				<cfset return = readSpreadSheet()/>
			</cfcase>
			<cfcase value="UPDATE">
				<cfset return = updateSpreadSheet()/>
			</cfcase>
			<cfcase value="WRITE">
				<cfset return = writeSpreadSheet()/>
			</cfcase>
			<cfdefaultcase>
				<cfset result = "You must specify an action and a source in order to use this object"/>
				<cfset this.setResult(result)/>
			</cfdefaultcase>
		</cfswitch>
	</cffunction>
	
	<cffunction name="readSpreadSheet">
		<cfspreadsheet action="read" src="#this.getSource()#" query="tmpQry"> 
		<cfset this.setResult(tmpQry)/>
	</cffunction>	
	
	<cffunction name="updateSpreadSheet">
		
	</cffunction>
	
	<cffunction name="writeSpreadSheet">
		<cfset createSSObject()/>
		<cfset tmpSS = this.getSpreadSheet()/>
		<cfspreadsheet action="write" filename="#this.getSource()#" name="tmpSS" sheetname="#this.getSheetName()#" overwrite=true> 		
		<cfset this.setResult('The file has been successfully written to the server')/>
	</cffunction>
	
	<cffunction name="createSSObject">
		<cfset q = this.getQuery()/>
		<cfset t = spreadsheetNew()/>
		<cfset spreadsheetAddRow(t,this.getHeaderRow())/>
		<cfset spreadsheetFormatRow(t,{bold=true,fgcolor="lemon_chiffon",fontsize=14},1)/>
		<cfset spreadsheetAddRows(t,q)/>
		<cfset this.setSpreadSheet(t)/>
	</cffunction>

</cfcomponent>