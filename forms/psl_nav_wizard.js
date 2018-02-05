/**
 * @properties={typeid:35,uuid:"DFA32B01-4B82-4CA4-9A22-40749E204F8A",variableType:-4}
 */
var btnSendId;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E1101969-0BB8-4F25-AFCD-5EE742F6FBA0",variableType:4}
 */
var v_total_steps = 0;

/**
 * An object to handle the state of the wizard.
 * 
 * @constructor
 * 
 * @this {State}
 * 
 * @properties={typeid:35,uuid:"FD770729-862C-4E73-8638-9F1804E163DC",variableType:-4}
 */
var State = function(numberOfSteps) 
{
	this.params		  = { };
	this.data		  = { };
	this.elaborazione = { id: null };
	this.error		  = '';
	
	/**
	 * State related variables
	 */
	this.max_step	   = numberOfSteps;
	this.previous_step = 0;
	this.current_step  = 1;
	this.next_step	   = 2;
	/** @type {Array<{ name: String, enabled: Number }>} */
	this.steps		   = new Array(numberOfSteps);
	
	// STATE HANDLING FUNCTIONS //	
	/**
	 * Reset the state of the wizard, i.e. so that it starts from the beginning
	 */
	this.reset = function() { 
		this.previous_step = 0; 
		this.current_step = 1; 
		this.next_step = 2;
	};
	
	this.last = function() { 
		while(this.current_step < this.max_step) 
			this.next(); 
	};
	
	this.next = function() {
		var nextStep = -1;
		if(this.current_step < this.max_step)
		{
			// find the next enabled step
			/** @type {Array} */
			var enabledSteps = this.steps.map(function(s){ return s.enabled; });
			
			nextStep = enabledSteps.indexOf(1, this.current_step + 1);
			if(nextStep > -1)
			{
				this.previous_step = this.current_step;
				this.current_step  = nextStep;
				this.next_step 	 = enabledSteps.indexOf(1, this.current_step + 1);
				
				return true;
			}
		}
		
		return false;
	};
						  
	this.prev = function() {
		var prevStep = -1;
		if(this.current_step > 1)
		{
			// find the previous enabled step
			/** @type {Array} */
			var enabledSteps = this.steps.map(function(s){ return s.enabled; });
			
			prevStep = enabledSteps.slice(0, this.current_step).lastIndexOf(1);
			if (prevStep > -1)
			{
				this.next_step 	 = this.current_step;
				this.current_step  = prevStep;
				this.previous_step = enabledSteps.slice(0, this.current_step).lastIndexOf(1);
				
				return true;
			}
		}
		
		return false;
	};
	
	this.get_next_step = function() {
		var nextStep = -1;
		if(this.current_step < this.max_step)
		{
			// find the next enabled step
			/** @type {Array} */
			var enabledSteps = this.steps.map(function(s){ return s.enabled; });
			nextStep = enabledSteps.indexOf(1, this.current_step + 1);
		}
		
		return nextStep;
	};
	
	this.get_prev_step = function() {
		var prevStep = -1;
		if(this.current_step > 1)
		{
			// find the previous enabled step
			/** @type {Array} */
			var enabledSteps = this.steps.map(function(s){ return s.enabled; });
			prevStep = enabledSteps.slice(0, this.current_step).lastIndexOf(1);
		}
		
		return prevStep;
	};
						  
	this.hasNextStep = function() {
		return this.get_next_step() != -1;
	};
						  
	this.hasPrevStep = function() {
		return this.get_prev_step() != -1;
	};
						  
	this.setStepsEnabled = function(steps) {
		for(var s = 0; s < steps.length; s++)
		{
			var step = this.getStep(steps[s].name);
			if (step)
				step.enabled = steps[s].enabled;
		}
	};
	
	this.disableAllSteps = function() { 
		this.steps.forEach(function(_) { _.enabled = 0; }); 
	};
	
	this.enableAllSteps = function() {
		this.steps.forEach(function(_) { _.enabled = 1; });
	};
	
	this.isStepEnabled = function(name) {
		return this.getStep(name).enabled === 1;
	};
	
	this.addStep = function(name, enabled, at) {
		/** @type {Array} */
		var arrSteps = this.steps;
		if(arrSteps.map(function(s){ return s.enabled; }).indexOf(name) === -1)
		{
			var index = (at && at > 0) ? at : this.steps['length']; 
			this.steps[index] = { name: name, enabled: enabled };
		}
	};
	
	this.getStep = function(name) {
		/** @type {Array} */
		var step = this.steps.filter(function(_){ return _.name == name; });
		if (step && step.length > 0)
			return step[0];
		else
			return null;
	};
	
	this.getStepIndex = function(name) {
		/** @type {Array} */
		return this.steps.filter(function(_){ return _.enabled == 1; }).map(function(_){ return _.name; }).indexOf(name);
	}
};

