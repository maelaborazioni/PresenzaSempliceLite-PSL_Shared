/**
 * @properties={typeid:35,uuid:"593AF5AB-82D5-47E0-8276-FC9CD9DFBEC0",variableType:-4}
 */
var v_loaded = false;

/**
 * @properties={typeid:35,uuid:"A138D0ED-3EF4-4462-BF40-5A69A26BBE02",variableType:-4}
 */
var v_listeners = { onprocessing$start: { }, onprocessing$end: { } };

/**
 * @param {String} event
 * @param {String} name
 * @param {Function} callback
 *
 * @properties={typeid:24,uuid:"C4BAB244-7D1B-4D8C-9D38-1DCE690C2158"}
 */
function registerListener(event, name, callback)
{
	v_listeners[event][name] = callback;
}

/**
 * @param {JSRecord<db:/ma_framework/psl_hours_processingstate>} record
 *
 * @properties={typeid:24,uuid:"4102C753-030A-4C12-9E5C-140FC2B82602"}
 */
function onFormStateDataChange(record)
{
	
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_processingstate>} record
 *
 * @properties={typeid:24,uuid:"F328D354-9919-4C1B-AACA-4D4522E820C3"}
 */
function onHoursStateDataChange(record)
{
	
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"CDFFB0D3-D924-486C-A70B-6F6A7015D4A5"}
 */
function onQuit(event)
{
	return saveState();
}

/**
 * @properties={typeid:24,uuid:"79363A1E-3382-4EA5-8698-C5F78F350537"}
 */
function saveState()
{
	return true;
}

/**
 * @properties={typeid:24,uuid:"FA50C45A-F8AC-444A-BB2C-83B6B4CA49AD"}
 */
function getName()
{
	return null;
}

/**
 * @param [params]
 * 
 * @properties={typeid:24,uuid:"9453BAF4-BD61-484E-9E2F-C2884054EC66"}
 */
function newElaboration(params)
{
	// do nothing
}