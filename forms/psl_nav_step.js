/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"53FD1090-AF48-4DA0-B364-98AC71470AB4"}
 */
var html = '';

/**
 * @properties={typeid:35,uuid:"4C360C93-D523-4314-8C1C-1F725CD458A9",variableType:-4}
 */
var isInfoVisible = false;

/**
 * @properties={typeid:35,uuid:"D109927A-DFBF-41C7-984C-372769A6031C",variableType:-4}
 */
var disabled = false;

/**
 * @properties={typeid:35,uuid:"CE277956-8492-4B84-AE32-5A0E86B01AD6",variableType:-4}
 */
var v_listeners = { 
	/** @type {Array<Function>} */ondatachange      : [], 
	/** @type {Array<Function>} */onerror           : [], 
	/** @type {Array<Function>} */ondisable         : [], 
	/** @type {Array<Function>} */onenable          : [],
	/** @type {Array<Function>} */onuichange  	    : [],
	/** @type {Array<Function>} */onprocessing$start: [],
	/** @type {Array<Function>} */onprocessing$end  : [],
	/** @type {Array<Function>} */onprocessing$step : [],
	/** @type {Array<Function>} */onrecordselection : []
};

/**
 * @properties={typeid:24,uuid:"A3C5F5D8-B7E6-4E72-B1B2-792BC9698ED5"}
 */
function isStepEnabled(state)
{
	return state.isStepEnabled(getName());
}

/**
 * @properties={typeid:24,uuid:"EC6BDCA1-328B-4445-A285-CA8B98188EB9"}
 */
function enableStep(state)
{
	state.setStepsEnabled([{ name: getName(), enabled: 1 }]);
}

/**
 * @properties={typeid:24,uuid:"35006A50-AF53-44E0-B6A1-E1A95B9FC941"}
 */
function disableStep(state)
{
	state.setStepsEnabled([{ name: getName(), enabled: 0 }]);
}

/**
 * @properties={typeid:24,uuid:"F0C03869-A57B-4D5F-BFA4-4F8AFC632A00"}
 * 
 * @return {RuntimeForm<psl_nav_wizard>}
 */
function getMainForm()
{
	return null;
}

/**
 * @properties={typeid:24,uuid:"7FBB3647-F18B-4F6B-B642-951F1911EAD9"}
 */
function getState()
{
	return getMainForm().getState();
}

/**
 * Validate the current step.
 * 
 * @param state
 * 
 * @return {Boolean} true if the step requirements are fulfilled, false otherwise
 * 
 * @properties={typeid:24,uuid:"B7728FD3-2FC8-4B4B-B0BA-D8C501043F58"}
 */
function validateStep(state)
{
	return true;
}

/**
 * @properties={typeid:24,uuid:"53A2BBAF-B63A-4785-92F0-D22BFD0A5666"}
 */
function enable()
{
	disabled = false;
}

/**
 * @properties={typeid:24,uuid:"68E22A76-1002-4146-8E36-9512E7DE5C21"}
 */
function disable()
{
	disabled = true;
}

/**
 * @properties={typeid:24,uuid:"DAFA7193-FBB4-4FE3-8AF4-5217993BB9F6"}
 */
function isDisabled()
{
	return disabled;
}

/**
 * Executed on entering the step. Perform here computation that needs to be done before
 * displaying the step.
 * 
 * @param state
 * 
 * @return {{ error: Boolean, message: String }}
 *
 * @properties={typeid:24,uuid:"275E74B2-45E7-48C9-AB4E-AF2CF63EA8D4"}
 */
function beforeStep(state)
{
	// Disabilita il passo se è disabilitato, o se mi trovo in uno stato non più modificabile
	if(!isStepEnabled(state) || isProcessingStateFinal(state))
		disable();
	else
		enable();
	
	if(isDirty(state))
		refreshData(state);
	
	return { error: false, message: '' };
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"D84E0F7C-EDBD-4DAB-8E4B-BD429F9A36D0"}
 */