/**
 * @type {State}
 *
 * @properties={typeid:35,uuid:"E78EE9CB-41DA-4BDD-B73C-A60861DCC9FE",variableType:-4}
 */
var state = null;

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"56370887-D3A2-4FBD-985D-E93807D8499A"}
 * @AllowToRunInFind
 */
function onLoad(event) 
{
	btnSendId = plugins.WebClientUtils.getElementMarkupId(elements.btn_send);
	
	setNavButtonsCssClasses();
	
	try
	{
		// set tabs' data and restore their states
		controller.readOnly = false;
		
		v_total_steps = elements.step_tab.getMaxTabIndex();
		state = new State(v_total_steps);
	
		for(var tabNo = 1; tabNo <= v_total_steps; tabNo++)
		{
			/** @type {RuntimeForm<psl_nav_step>} */
			var step = getStepAt(tabNo);
			
			step.v_listeners.ondatachange.push(onDataChangeStep);
			step.v_listeners.ondatachange = getOnDataChangeListeners(step).concat(step.v_listeners.ondatachange);
			
			step.v_listeners.ondisable.push(disable);
			step.v_listeners.onenable.push(enable);
			
			step.v_listeners.onprocessing$start.push(onStepProcessing$Start);
			step.v_listeners.onprocessing$end.push(onStepProcessing$End);
			
			step.setupUI();
			
			state.addStep(step.getName(), 1, tabNo);
			elements.step_tab.setTabEnabledAt(tabNo, false);
		}
		
		updateProcessingState();
		v_loaded = true;
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		scopes.psl.ShowError('i18n:ma.err.generic_error');
	}
}

/**
 * @properties={typeid:24,uuid:"A66604E2-9AD2-423E-99AD-7F6B1A5430A5"}
 */
function onOpen()
{
	_super.onOpen();
	gotoFirstStep();
}

/**
 * @properties={typeid:24,uuid:"D56AAB41-3A3D-4AD9-A912-C277A5B0975C"}
 */
function onStepProcessing$Start()
{
	disable();
}

/**
 * @param success
 * @param message
 *
 * @properties={typeid:24,uuid:"E930805E-A4BC-4A8B-B8BF-D2FCEE38AAEF"}
 */
function onStepProcessing$End(success, message)
{
	saveState(); 
	enable(success, message);
	
	getCurrentStepForm().updateStatus(state);
}

/**
 * @properties={typeid:24,uuid:"546F60E8-C42D-49C2-BF77-F3BA9A4786A2"}
 */
function disable()
{
	_super.disable();
	disableNavButtons();
	
	getCurrentStepForm().disable();
}

/**
 * @param {Boolean} success
 * @param {String}  [message]
 * 
 * @properties={typeid:24,uuid:"4969F1FC-B44F-48F5-91D1-776587407FBF"}
 */
function enable(success, message)
{
	_super.enable(success, message);
	
	enableNavButtons();
	
	var status = getProcessingState(state);
	if (status > getLastEditableState())
		getCurrentStepForm().disable();
	else
		getCurrentStepForm().enable();
}

/**
 * @properties={typeid:24,uuid:"807A8F8E-030C-41AC-9F2A-76401CBA0E84"}
 */
function disableNavigation()
{
	elements.btn_prev
}

