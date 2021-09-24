JournalCode	JournalLib	EcritureNum	EcritureDate	CompteNum	CompteLib	CompAuxNum	CompAuxLib	PieceRef	PieceDate	EcritureLib	Debit	Credit	EcritureLet	DateLet	ValidDate	Montantdevise	Idevise	CodeEtbt
<#list report.transactions as txn>
${txn.type}	${txn.typetext}	${txn.glnumber}	${txn.glnumberdate}	${txn.accnumber}	${txn.accname}	${txn.entityId}	${txn.entityName}	${txn.tranid}	${txn.docdate}	${txn.memo}	${txn.debit}	${txn.credit}			${txn.trandate}	${txn.fxamount}	${txn.currencytext}	${siret}
</#list>