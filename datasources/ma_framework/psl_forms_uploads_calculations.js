/**
 * @properties={type:12,typeid:36,uuid:"56381EC6-D7C4-48EA-A623-DC3041ABDFA4"}
 */
function status_icon()
{
	var modulo = psl_forms_uploads_to_psl_moduli.getSelectedRecord();
	// documento caricato ma non ancora inviato
	if (updated && is_uploaded)
		return 'media:///status_warning_18.png';
	else
	if (modulo.upload_obbligatorio)
	{
		if(is_uploaded)
			return 'media:///status_ok_18.png';
		else
			return 'media:///status_error_18.png';
	}
	else
		return 'media:///status_ok_18.png';
}

/**
 * @properties={typeid:36,uuid:"BF15F407-8454-4F9E-8257-5F52FB9C5B37"}
 */
function status_tooltip()
{
	var modulo = psl_forms_uploads_to_psl_moduli.getSelectedRecord();
	// documento caricato ma non ancora inviato
	if (updated && is_uploaded)
		return 'Documento non ancora inviato allo studio';
	else
	if (modulo.upload_obbligatorio)
	{
		if(is_uploaded)
			return 'Documento caricato correttamente';
		else
			return 'Documento obbligatorio';
	}
	else
		return 'Documento facoltativo';
}

/**
 * @properties={type:4,typeid:36,uuid:"0CC86B8F-5523-4065-95E0-CCD9F491478D"}
 */
function has_comments()
{
	return comments ? 1 : 0;
}

/**
 * @properties={type:4,typeid:36,uuid:"5099C857-2195-404B-92C1-7194ECE6DA8F"}
 */
function richiesto()
{
	return 0;
}

/**
 * @properties={type:4,typeid:36,uuid:"E920F197-47B6-4AB7-9DBA-A4E64E367C68"}
 */
function is_uploaded()
{
	return (bytes && name) ? 1 : 0;
}

/**
 * @properties={typeid:36,uuid:"0BAF43B5-9584-4000-9ED8-CCC705EB439F"}
 */
function comments_notempty()
{
	return comments || i18n.getI18NMessage('ma.msg.no_comments');
}