/**
 * @properties={typeid:24,uuid:"CB2174F9-B631-46CA-AA1E-917C1C84A9ED"}
 */
function getParams()
{
	return null;
}

/**
 * @properties={typeid:24,uuid:"B8294471-8D96-4AF4-9772-8D78022DFAF9"}
 */
function getOnDataChangeListeners(step)
{
	return [];
}

/**
 * @properties={typeid:24,uuid:"772110AB-8B89-4D56-A831-1078F3451274"}
 */
function getState()
{
	return state;
}

/**
 * @param [params]
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"F669D5CE-06D1-474D-ABDE-669B1A274D34"}
 */
function restoreProcessingState(params)
{
	restoreStateFromSnapshot();	
}

/**
 * @param {Array<String>} [stepsToSkip]
 * 
 * @properties={typeid:24,uuid:"EEEEBBB3-2AD0-4ABC-B464-B05B6F50F54D"}
 */
function restoreStateFromSnapshot(stepsToSkip)
{
	// restore snapshots for all steps
	for(var tab = 1; tab <= elements.step_tab.getMaxTabIndex(); tab++)
	{
		var step = getStepAt(tab);
		
		if(stepsToSkip && stepsToSkip.indexOf(step.getName()) > -1)
			continue;
		
		var snapshot = step.getSnapshot(state);
		if (snapshot)
			step.restoreStateFromSnapshot(snapshot, state);
		
		step.updateStatus(state);
	}	
}

/**
 * @param [params]
 * 
 * @properties={typeid:24,uuid:"0FBFDCFC-4461-45E6-B61A-D3185773E020"}
 */
function resetProcessingState(params)
{
	initSteps();
}

/**
 * @param {{ record: JSRecord<db:/ma_framework/psl_hours_processingstate>, reset: Boolean }} [params]
 * 
 * @properties={typeid:24,uuid:"0B67BDF4-F798-40A1-AB89-C6EB1CDD4897"}
 */
function updateProcessingState(params)
{
	var oldState = globals.clone(state);
	try
	{
		var onStateChangeParams;
		
		if(params && params.record)
		{
			onStateChangeParams = { 
				month  : scopes.date.FromIntMonth(params.record.month), 
				company: { 
					id   : globals.ma_utl_ditta_toCliente(params.record.company_id), 
					index: null 
				}, 
				reset  : params.reset,
				record : params.record
			};
		}
		else
			onStateChangeParams = getCurrentStepForm().getStateChangeParams(state);
		
		if(onStateChangeParams.reset)
			resetProcessingState(onStateChangeParams);
		
		restoreProcessingState(onStateChangeParams);
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		state = oldState;
		
		throw new Error(globals.from_i18n('i18n:ma.psl.err.restore_failed', [ex.message]));
	}
}

/**
 * @properties={typeid:24,uuid:"0017C7C2-8E93-413E-865C-B011CDC498D5"}
 */
function getStepName(tab)
{
	return forms[elements.step_tab.getTabFormNameAt(tab)].getName();
}

/**
 * @properties={typeid:24,uuid:"8A6D8E2D-030B-471F-9625-AC6EA14DBB31"}
 */
function getPreviousStep()
{
	var prevStep;
	
	do   {  prevStep = getPreviousStepForm(); }
	while( !prevStep.isStepEnabled(state) && state.prev() > -1 );
		
	return state.previous_step;
}

/**
 * @properties={typeid:24,uuid:"76A824C6-FAE9-4A5F-B506-E71B23C30810"}
 */
function getNextStep()
{
	var nextStep;
	
	do   {  nextStep = getNextStepForm(); }
	while( !nextStep.isStepEnabled(state) && state.next() > -1 );
		
	return state.next_step;
}

/**
 * @properties={typeid:24,uuid:"44131F49-C8CC-4858-8CCB-EA62E9602984"}
 */