function isDirty(state)
{
	return false;
}

/**
 * @properties={typeid:24,uuid:"5902E8FA-62E0-4BF2-9CBD-9DE24A861EF9"}
 */
function refreshData(state)
{
	// do nothing
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"7C79D24E-C86F-4265-8D7F-44480EBB2626"}
 */
function isProcessingStateFinal(state)
{
	return false;
}

/**
 * Executed on exiting the step. Perform here computation that needs to be done before
 * displaying the next step.
 * 
 * @param state
 * 
 * @return {{ error: Boolean, message: String }}
 *
 * @properties={typeid:24,uuid:"0DE638D9-0B43-4D11-A6FB-989513D02FB3"}
 */
function afterStep(state)
{
	return { error: false, message: '' };
}

/**
 * @properties={typeid:24,uuid:"BFE408D3-7922-44BC-81EB-9E26602BA4DA"}
 */
function getData()
{
	return null;
}

/**
 * @param state
 * 
 * @return {Boolean} true if changes to the UI has been performed, false otherwise
 *
 * @properties={typeid:24,uuid:"2483C958-4C50-4D62-B9B3-FD8C4F4B8C74"}
 */
function updateStatus(state)
{
	return false;
}

/**
 * @param {String}   event
 * @param {Function} callback
 *
 * @properties={typeid:24,uuid:"02248C14-2CBC-40FD-9D74-4E262DCA7556"}
 */
function addListener(event, callback)
{
	if(undefined === v_listeners[event])
		throw new Error('Event [' + event + '] not recognized');
	
	v_listeners[event].push(callback);
}

/**
 * @param [oldValue]
 * @param [newValue]
 * @param {JSEvent} [event]
 *
 * @properties={typeid:24,uuid:"6A4DABBF-E0B9-4C0E-909B-191A78BD31BD"}
 */
function onDataChange(oldValue, newValue, event)
{
	var success = true;
	
	var field = event && event.getElementName();
	if (field)
	{
		/** @type {Function} */
		var onDataChangeField = forms[controller.getName()]['onDataChange$' + field];
		if (onDataChangeField)
			success = onDataChangeField(oldValue, newValue, event);
		else
		{
			/** @type {Function} */
			var onDataChangeChild = forms[controller.getName()]['onDataChange$'];
			if (onDataChangeChild)
				success = onDataChangeChild(oldValue, newValue, event);
		}
	}
		
	if(success)
		notify(scopes.events.Listeners.ON_DATACHANGE);
	
	return success;
}

/**
 * @param {String}  event   the event type
 * @param {...}		[args]  the arguments to pass to the listener
 * @see   scopes.events.Listeners
 *
 * @properties={typeid:24,uuid:"AFF92C6F-835F-45D2-80F2-EE9A310B36DB"}
 */
function notify(event)
{
	for(var l = 0; l < v_listeners[event].length; l++)
		v_listeners[event][l].apply(null, Array.prototype.slice.call(arguments, 1));
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"231699DC-5D9D-4E59-B5F9-2AA6BEB58527"}
 */
function getStateChangeParams(state)
{
	return { reset: true };
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"A4F92AB3-4644-4C33-AE5D-7282D19DB46F"}
 */
function saveData(state)
{
	// do nothing
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"02F0155B-7475-4F6A-8F97-CAD638413D7F"}
 */
function saveParams(state)
{
	// do nothing
}

/**
 * @properties={typeid:24,uuid:"D17507DC-058C-4333-9B09-5F965D59113E"}
 */
function reset()
{
	// do nothing
}

/**
 * @properties={typeid:24,uuid:"42CAA74C-54CB-4D9B-B8B1-1976457AE397"}
 */
function getName()
{
	return 'step';
}

/**
 * @properties={typeid:24,uuid:"A3ABCD2C-CA12-4ABD-B3CC-B0F0FDA83D23"}
 */
function saveState(state)
{
	return null;
}

