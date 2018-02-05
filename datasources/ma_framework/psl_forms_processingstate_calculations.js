/**
 * @properties={type:12,typeid:36,uuid:"61A17DF5-3BFE-4714-B72D-EB10C5121B5E"}
 */
function status_desc()
{
	if(!status)
		return null;
	
	if(status['error'])
		return scopes.psl.Pratiche.StatoElaborazione.FormatStatus(scopes.psl.Pratiche.StatoElaborazione.ERRORE);
	else
		return scopes.psl.Pratiche.StatoElaborazione.FormatStatus(status['status']);
}