function gotoNextStep()
{
	var oldState = globals.clone(state);
	
	try
	{
		var currentStep = getCurrentStepForm();
		
		/**
		 * 0. Valida lo stato del passo corrente
		 */
		if(!currentStep.validateStep(state))
		{
			forms.psl_status_bar.setStatusWarning(state.error);
			return false;
		}
		
		disable();
		
		/**
		 * 1. Esegui le operazioni di avanzamento del passo corrente
		 */
		result = currentStep.afterStep(state);
		if(result.error)
		{
			forms.psl_status_bar.setStatusWarning(result.message);
			enable(false);
			
			return false;
		}
		
		/**
		 * 2. Salva lo stato corrente
		 */
		if(!saveState())
			throw new Error('i18n:ma.err.wiz_state_save');
		
		var result;		
		if(state.next())
		{
			try
			{
				result = gotoStep(state.current_step);
				if(result.error)
				{
					state.prev();
					
					forms.psl_status_bar.setStatusWarning(result.message);
					enable(false);
					
					return false;
				}
				
				// disable previous step
				elements.step_tab.setTabEnabledAt(state.previous_step, false);
				
				// update wizard's state
				updateNavButtons();
				forms.psl_status_bar.resetStatus();
				
				enable(true);
				
				return true;
			}
			catch(ex)
			{
				state.prev();
				elements.step_tab.setTabEnabledAt(state.next_step, false);
				
				throw ex;
			}
		}
		
		if(!saveState())
			throw new Error('i18n:ma.err.wiz_state_save');
		
		enable(false);
		
		return false;
	}
	catch(ex)
	{		globals.ma_utl_logError(ex);
		forms.psl_status_bar.setStatusError('i18n:ma.err.generic_error');
		
		state = oldState;
		saveProcessingState();
		
		enable(false);
		
		return false;
	}
}

/**
 * @param {Number|String} step index or name of the step
 *
 * @properties={typeid:24,uuid:"9ED4D052-4932-4481-86DF-D6CB079A5170"}
 */
function gotoStep(step)
{
	/** @type {Number} */
	var stepIndex = -1;
	
	if(step instanceof String)
		stepIndex = state.getStepIndex(step) + 1;	// this is 0-based
	else
		stepIndex = step;
		
	// go to next step
	elements.step_tab.setTabEnabledAt(stepIndex, true);	
	
	// Update next form's status
	var stepForm = getStepAt(stepIndex);
	
	var result = stepForm.beforeStep(state);
	if (result.error)
		elements.step_tab.setTabEnabledAt(stepIndex, false);
	else
		elements.step_tab.tabIndex = stepIndex;
	
	// update current step, whether we switched step successfully or not
	getCurrentStepForm().updateStatus(state);
	
	return result;
}

/**
 * @properties={typeid:24,uuid:"206231B0-1DBD-49F7-AFD7-6549E8061B78"}
 */
function gotoPreviousStep()
{
	var oldState = globals.clone(state);
	
	disable();

	try
	{
		var currentStep = getCurrentStepForm();
		/**
		 * 1. Esegui le operazioni di avanzamento del passo corrente
		 */
		var result = currentStep.afterStep(state);
		if (result.error)
		{
			forms.psl_status_bar.setStatusWarning(result.message);
			enable(false);
			
			return false;
		}
		
		/**
		 * 1. Salva lo stato corrente
		 */
		if(!saveState())
			throw new Error('i18n:ma.err.wiz_state_save');

		if(state.prev())
		{
			try
			{
				result = gotoStep(state.current_step);
				if(result.error)
				{
					state.next();
					
					forms.psl_status_bar.setStatusWarning(result.message);
					enable(false);
					
					return false;
				}
				
				// disable the former step
				elements.step_tab.setTabEnabledAt(state.next_step, false);
				
				// update wizard's state
				updateNavButtons();				
				forms.psl_status_bar.resetStatus();
				
				enable(true);
							
				return true;
			}
			catch(ex)
			{
				state.next();
				elements.step_tab.setTabEnabledAt(state.previous_step, false);
				
				throw ex;
			}
		}
		
		if(!saveState())
			throw new Error('i18n:ma.err.wiz_state_save');
		
		enable(false);
		
		return false;
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		forms.psl_status_bar.setStatusError('i18n:ma.err.generic_error');
		
		state = oldState;
		saveProcessingState();
		
		enable(false);
		
		return false;
	}
	finally
	{
		getCurrentStepForm().updateStatus(state);
	}
}

