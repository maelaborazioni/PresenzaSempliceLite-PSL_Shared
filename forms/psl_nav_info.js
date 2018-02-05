/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D1C9E74F-C02C-4644-B961-0996C4339028"}
 */
var DEFAULT_INFO = 'Qui troverai informazioni relative al passo corrente. Puoi accedere al menu principale in qualsiasi\
					momento cliccando sull\'icona <span><img src="mediafolder?id=menu_icon.png&s=PresenzaSempliceLite&option=14&w=20&h=20" /></span> \
					in altro a destra';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"438AF8A4-1248-4488-97E0-03CD21E0DCBA"}
 */
var template = "@0"

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"7B6D0E26-F233-4867-AF6F-02483D17046A"}
 */
var info = scopes.string.Format(template, DEFAULT_INFO);

/**
 * @param {String} msg
 *
 * @properties={typeid:24,uuid:"A6614160-FD7F-4880-B0A0-1DFD1C696E49"}
 */
function setInfo(msg)
{
	info = scopes.string.Format(template, msg);
}

/**
 * @properties={typeid:24,uuid:"2F2C8BDB-2196-4108-B756-A5CD008980EC"}
 */
function resetInfo()
{
	info = DEFAULT_INFO;
	return info;
}
/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8CDEE2AA-5D2E-4C8B-B129-76F19BDE3764"}
 */
function onLoad(event) 
{
	plugins.WebClientUtils.setExtraCssClass(elements.fld_info, 'material-info');
}

/**
 * @param {Number} [width]
 * @param {Number} [height]
 *
 * @properties={typeid:24,uuid:"066EB1E6-9E4C-4C09-A8EB-5FF2719FB9D6"}
 */
function resize(width, height)
{
	var jsForm = solutionModel.getForm(controller.getName());
		
	if(!width)
		width = jsForm.width - 20;
	
	if(!height)
		height = 0;
	
	jsForm.width = width;
	jsForm.getBodyPart().height = height;
	
	controller.recreateUI();
	plugins.WebClientUtils.setExtraCssClass(elements.fld_info, 'material-info');
}
