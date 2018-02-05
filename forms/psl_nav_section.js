/**
 * @param {Boolean}  success
 * @param {String}  [message] the message to display on the status bar. It is displayed as a success 
 * 							  if success = true, or as an error otherwise.
 * 
 * @properties={typeid:24,uuid:"1775DBFD-ABE6-479F-9F7F-5EFA766148BD"}
 */
function enable(success, message)
{
	elements.step_processing.visible = false;
	
	if(success)
	{
		if(message)
			forms.psl_status_bar.setStatusSuccess(message);
		else
			forms.psl_status_bar.resetStatus();
	}
	else
	if(message)
		forms.psl_status_bar.setStatusError(message);
	
	for(var l in v_listeners.onprocessing$end)
		v_listeners.onprocessing$end[l](success);
}

/**
 * @properties={typeid:24,uuid:"9E5C60D2-D1EF-40E1-8120-1A2FC51EC0E0"}
 */
function disable()
{
	elements.step_processing.visible = true;
	
	for(var l in v_listeners.onprocessing$start)
		v_listeners.onprocessing$start[l]();
}

/**
 * @properties={typeid:24,uuid:"042730F5-390D-4B6E-AC89-8FAC65282999"}
 */
function onOpen()
{
	// do nothing
}

/**
 * @properties={typeid:24,uuid:"4E38055F-C337-4476-9E2B-DC2B810D4790"}
 */
function update()
{
	// do nothing
}