/**
 * @properties={typeid:24,uuid:"4D823D75-5334-4B95-9C2E-CEF0BBB1F97E"}
 */
function endWizardAndSendData()
{
	var jobs = endWizard();
	if (jobs && jobs.length > 0)
		sendData(jobs[0].params);
}

/**
 * @return {Array<JSRecord<db:/ma_framework/psl_hours_jobqueue>>}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"0F85AD19-7ABF-41EB-B3A3-A13BC9AD09AA"}
 */
function endWizard()
{
	var oldState = globals.clone(state);
	
	disable();
	
	try
	{
		var success = true;
		
		var currentStep = getCurrentStepForm();
		if(!currentStep.validateStep(state))
		{
			forms.psl_status_bar.setStatusError(state.error);
			success = false;
		}
		
		if(success && !currentStep.afterStep(state))
		{
			forms.psl_status_bar.setStatusError(state.error);
			success = false;
		}
		
		// save the current step to the db
		if(success && !saveState())
		{
			forms.psl_status_bar.setStatusError('i18n:ma.msg.wiz_state_error');
			success = false;
		}
	
		var jobs;
		if(success)
		{
			forms.psl_status_bar.resetStatus();
			// mark data as final
			/** @type {{ error: Boolean, message: String, jobs: Array }} */
			var result = scopes.psl.RunJob({ method: finalizeData, args: [], start_message: 'Elaborazione in corso, attendere prego...', sync: true });
			
			success = !result.error;
			if(!success)
				forms.psl_status_bar.setStatusError(result.message);
			
			jobs = result.jobs;
		}
		
		// save the processing state
		if(!saveState())
		{
			forms.psl_status_bar.setStatusError('i18n:ma.msg.wiz_state_error');
			success = false;
		}
		
		enable(success);
		
		if(success && !gotoFirstStep())
		{
			forms.psl_status_bar.setStatusError('i18n:ma.err.generic_error');
			success = false;
		}
		
		if(success)
		{
			if(result.message)
				forms.psl_status_bar.setStatusSuccess(result.message);
			else
				forms.psl_status_bar.resetStatus();
		}
		
		getCurrentStepForm().updateStatus(state);
		
		if(success)
			return jobs;
		
		return [];
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		forms.psl_status_bar.setStatusError('i18n:ma.err.generic_error');
		
		state = oldState;
		saveProcessingState();
		
		enable(false);
		
		return [];
	}
}

/**
 * @properties={typeid:24,uuid:"45A08A3C-F246-48A4-A506-A52459BF19CF"}
 */
function gotoFirstStep()
{
	elements.step_tab.setTabEnabledAt(state.current_step, false);
	state.reset();
	
	var result = gotoStep(1);
	updateNavButtons();
	
	getCurrentStepForm().updateStatus(state);
	
	return result;
}

/**
 * @properties={typeid:24,uuid:"FA904476-599B-45EA-9160-56BDCCC39C44"}
 */
function gotoLastStep()
{
	var last_step = state.max_step;
	
	elements.step_tab.setTabEnabledAt(state.current_step, false);
	state.last();
	
	var result = gotoStep(last_step);
	updateNavButtons();
	
	getCurrentStepForm().updateStatus(state);
	
	return result;
}

/**
 * @properties={typeid:24,uuid:"1AC7FEB9-939C-46E5-8C57-6C6938B04A16"}
 */
function initSteps()
{
	forms.psl_status_bar.resetStatus();
	
	for(var tab = 1; tab <= elements.step_tab.getMaxTabIndex(); tab++)
		getStepAt(tab).initState(state);
}

/**
 * @properties={typeid:24,uuid:"4E722CBE-3854-4745-8F05-B57F0F2C3FB3"}
 */
function finalizeData()
{
	return { error: false, message: '', jobs: [] };
}

/**
 * @param {JSRecord} [record]
 * 
 * @properties={typeid:24,uuid:"9E0F8219-4391-465D-A615-E6A323CE3ECD"}
 * @AllowToRunInFind
 */