/**
 * @param snapshot
 * @param state
 *
 * @properties={typeid:24,uuid:"1716B427-EE00-4881-A477-0EDAB6556913"}
 */
function restoreStateFromSnapshot(snapshot, state)
{
	// do nothing
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"F0738FA3-F035-4F68-949B-1CCACE289829"}
 */
function restoreStateFromDatabase(state)
{
	// do nothing
}

/**
 * @properties={typeid:24,uuid:"4E0A6701-47CE-48A8-AC9F-2A588F8DB0FA"}
 */
function initState(state)
{
	// do nothing
}

/**
 * @properties={typeid:24,uuid:"86609939-C3B8-4E03-AB10-8C389A213053"}
 */
function getSnapshot(state)
{
	return null;
}

/**
 * @param {Boolean} [refresh] true to call controller.recreateUI(), false otherwise
 * 
 * @return {Boolean} true if the UI has to be recreated, false otherwise
 * 
 * @properties={typeid:24,uuid:"9D73DD1B-0561-4AD3-8C4E-05B336AC969E"}
 */
function setupUI(refresh)
{
	if(refresh)
	{
		controller.recreateUI();
		plugins.WebClientUtils.setExtraCssClass(elements.btn_info, 'material-button material-button-float');
		
		// notify all registered listeners
		v_listeners.onuichange.forEach(function(_){ _(solutionModel.getForm(controller.getName())); });
	}
	
	// post-setup hook
	afterSetupUI();

	return true;
}

/**
 * @properties={typeid:24,uuid:"07B9E63E-7DFE-48C9-A03D-DFCBC8B2CE2C"}
 */
function afterSetupUI()
{
	// do nothing;
}

/**
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"4ED33566-D1B7-449F-B71C-EB2F1AE29A81"}
 */
function onAction$btn_info(event)
{
	toggleInfo();
}

/**
 * @properties={typeid:24,uuid:"4B4BA966-BF37-446F-8BB5-D658A0200A31"}
 */
function toggleInfo() 
{
	isInfoVisible = !isInfoVisible;
	refreshInfo();
}

/**
 * @properties={typeid:24,uuid:"B140F740-6BFF-4A31-B3B1-999AA5A02DD2"}
 */
function refreshInfo()
{
	elements.info_tab.visible = isInfoVisible;
}

/**
 * @properties={typeid:24,uuid:"057977EB-B006-437C-A25D-0B3440C62D51"}
 */
function hideInfo()
{
	isInfoVisible = false;
	refreshInfo();
}

/**
 * @return {RuntimeForm<psl_nav_info>}
 * 
 * @properties={typeid:24,uuid:"AF021E7E-7827-42DB-987A-517939B1F426"}
 */
function getInfoTab()
{
	/** @type {RuntimeForm<psl_nav_info>} */
	var form = forms[elements.info_tab.getTabFormNameAt(1)];
	return form;
}

/**
 * @properties={typeid:24,uuid:"3D75DE75-3BB7-4E4B-AFF5-DCEA78AC5BC8"}
 */
function getStepInfo()
{
	return getInfoTab().resetInfo();
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"919743DF-BCD3-421B-BA6E-0A36692FF611"}
 */
function onLoad(event)
{
	plugins.WebClientUtils.setExtraCssClass(elements.btn_info, 'material-button material-button-float');
	setHtml();
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"52C8A80B-0F69-4BA9-9B68-E6B28146134C"}
 */
function onShow(firstShow, event) 
{
	hideInfo();
	getInfoTab().setInfo(getStepInfo());
}

/**
 * @properties={typeid:24,uuid:"0372962B-B4F6-4A57-87C5-4E5EACE1B33C"}
 */
function setHtml()
{
	html = '<script type="text/javascript">\
				var selected = false;\
				$(".material-button-float").click(function(e) {\
					selected = !selected;\
					if (selected)\
						$(this).addClass("material-button-selected");\
					else\
						$(this).removeClass("material-button-selected");\
				});\
				\
				$(document).ready(function() { @0 });\
		    </script>';

	return html;
}
