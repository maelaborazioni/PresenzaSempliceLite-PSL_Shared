/**
 * @properties={type:4,typeid:36,uuid:"9B450EAC-6235-478B-8319-E0F199B2524F"}
 */
function company_id_cliente()
{
	return globals.ma_utl_ditta_toCliente(company_id);
}

/**
 * @properties={type:12,typeid:36,uuid:"9DB5F9AB-4552-497F-8025-D67FAE71B36B"}
 */
function ragionesociale()
{
	return psl_hours_processingstate_to_ditte.ragionesociale;
}

/**
 * @properties={type:12,typeid:36,uuid:"17996448-3AC9-4EC0-8300-6E3DCBC67932"}
 */
function codditta()
{
	return psl_hours_processingstate_to_ditte.codice;
}

/**
 * @properties={type:12,typeid:36,uuid:"50ECF8E1-F83E-40D5-ACC1-65DBE0220D43"}
 */
function status_desc()
{
	if(!status)
		return null;
	
	if(status['error'])
		return scopes.psl.Presenze.StatoElaborazione.FormatStatus(scopes.psl.Presenze.StatoElaborazione.ERRORE);
	else
		return scopes.psl.Presenze.StatoElaborazione.FormatStatus(status['status']);
}

/**
 * @properties={type:93,typeid:36,uuid:"D7F0ECA6-398D-402F-AFD1-8DF6A0B3B8F5"}
 */
function month_date()
{
	return scopes.date.FromIntMonth(month);
}

/**
 * @properties={typeid:36,uuid:"E9EB3625-6235-4983-80B4-75083AC6F822"}
 */
function processing_state()
{
	return status.status || scopes.psl.Presenze.StatoElaborazione.DA_CARICARE;
}