function saveProcessingState(record)
{
	return true;
}

/**
 * @properties={typeid:24,uuid:"6666C43A-E1D9-4B91-B882-6007E83C21B4"}
 */
function getElaborationRecord()
{
	return null;
}

/**
 * @return {RuntimeForm<psl_nav_step>}
 * 
 * @properties={typeid:24,uuid:"63D4E876-AEB4-4080-87CA-33DC15A6C4B3"}
 */
function getNextStepForm()
{
	/** @type {RuntimeForm<psl_nav_step>}*/
	var form = forms[elements.step_tab.getTabFormNameAt(state.next_step)];
	return form;
}

/**
 * @return {RuntimeForm<psl_nav_step>}
 * 
 * @properties={typeid:24,uuid:"8C84218A-F060-4780-95B0-9E03EAD44073"}
 */
function getPreviousStepForm()
{
	/** @type {RuntimeForm<psl_nav_step>}*/
	var form = forms[elements.step_tab.getTabFormNameAt(state.previous_step)];
	return form;
}

/**
 * @return {RuntimeForm<psl_nav_step>}
 * 
 * @properties={typeid:24,uuid:"7A257E27-C7EF-4CE1-9DA1-BA779CD314D5"}
 */
function getCurrentStepForm()
{
	/** @type {RuntimeForm<psl_nav_step>}*/
	var form = forms[elements.step_tab.getTabFormNameAt(state.current_step)];
	return form;
}

/**
 * @param index
 *
 * @properties={typeid:24,uuid:"A2EB8908-9140-4EBF-A992-94736637A674"}
 */
function getStepAt(index)
{
	/** @type {RuntimeForm<psl_nav_step>}*/
	var form = forms[elements.step_tab.getTabFormNameAt(index)];
	return form;
}

/**
 * @param oldValue
 * @param newValue
 * @param event
 *
 * @properties={typeid:24,uuid:"78102692-7926-45DA-8D23-32065848E941"}
 */
function onDataChangeStep(oldValue, newValue, event)
{
	updateWizardStatus();
}

/**
 * @properties={typeid:24,uuid:"6FC0405F-5ADA-471B-9459-507144907643"}
 */
function updateWizardStatus()
{
	getCurrentStepForm().updateStatus(state);
	updateNavButtons();
}

/**
 * @properties={typeid:24,uuid:"7CA27DFA-8ACF-4D99-A590-FB2187707099"}
 */
function updateNavButtons()
{
	/**
	 * PREV, NEXT and END buttons
	 */
	if(state.hasNextStep())
	{
		elements.btn_next.enabled = true;
		elements.btn_end.enabled  = false;
	}
	else
	{
		elements.btn_next.enabled = false;
		elements.btn_end.enabled  = true;
	}
	
	if(state.hasPrevStep())
		elements.btn_prev.enabled = true;
	else
		elements.btn_prev.enabled = false;
	
	elements.btn_end.enabled = elements.btn_end.enabled && getProcessingState(state) <= getLastEditableState();
	
	/**
	 * SEND button
	 */
	elements.btn_send.enabled = isSendingEnabled();

	/**
	 * Aggiorna gli stili
	 */
	setNavButtonsCssClasses();
}

/**
 * @properties={typeid:24,uuid:"914F6CE3-B934-4868-A877-A9A26B4EA06C"}
 */
function disableNavButtons()
{
	elements.btn_prev.enabled = 
	elements.btn_next.enabled = 
	elements.btn_end.enabled  = 
	elements.btn_send.enabled = false;
	
	setNavButtonsCssClasses();
}

/**
 * @properties={typeid:24,uuid:"6F7C67EC-F483-4A33-ACAE-F5C239066D5A"}
 */
function enableNavButtons()
{
	updateNavButtons();
}

/**
 * @properties={typeid:24,uuid:"DB535191-54E8-4964-83D9-4E34F96E753E"}
 */
function setNavButtonsCssClasses()
{
	[elements.btn_prev, elements.btn_next].forEach(function(_) {
		var classes = ['material-button', 'material-button-flat'];
		if(!_.enabled)
			classes.push('material-button-disabled');
		
		plugins.WebClientUtils.setExtraCssClass(_, classes.join(' '));
	});
	
	[elements.btn_end, elements.btn_send].forEach(function(_) {
		var classes = ['material-button', 'material-button-flat', 'material-button-primary'];
		if(!_.enabled)
			classes.push('material-button-disabled');
		
		plugins.WebClientUtils.setExtraCssClass(_, classes.join(' '));
	});
	
	if(!elements.btn_send.enabled)
		plugins.WebClientUtils.executeClientSideJS(scopes.string.Format('$("#@0").attr("title", "Nessuna elaborazione \'Da inviare\' presente");', btnSendId));
}

/**
 * @properties={typeid:24,uuid:"261C4EEC-4D92-48DA-A99A-E020BED75861"}
 */
function getProcessingState(_state)
{
	return null;
}

/**
 * @properties={typeid:24,uuid:"9364F5CB-8383-42F1-9551-E90B311B0A92"}
 */
function getLastEditableState()
{
	return null;
}

/**
 * @properties={typeid:24,uuid:"F7026C97-D170-4D90-883E-D7587B21B2B7"}
 */
function isSendingEnabled()
{
	return true;
}

/**
 * @param {RuntimeForm<psl_nav_step>} step
 *
 * @properties={typeid:24,uuid:"7A1401CE-D58F-467B-A3BC-FCFDAD4C9889"}
 * @AllowToRunInFind
 */
function saveStep(step)
{
	var snapshot = step.saveState(state);
	if (snapshot)
		saveSnapshot(step, snapshot);
	
	step.saveParams(state);
	step.saveData(state);
	
	return true;
}

/**
 * @param step
 * @param _snapshot
 *
 * @properties={typeid:24,uuid:"A3A86980-592F-40AB-B7E4-76AFDC3A8D15"}
 */
function saveSnapshot(step, _snapshot)
{
	// do nothing
}

/**
 * @param params
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"982F30E0-DFB7-42CA-8100-5AEA52CDD30A"}
 */
function saveJobs(params)
{
	return true;
}

/**
 * @param params
 * 
 * @properties={typeid:24,uuid:"20D284CA-D335-4333-B8C4-4271B17F84C3"}
 */
function sendData(params)
{
	return true;
}

/**
 * @param params
 *
 * @properties={typeid:24,uuid:"40CAE060-29C1-46F7-8136-544E586929B4"}
 */
function processData(params)
{
	return true;
}

/**
 * @properties={typeid:24,uuid:"B1C2DA69-DE36-4002-A254-C40B143CB414"}
 */
function saveState()
{
	if(_super.saveState())
		return saveStep(getCurrentStepForm()) && saveProcessingState();
	
	return false;
}

/**
 * @properties={typeid:24,uuid:"E0FD659B-ED66-4933-A0D9-8B4CA8F02FC6"}
 */
function getStatusForm()
{
	return forms.psl_status_bar;
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"9B87D011-D514-485B-85E7-B6ADDDFD4EF1"}
 */
function onAction$btn_first(event) 
{
	gotoFirstStep();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"9EE7F663-1A4F-4381-B17C-E0FC37227D0F"}
 */
function onAction$btn_last(event) 
{
	gotoLastStep();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"13328E15-061B-414F-8813-3D23CC6D0885"}
 */
function onAction$btn_end(event)
{
	endWizard();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"3DD5E1F5-E0F8-4647-8080-F8A2ED5629C5"}
 */
function onAction$btn_send(event)
{
	
}

/**
 * @properties={typeid:24,uuid:"ACC43571-B38F-41E0-BA73-CD7596843C6E"}
 */
function sendDataAction(params)
{
	return sendData(params);
}

/**
 * @properties={typeid:24,uuid:"156A29E2-E1FA-40D3-BFEE-67502168071C"}
 */
function processDataAction(ditta, periodo)
{
	var params = scopes.psl.Presenze.GetJobParams(state, ditta, periodo);
	
	disable();
	var success = processData(params);
	enable(success);
	
	return success;
}