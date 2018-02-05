/**
 * @properties={typeid:24,uuid:"9AA18DA5-64B4-41AC-9346-DEC0986EAEB0"}
 */
function isAdmin()
{
	return globals.ma_utl_hasKey(globals.Key.ADMIN_PSL);
}

/**
 * @properties={typeid:35,uuid:"7CDCBA29-D2AA-4E74-87A3-0FE54A6065C4",variableType:-4}
 */
var Colors =
{
	NEUTRAL: '#FFFFFF',
	SELECTED: '#E2007A',
	UNSELECTED: '#172983'
}

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6C78ECC3-8C73-4B41-8EE5-5D4610638FEB"}
 */
var SupportEmail = 'assistenza@hexelia.it';

/**
 * @return {Object}
 * 
 * @properties={typeid:35,uuid:"9F93C675-B246-4705-BB13-380157D20156",variableType:-4}
 */
var Pratiche =
{
	GetProcessingInfo: function(state){
		return state.elaborazione;
	},
	
	/**
	 * @properties={typeid:24,uuid:"F86805AD-FA3D-4C79-924D-FFB202211D93"}
	 */
	GetProcessingState: function(state){ 
		return state.elaborazione && state.elaborazione.status; 
	},
	
	GetLastEditableState: function(){ 
		return this.StatoElaborazione.IN_ELABORAZIONE; 
	},
	
	FiltraElencoPratiche: function(codiceCategoria){ 
		var sqlQuery = "select descrizione, id_pratica from psl_pratiche where codice_categoria = ? and nascosta = 0;";
		var ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRATICHE, sqlQuery, [codiceCategoria], -1);
		
		application.setValueListItems('vls_pratiche', ds);
	},
		
	Infortunio: 
	{ 
		Nome: 'inf', 
		Sezioni: { OPZIONI: 'infortunio_opzioni', DOWNLOAD: 'infortunio_download', UPLOAD: 'infortunio_upload' } 
	},
	Inail: 
	{ 
		Nome: 'inail', 
		Sezioni: { OPZIONI: 'inail_opzioni', DOWNLOAD: 'inail_download', UPLOAD: 'inail_upload' }
	},
	Inps: 
	{ 
		Nome: 'inps', 
		Sezioni: { OPZIONI: 'inps_opzioni', DOWNLOAD: 'inps_download', UPLOAD: 'inps_upload' }
	},
	Variazioni: 
	{ 
		Nome: 'anag',
		Sezioni: { OPZIONI: 'variazioni_opzioni', DOWNLOAD: 'variazioni_download', UPLOAD: 'variazioni_upload' }
	},
	Collocamento: 
	{ 
		Nome: 'geco',
		Sezioni: { OPZIONI: 'collocamento_opzioni', DOWNLOAD: 'collocamento_download', UPLOAD: 'collocamento_upload' }
	},
	Varie: 
	{ 
		Nome: 'varie',
		Sezioni: { OPZIONI: 'varie_opzioni', DOWNLOAD: 'varie_download', UPLOAD: 'varie_upload' }
	},	
	Startup: 
	{ 
		Nome: 'startup',
		Sezioni: { OPZIONI: 'startup_opzioni', DOWNLOAD: 'startup_download', UPLOAD: 'startup_upload' }
	},	
	
	StatoElaborazione: 
	{ 
		ERRORE			: -1, 
		NUOVA		    :  0,
		IN_CARICAMENTO	:  1, 
		INVIATA			:  2, 
		IN_ELABORAZIONE	:  3,
		ELABORATA		:  4,
		
		FormatStatus: function(status){
			switch(status)
			{
				case this.IN_CARICAMENTO:
					return i18n.getI18NMessage('ma.psl.status.loading');
					
				case this.COMPILATA:
					return i18n.getI18NMessage('ma.psl.status.saved');
					
				case this.INVIATA:
					return i18n.getI18NMessage('ma.psl.status.sent');
				
				case this.IN_ELABORAZIONE:
					return i18n.getI18NMessage('ma.psl.status.processing');
					
				case this.ELABORATA:
					return i18n.getI18NMessage('ma.psl.status.processed');
				
				case this.ERRORE:
					return i18n.getI18NMessage('ma.psl.status.error');
				
				default:
					return i18n.getI18NMessage('ma.psl.status.uninitialized');
			}
		}
	},
	
//	EMail: { FROM: 'servizioweb@studiomiazzo.it', TO: 'daniele.maccari@studiomiazzo.it', CC: 'daniele.maccari@studiomiazzo.it'}
	// TODO gestire con tabella o file di configurazione
	EMail: { FROM: 'servizioweb@studiomiazzo.it', TO: 'boris.marongiu@studiomiazzo.it', CC: 'daniele.maccari@studiomiazzo.it', BCC: '' } 
}
	
/**
 * @properties={typeid:35,uuid:"330AA4FD-B421-47FD-A016-8FAC64E1ED93",variableType:-4}
 */
var VociMenu = 
	(function(){
		return {
			/** @type {String} */HOME				: i18n.getI18NMessage('ma.psl.menu.home'),
			/** @type {String} */ANAGRAFICHE		: i18n.getI18NMessage('ma.psl.menu.anagrafiche'),
			/** @type {String} */PRATICHE			: i18n.getI18NMessage('ma.psl.menu.pratiche'),
			/** @type {String} */PRESENZE			: i18n.getI18NMessage('ma.psl.menu.presenze'),
			/** @type {String} */MAGNACARTA			: i18n.getI18NMessage('ma.psl.menu.magnacarta'),
			/** @type {String} */DOMANDERISPOSTE	: i18n.getI18NMessage('ma.psl.menu.domanderisposte'),
			/** @type {String} */CALCOLOCOSTI		: i18n.getI18NMessage('ma.psl.menu.calcolocosti'),
			/** @type {String} */STORICO_OPERAZIONI	: i18n.getI18NMessage('ma.psl.menu.storico_operazioni')
		}
	})();
	
/**
 * @properties={typeid:35,uuid:"C2605027-B0CD-4B83-9662-EEDA3C656C42",variableType:-4}
 */
var Sezione = 
	(function(){
		var o = function(nome, icona, menu, modulo, chiave){
			this.nome = nome;
			this.icona = icona;
			this.menu = menu;
			this.modulo = modulo;
			this.chiave = chiave;
			this.sottoSezioni = [];
			this.disabled = false;
			this.toString = function(){ return this.nome; }
		};
		
		o.prototype.aggiungiSezione = function(sezione){
			this.sottoSezioni.push(sezione);
		}
		
		o.prototype.aggiungiSezioni = function(sezioni){
			this.sottoSezioni = this.sottoSezioni.concat(sezioni);
		}
		
		return o;
	})();	
/**
 * 
 * @properties={typeid:35,uuid:"F0700BFB-B29A-468B-A181-3B0D836EE72E",variableType:-4}
 */
var Sezioni =
	(function(){
		var values   = application.getValueListArray('vls_menu');
		/**
		 * Costruisci i menu composti di pratiche ed anagrafiche
		 */
		var pratiche = new Sezione(values[i18n.getI18NMessage('ma.psl.menu.pratiche')],	'icon-drawer', i18n.getI18NMessage('ma.psl.menu.pratiche'));
		
		pratiche.aggiungiSezioni(
			[
				new Sezione(Pratiche.Infortunio.Nome  , 'icon-file-text', i18n.getI18NMessage('ma.psl.menu.pratiche.infortunio')),
				new Sezione(Pratiche.Inail.Nome       , 'icon-file-text', i18n.getI18NMessage('ma.psl.menu.pratiche.inail')),
				new Sezione(Pratiche.Inps.Nome        , 'icon-file-text', i18n.getI18NMessage('ma.psl.menu.pratiche.inps')),
				new Sezione(Pratiche.Variazioni.Nome  , 'icon-file-text', i18n.getI18NMessage('ma.psl.menu.pratiche.variazioni_anagrafiche')),
				new Sezione(Pratiche.Varie.Nome       , 'icon-file-text', i18n.getI18NMessage('ma.psl.menu.pratiche.varie')),
				new Sezione(Pratiche.Collocamento.Nome, 'icon-file-text', i18n.getI18NMessage('ma.psl.menu.pratiche.collocamento')),
				new Sezione(Pratiche.Startup.Nome     , 'icon-file-text', i18n.getI18NMessage('ma.psl.menu.pratiche.startup')),
			]);
		
		var anagrafiche = new Sezione(values[i18n.getI18NMessage('ma.psl.menu.anagrafiche')], 'icon-address-book',	i18n.getI18NMessage('ma.psl.menu.anagrafiche'));
		
		anagrafiche.aggiungiSezioni(
			[
				new Sezione('ditta'     , 'icon-office' , i18n.getI18NMessage('ma.psl.menu.anagrafiche.ditta')),
				new Sezione('lavoratori', 'icon-user', i18n.getI18NMessage('ma.psl.menu.anagrafiche.lavoratori')),
//				new Sezione('esportaditta', 'icon-printer', 'Esporta dati ditta'),
				new Sezione('esportalavoratori', 'icon-printer', 'Esporta dati dipendenti')
			]);
			
		return {
			/** @type {scopes.psl.Sezione} */HOME				: 
				new Sezione(values[i18n.getI18NMessage('ma.psl.menu.home')], 'icon-home3', i18n.getI18NMessage('ma.psl.menu.home')),
			/** @type {scopes.psl.Sezione} */ANAGRAFICHE		: 
				anagrafiche,
			/** @type {scopes.psl.Sezione} */PRESENZE			: 
				new Sezione(values[i18n.getI18NMessage('ma.psl.menu.presenze')], 'icon-calendar', i18n.getI18NMessage('ma.psl.menu.presenze'), globals.Module.RILEVAZIONE_PRESENZE),
			/** @type {scopes.psl.Sezione} */PRATICHE			: 
				pratiche,
			/** @type {scopes.psl.Sezione} */MAGNACARTA		: 
				new Sezione(values[i18n.getI18NMessage('ma.psl.menu.magnacarta')], 'icon-leaf', i18n.getI18NMessage('ma.psl.menu.magnacarta')),
			/** @type {scopes.psl.Sezione} */DOMANDERISPOSTE	: 
				new Sezione(values[i18n.getI18NMessage('ma.psl.menu.domanderisposte')], 'icon-bubbles4', i18n.getI18NMessage('ma.psl.menu.domanderisposte')),
			/** @type {scopes.psl.Sezione} */CALCOLOCOSTI		: 
				new Sezione(values[i18n.getI18NMessage('ma.psl.menu.calcolocosti')], 'icon-calculator', i18n.getI18NMessage('ma.psl.menu.calcolocosti'), globals.Module.HR),
			/** @type {scopes.psl.Sezione} */STORICO_OPERAZIONI: 
				new Sezione(values[i18n.getI18NMessage('ma.psl.menu.storico_operazioni')], 'icon-task-history', i18n.getI18NMessage('ma.psl.menu.storico_operazioni'), globals.Module.UTILITY),
			/** @type {scopes.psl.Sezione} */ADMIN_PRATICHE: 
				new Sezione(values[i18n.getI18NMessage('ma.psl.menu.admin.pratiche')], 'icon-lock', i18n.getI18NMessage('ma.psl.menu.admin.pratiche'), globals.Module.UTILITY, globals.Key.ADMIN_PSL),
			
			asArray: function(){
				return [this.HOME, this.ANAGRAFICHE, this.PRESENZE, this.PRATICHE, this.MAGNACARTA, this.DOMANDERISPOSTE, this.CALCOLOCOSTI, this.STORICO_OPERAZIONI, this.ADMIN_PRATICHE]
			},
			/**
			 * @return {Array<scopes.psl.Sezione>}
			 */
			filterAvailableFor: function(modules){
				return this.asArray().filter(function(s){ 
					return !s.modulo || (modules.indexOf(s.modulo) > -1 && (!s.chiave || globals.ma_utl_hasKey(s.chiave)));	// se il modulo è previsto, controlla la chiave, se presente 
				});
			}
		}
	})();

/**
 * @properties={typeid:35,uuid:"C0C3851C-F124-43FD-B24A-B97EB132F059",variableType:-4}
 */
var Presenze =
{
	Report:
	{
		Riepilogo: 'PSL_Riepilogo_Presenze', Json: 'data_@0.json'
	},
	
	/**
	 * @properties={typeid:35,uuid:"6466C136-D10A-46E6-BFFB-C64D1DDF37B9",variableType:-4}
	 */
	Stampe: 
	{
		VARIAZIONI : 'variazioni',
		GIORNALIERA: 'giornaliera',
		CERTIFICATI: 'certificati'
	},
	
	/**
	 * @param 		   state
	 * @param {Number} ditta
	 * @param {Date}   periodo
	 * 
	 * @return {{ idditta: Number, periodo: Number, giorni: Array<Number>, lavoratori: Array<Number> }}
	 */
	GetJobParams: function(state, ditta, periodo)
	{
		var elaborazione = this.GetProcessingInfo(state, periodo, ditta);
		var params = 
		{ 
			idditta    : ditta, 
			periodo    : scopes.date.ToIntMonth(periodo), 
			giorni     : scopes.date.GetDates(periodo), 
			lavoratori : elaborazione['lavoratori'],
			steps	   : state.params.steps
		};
		
		return params;
	},
	
	/**
	 * Ricarica i dati delle ore da database. Si noti che l'oggetto hours passato come parametro
	 * è direttamente modificato. Eventuali lavoratori non presenti nell'oggetto fornito sono 
	 * automaticamente popolati con i dati recuperati dal database.
	 * 
	 * @param 					hours
	 * @param {Number} 			company
	 * @param {Date} 			month
	 * @param {Array<Number>} 	employees
	 *
	 * @return l'oggetto hours aggiornato
	 */
	RestoreDataFromDatabase: function(hours, company, month, employees)
	{
		var firstDay = scopes.date.FirstDayOfMonth(month);
		var lastDay  = scopes.date.LastDayOfMonth(month);

		for(var l = 0; l < employees.length; l++)
		{
			var lavoratore = employees[l];
			
			/**
			 * Recupera i dati dalla giornaliera, se presenti
			 */
			var sqlQuery = "select\
								dati.Giorno,\
								dati.IdEvento,\
								dati.Evento,\
								dati.CodiceProprieta,\
								dati.Ore,\
								dati.Tipo,\
								dati.GestitoConStorico as Generato,\
								dati.Ignora,\
								dati.OreLavorabili,\
								dati.OreLavorate,\
								dati.Squadrato\
							from\
								dbo.PSL_DatiGiornaliera(?, ?, ?) dati\
							order by\
								dati.Giorno;";
			
			var dataset = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, sqlQuery, [lavoratore, firstDay, lastDay], -1);
			if(!dataset || dataset.getMaxRowIndex() == 0)
				continue;
			
			var data = hours[lavoratore];
			if(!data)
				data = hours[lavoratore] = { };
			
			var lastRowDay = null, isNewDay = false;
			for(var row = 1; row <= dataset.getMaxRowIndex(); row++)
			{
				var day = utils.dateFormat(dataset.getValue(row, 1), globals.ISO_DATEFORMAT);
				
				var workableHours = dataset.getValue(row, 9) / 1e2;
				var workedHours   = dataset.getValue(row, 10) / 1e2;
				var squadrato 	  = dataset.getValue(row, 11) == 1;
				var message       = squadrato ? '<strong>Sono state rilevate delle incongruenze</strong><br/>Controllare gli eventi inseriti.' : '';

				if(!data[day])
					data[day] = 
					{ 
						workable_hours : workableHours, 
						worked_hours   : workedHours, 
						error		   : squadrato, 
						message		   : message,
						events		   : []
					};
				
				isNewDay = lastRowDay != day;				
				if(isNewDay)
					data[day].events = [];
				
				var eventId     = dataset.getValue(row, 2);
				var eventHours  = dataset.getValue(row, 5) / 1e2;
				var eventType   = dataset.getValue(row, 6);
				var wholeDay    = (eventType == globals.TipoEvento.SOSTITUTIVO && eventHours == workableHours) ? true : false;
				var ignoreEvent = dataset.getValue(row, 8) == 1;
				
				if (eventId && !ignoreEvent)
				{
					data[day].events.push(
					{ 
						id		  : dataset.getValue(row, 2), 
						code	  : dataset.getValue(row, 3), 
						property  : dataset.getValue(row, 4), 
						hours	  : eventHours, 
						type	  : eventType,
						persisted : true,
						is_dirty  : false,
						whole_day : wholeDay,
						generated : dataset.getValue(row, 7) == 1
					});
				};
				
				lastRowDay = day;
			}
		}
		
		return hours;
	},
	
	/**
	 * Reimposta tutti gli eventi, impostando il flag 'dirty'. Sono esclusi gli eventi generati (es. eventi lunghi).
	 * 
	 * @param hours
	 * 
	 * @throws {scopes.error.NullReferenceError} if the provided hours object is null or undefined
	 * 
	 * @return a new object without the ordinary events and the holidays
	 */
	ResetEvents: function(hours)
	{
		if(!hours)
			throw new scopes.error.NullReferenceError('hours');
		
		for(var employee in hours)
		{
			for(var day in hours[employee])
			{
				/** @type {Array} */
				var events = hours[employee][day].events;
				if (events)
					events.filter (function(_) { return _.generated == false })
						  .forEach(function(_) { _.is_dirty = true; });
				
				hours[employee][day].events = events;
			}
		}
		
		return hours;
	},
	
	/**
	 * @param {Object} state
	 * @param {Object} periodo
	 * @param {Object} ditta
	 * 
	 * @return {{
	 * 				status     			: Number,
	 * 				is_dirty			: Boolean,
	 * 				busy				: Boolean,
	 * 				attivata   			: Boolean,
	 * 				compilata  			: Boolean,
	 * 				festivita_approvate : Boolean,
	 * 				festivita			: Array, 
	 * 				lavoratori 			: Array<Number>,
	 *	 			error     			: Boolean,
	 *				message				: String,
	 *				snapshot
	 * 		   }}
	 */
	GetProcessingInfo: function(state, periodo, ditta) { 
							/** 
							 * @type {{
							 * 				status     			: Number,
							 * 				is_dirty			: Boolean,
							 * 				busy				: Boolean,
							 * 				attivata   			: Boolean,
							 * 				compilata  			: Boolean,
							 * 				festivita_approvate : Boolean,
							 * 				festivita			: Array, 
							 * 				lavoratori 			: Array<Number>,
							 *	 			error     			: Boolean,
							 *				message				: String,
							 *				snapshot		
							 * 		   }}
							 */
					   		var elaborazione = state.elaborazione && state.elaborazione[periodo] && state.elaborazione[periodo][ditta];
					   		if(!elaborazione)
					   			throw new Error(scopes.string.Format('No elaboration found for params { idditta=@0, periodo=@1:yyyyMM: }', ditta, periodo));
					   		
					   		return elaborazione;
					   },
					 
	/**
	 * Imposta l'oggetto passato come parametro come stato di elaborazione per il periodo e la ditta indicati
	 * 
	 * @param 		   state
	 * @param {Date}   periodo
	 * @param {Number} ditta
	 * @param 		   obj
	 * 
	 * @return {{
	 * 				status     			: Number,
	 * 				is_dirty			: Boolean,
	 * 				busy				: Boolean,
	 * 				attivata   			: Boolean,
	 * 				compilata  			: Boolean,
	 * 				festivita_approvate : Boolean,
	 * 				festivita			: Array, 
	 * 				lavoratori 			: Array<Number>,
	 *	 			error     			: Boolean,
	 *				message				: String,
	 *				snapshot
	 * 		   }}
	 */
	SetProcessingInfo: function(state, periodo, ditta, obj) {
		state.elaborazione[periodo][ditta] = obj;
		
		return this.GetProcessingInfo(state, periodo, ditta);
	},
	
	/**
	 * Ritorna i dati contenuti nell'oggetto state fornito. In questo caso, le ore per la ditta indicata, ad esclusione
	 * degli eventi da cancellare.
	 * 
	 * @param 		   state	the state object
	 * @param {Number} ditta	the company id
	 * 
	 * @return {Object}	the hours object
	 */
	GetEvents: function(state, ditta) { 
		var ore = this.GetData(state, ditta).ore;
		
		for (var lavoratore in ore)
			for (var giorno in lavoratore)
			{
				/** @type {Array} */
				var events = ore[lavoratore][giorno].events; 
				return events;
			}
		
		return ore;
	},
	
	/**
	 * Set the provided data as the new hours object for the company. Note the method does not create the data object
	 * 
	 * @param 		   state
	 * @param {Number} ditta the company id
	 * @param 		   ore   the data to set as the new hours
	 */
	SetEvents: function(state, ditta, ore) { 
		this.GetData(state, ditta).ore = ore;
	},
	
	/**
	 * Returns the data from the provided state object
	 * 
	 * @param 		   state	the state object
	 * @param {Number} ditta	the company id
	 * 
	 * @return {{ ore, backup }}
	 */
	GetData: function(state, ditta) {
		if(!ditta)
			throw new scopes.error.ArgumentError('No value provided', 'ditta');
		
		if(!state.data)
			throw new Error('No data found');
		
		if(!state.data[ditta])
			throw new Error(scopes.string.Format('No data found for company with id @0', ditta));
		
		/** @type {{ ore, backup }} */
		var data = state.data[ditta];
		
		return data;
	},
	
	/**
	 * Effettua una copia di backup dell'oggetto ore
	 * 
	 * @param 			state
	 * @param {Number} 	ditta
	 */
	BackupData: function(state, ditta)
	{
		/** @type {{ore, backup}} */
		var data = this.GetData(state, ditta);
		if (data)
			data.backup = globals.clone(data.ore);
	},
	
	/**
	 * Copia gli eventi presenti nell'oggetto oldData nell'oggetto newData, escludendo i giorni per i quali il
	 * dipendente risulta cessato. Perché gli eventi siano copiati, è necessario che entrambi gli oggetti contengano
	 * una proprietà corrispondente all'identificativo del lavoratore. Se questa condizione è verificata, la copia
	 * è effettuata per i soli giorni che risultano compilati in entrambi gli oggetti.
	 * In aggiunta, segna come 'da controllare' (campo <code>warning = true</code>) i giorni per i quali risulta 
	 * variato l'orario teorico.
	 * 
	 * @param 											  newData
	 * @param 											  oldData
	 * @param {JSFoundset<db:/ma_anagrafiche/lavoratori>} lavoratori
	 */
	MergeEvents: function (newData, oldData, lavoratori)
	{
		for (var r = 1; r <= lavoratori.getSize(); r++)
		{
			var record = lavoratori.getRecord(r);
			var l 	   = record.idlavoratore;
			
			var employeeOldData = oldData[l];
			var employeeNewData = newData[l];
			
			// Ignora i lavoratori senza dati
			if (!(employeeOldData && employeeNewData))
				continue;
			
			for (var day in employeeOldData)
			{
				var dayDate = utils.parseDate(day, globals.ISO_DATEFORMAT);
				/** @type {{ workable_hours: Number, worked_hours: Number, events: Array }} */
				var oldDayData = employeeOldData[day];
				/** @type {{ workable_hours: Number, worked_hours: Number, events: Array }} */
				var newDayData = employeeNewData[day];
				
				// Non ripristinare gli eventi precedenti se il dipendente è cessato o non esistono dati per il giorno
				var lavoratoreInForza = !record.cessazione || dayDate < record.cessazione; 
				if(!lavoratoreInForza || !(oldDayData && newDayData))
					continue;

				newDayData.events = globals.clone(oldDayData.events);
					
				// Ignora i giorni senza eventi
				var hasEvents = newDayData.events && newDayData.events.length > 0;
				if (hasEvents && oldDayData.workable_hours != newDayData.workable_hours)
				{
					if(oldDayData.worked_hours > newDayData.workable_hours)
					{
						newDayData.error = true
						newDayData.message = "Le ore lavorate superano il monte ore teorico, controllare gli eventi inseriti";
					}
					else
					{
						newDayData.warning = true;
						newDayData.message  = "L'orario teorico è stato modificato, controllare gli eventi inseriti";
					}
				}
				else
				{
					newDayData.warning = false;
					newDayData.message  = '';
				}
			}
		}
		
		return newData;
	},
	
	/**
	 * Set the provided data as the new hours object for the company. Note the method does not create the data object
	 * 
	 * @param 		   state
	 * @param {Number} ditta the company id
	 * @param 		   obj   the object to set as the new data
	 */
	SetData: function(state, ditta, obj) { 
		if(!state.data)
			throw new Error('No data found');
		
		state.data[ditta] = obj;
	},
	
	/**
	 * @properties={typeid:24,uuid:"F86805AD-FA3D-4C79-924D-FFB202211D93"}
	 */
	GetProcessingState: function(state){
							var status = state.elaborazione && state.elaborazione[state.params.periodo] && state.elaborazione[state.params.periodo][state.params.ditta.id];
							return status && status.status;
						},
						
	GetLastEditableState: function(){ return this.StatoElaborazione.DA_INVIARE; },
	/**
	 * Elenco delle sezioni del wizard. I nomi dei tab del wizard devono corrispondere ai nomi 
	 * delle sezioni perché l'abilitazione/disabilitazione dei passi funzioni correttamente.
	 */
	Sezioni:
	{
		DITTA_PERIODO	: 'ditta_periodo',
		ATTIVITA		: 'attivita',
		LAVORATORI		: 'lavoratori',
		FESTIVITA		: 'festivita',
		ASSENZE			: 'assenze',
		STRAORDINARI	: 'straordinari',
		VARIAZIONI		: 'variazioni',
		CERTIFICATI		: 'certificati',
		ELABORAZIONE	: 'elaborazione'
	},
	
	StatoElaborazione:
	{
		ERRORE			: -1,
		DA_CARICARE		:  1,
		IN_CARICAMENTO	:  2,
		COMPILATA		:  3,
		DA_INVIARE		:  4,
		INVIATA			:  5,
		IN_ELABORAZIONE	:  6,
		ELABORATA		:  7,
		
		GetStatuses: function()
		{
			return [
				{ value: this.DA_CARICARE	 , name: i18n.getI18NMessage('ma.psl.status.uninitialized') },
				{ value: this.IN_CARICAMENTO , name: i18n.getI18NMessage('ma.psl.status.loading') 		},
				{ value: this.COMPILATA      , name: i18n.getI18NMessage('ma.psl.status.saved')  		},
				{ value: this.CHIUSA		 , name: i18n.getI18NMessage('ma.psl.status.loaded') 	 	},
				{ value: this.DA_INVIARE	 , name: i18n.getI18NMessage('ma.psl.status.to_send') 	 	},
				{ value: this.INVIATA		 , name: i18n.getI18NMessage('ma.psl.status.sent') 		 	},
				{ value: this.IN_ELABORAZIONE, name: i18n.getI18NMessage('ma.psl.status.processing')	}
			]
		},
		
		FormatStatus: function(status){
			switch(status)
			{
				case this.DA_CARICARE:
					return i18n.getI18NMessage('ma.psl.status.uninitialized');
					
				case this.IN_CARICAMENTO:
					return i18n.getI18NMessage('ma.psl.status.loading');
					
				case this.COMPILATA:
					return i18n.getI18NMessage('ma.psl.status.saved');
				
				case this.CHIUSA:
					return i18n.getI18NMessage('ma.psl.status.loaded');
					
				case this.DA_INVIARE:
					return i18n.getI18NMessage('ma.psl.status.to_send');
				
				case this.INVIO_IN_CORSO:
					return i18n.getI18NMessage('ma.psl.status.sending');
				
				case this.INVIATA:
					return i18n.getI18NMessage('ma.psl.status.sent');
				
				case this.IN_ELABORAZIONE:
					return i18n.getI18NMessage('ma.psl.status.processing');
				
				case this.ERRORE:
					return i18n.getI18NMessage('ma.psl.status.error');
				
				default:
					return i18n.getI18NMessage('ma.psl.status.uninitialized');
			}
		},
		
		GetProgressForStatus: function(status){
			if(status == this.DA_CARICARE)
				status = 0;
			
			var stepProgress = 1 / this.INVIATA;
			var progress     = Math.floor(status * stepProgress * 100);
			
			return progress;
		}
	}
}

/**
 * @param { { id: Number, code: String, type: String, hours: Number } } event
 *
 * @properties={typeid:24,uuid:"39F82BE9-FD28-4E42-ABEC-69C57DFF45E5"}
 */
function EventToString(event)
{
	if(!event)
		return '';
	
	return event.code + ' ' + event.hours;
}

/**
 * @param {{
 * 			[sync]		   		: Boolean,
 * 			[start_message]		: String,
 * 			[delay]				: Number,
 * 			method				: Function,
 * 			args				: Array
 * 		  }} params
 * 
 * @properties={typeid:24,uuid:"754D4C0F-6170-4FEA-B945-244F6886679E"}
 */
function RunJob(params)
{
	return scopes.continuations.RunJob(params, forms.psl_status_bar);
}

/**
 * @param {Boolean} [asSection]
 * 
 * @properties={typeid:24,uuid:"0B5A6D89-2506-4E46-9C81-78A78D1F6EF4"}
 */
function showStoricoOperazioni(asSection)
{
	if(asSection)
		forms['psl_nav_main'].showStorico();
	else
	{
		var form = forms.psl_mao_history_main;
		globals.ma_utl_showFormInDialog(form.controller.getName(), 'Storico operazioni');
	}
}

/**
 * @param {JSDataSet} dataset
 * @param {{ data: Date, tipo: String }} festa
 * @param {Number} oreLavorabili
 *
 * @properties={typeid:24,uuid:"4DF27569-6866-4BCB-9666-270C2E69D0A7"}
 */
function EventiAmmessiInGiornoDiFesta(dataset, festa, oreLavorabili)
{
	var copyDataset = databaseManager.createEmptyDataSet(0, dataset.getColumnNames());
	
	if(dataset && dataset.getMaxRowIndex() > 0)
	{
		var tipoFesta = scopes.utl.Trim(festa.tipo);
		
		for(var r = 1; r <= dataset.getMaxRowIndex(); r++)
		{
			var tipoEvento = dataset.getValue(r, 3);
			
			if(!(tipoFesta == globals.TipoFestivita.GODUTA     && tipoEvento != globals.TipoEvento.AGGIUNTIVO					  ) ||
			    (tipoFesta == globals.TipoFestivita.RETRIBUITA && tipoEvento == globals.TipoEvento.ORDINARIO && oreLavorabili == 0))
			    	copyDataset.addRow(dataset.getRowAsArray(r));
		}
	}
	
	return copyDataset;
}

/**
 * @param dataset
 *
 * @properties={typeid:24,uuid:"8C85165D-5F57-4C45-84CD-E3DD0A86E32E"}
 */
function SetEventsValuelist(dataset)
{
	application.setValueListItems('vls_evento', dataset);
}

/**
 * Inizializza l'oggetto ore per i lavoratori ed il periodo selezionati. I dati giornalieri sono impostati con i valori seguenti:
 * <ul>
 * 	<li><code>events</code>, array vuoto</li>
 * 	<li><code>workable_hours</code>, l'orario teorico secondo la fascia del giorno</li>
 * 	<li><code>worked_hours</code>, 0 ore</li>
 * </ul>
 * 
 * @param {Array<Number>} lavoratori
 * @param {Date} 		  periodo
 * 
 * @return un nuovo oggetto contenente le ore
 * 
 * @see scopes.psl.InitWorkableHours
 * 
 * @properties={typeid:24,uuid:"71263AFE-A626-44E0-9F49-77EB4B945D51"}
 */
function InitHours(lavoratori, periodo)
{
	var hours = { };
	
	var firstDay = scopes.date.FirstDayOfMonth(periodo);
	var lastDay  = scopes.date.LastDayOfMonth(periodo);
	
	for(var l = 0; l < lavoratori.length; l++)
	{
		var lavoratore = lavoratori[l];
		var data       = hours[lavoratore] = { };
		
		var sqlQuery  = "select Giorno, OreFatte from [dbo].[F_Lav_OreTeorichePeriodo](?, ?, ?) order by Giorno;";
		var sqlParams = [lavoratore, firstDay, lastDay];
	
		var dataset   = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, sqlQuery, sqlParams, -1);
		if(!dataset)
			globals.ma_utl_logError(new Error('Cannot perform query: ' + sqlQuery + ' with params: ' + sqlParams));
		
		dataset.getColumnAsArray(1).forEach(
			function(_, _index){
				var day_ISO     = utils.dateFormat(_, globals.ISO_DATEFORMAT);
				var oreTeoriche = dataset.getValue(_index + 1, 2) / 1e2;
				
				data[day_ISO]      = { events: [], workable_hours: oreTeoriche, worked_hours: 0.00 }; 
			});
	}
	
	return hours;
}

/**
 * Aggiorna l'orario teorico, ovvero il campo <code>worked_hours</code> dell'oggetto <code>ore</code>, per i lavoratori 
 * ed il periodo forniti come parametri.<br/>
 * I giorni per i quali non sono presenti dati sono ignorati.
 * 
 * @param 				  ore
 * @param {Array<Number>} lavoratori
 * @param {Date}		  periodo
 * 
 * @return l'oggetto <code>ore</code> aggiornato
 * 
 * @see scopes.psl.InitHours
 *
 * @properties={typeid:24,uuid:"29EE79B2-AEFD-4B32-A03D-ABE9C7F6373A"}
 */
function InitWorkableHours(ore, lavoratori, periodo)
{
	var firstDay = scopes.date.FirstDayOfMonth(periodo);
	var lastDay  = scopes.date.LastDayOfMonth(periodo);
	
	for(var l = 0; l < lavoratori.length; l++)
	{
		var lavoratore = lavoratori[l];
		
		var data = ore[lavoratore];
		if (data)
		{
			var sqlQuery  = "select Giorno, OreFatte from [dbo].[F_Lav_OreTeorichePeriodo](?, ?, ?) order by Giorno;";
			var sqlParams = [lavoratore, firstDay, lastDay];
		
			var dataset   = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, sqlQuery, sqlParams, -1);
			if(!dataset)
				globals.ma_utl_logError(new Error('Cannot perform query: ' + sqlQuery + ' with params: ' + sqlParams));
			
			dataset.getColumnAsArray(1).forEach(
				function(_, _index){
					var day_ISO     = utils.dateFormat(_, globals.ISO_DATEFORMAT);
					var oreTeoriche = dataset.getValue(_index + 1, 2) / 1e2;
					
					var dayData = data[day_ISO];
					if (dayData)
						dayData.workable_hours = oreTeoriche;
				});
		}
	}
	
	return ore;
}

/**
 * Verifica eventuali giornate da controllare l'oggetto delle ore fornito come parametro. Un giorno è considerato
 * da controllare se l'orario teorico risulta modificato rispetto alla situazione precedente.
 * 
 * @param oldData			l'oggetto delle ore con i valori precedenti alla modifica
 * @param newData   		l'oggetto delle ore con i valori successivi alla modifica
 * @param {Array<Number>} 	lavoratori
 *
 * @properties={typeid:24,uuid:"1EB9FADB-0F9A-423A-8B7A-A6D29CCD549B"}
 */
function MarkDaysToCheck(oldData, newData, lavoratori)
{
	lavoratori.forEach(function(l) {
		var employeeOldData = oldData[l];
		var employeeNewData = newData[l];
		
		if (employeeOldData && employeeNewData)
		{
			for (var day in employeeOldData)
			{
				/** @type {{ workable_hours: Number, worked_hours: Number, events: Array }} */
				var oldDayData = employeeOldData[day];
				/** @type {{ workable_hours: Number, worked_hours: Number, events: Array }} */
				var newDayData = employeeNewData[day];
	
				if (oldDayData && newDayData && oldDayData.workable_hours != newDayData.workable_hours)
				{
					newDayData.warning = true;
					newDayData.message  = "L'orario teorico è stato modificato, controllare gli eventi inseriti";
				}
				else
				{
					newDayData.warning = false;
					newDayData.message  = '';
				}
			}
		}
	});
}

/**
 * @param 												data
 * @param {JSFoundset<db:/ma_anagrafiche/lavoratori>} 	lavoratori
 *
 * @properties={typeid:24,uuid:"73F004DD-D179-493C-9D69-D989296716C3"}
 */
function ClearUnemployedWorkers(data, lavoratori)
{
//	if (!data)
//		return data;
//	
//	for(var r = 1; r <= lavoratori.getSize(); r++)
//	{
//		var record = lavoratori.getRecord(r);
//		
//		var employeeData = data[record.idlavoratore];
//		if (employeeData)
//		{
//			var daysToClear = Object.getOwnPropertyNames(employeeData).filter(function(_) {
//				var date = utils.parseDate(_, globals.ISO_DATEFORMAT);
//				return date && date > record.cessazione;
//			});
//			
//			daysToClear.forEach(function(_) { employeeData[_] = { worked_hours: null, workable_hours: null, events: [] }; });
//		}
//	}
}

/**
 * @param {String|Error} [error]
 *
 * @properties={typeid:24,uuid:"52AD11C6-D56A-4B3E-AB1C-F5FF4F6DC75E"}
 */
function ShowError(error)
{
	/** @type {String} */
	var msg = error;
	if(error instanceof Error)
		msg = error.message;
	
	forms.psl_status_bar.setStatusError(msg);
}

/**
 * @param {String} [message]
 *
 * @properties={typeid:24,uuid:"B183C3D4-ED10-40AB-977C-B632105D1AE3"}
 */
function ShowMessage(message)
{
	forms.psl_status_bar.setStatusNeutral(message);
}

/**
 * @properties={typeid:24,uuid:"52933D94-C447-436E-A708-FBB3BC4EA55E"}
 */
function Setup()
{
	if (application.getApplicationType() === APPLICATION_TYPES.WEB_CLIENT)
	{
		// global style css
		plugins.WebClientUtils.addCssReference('templates/psl/psl.css');
		
		// fonts css
		plugins.WebClientUtils.addCssReference('templates/psl/fonts/icomoon/icomoon.css');
		plugins.WebClientUtils.addCssReference('templates/psl/fonts/pt/sans.css');
		plugins.WebClientUtils.addCssReference('templates/psl/fonts/pt/serif.css');
		plugins.WebClientUtils.addCssReference('templates/psl/fonts/pt/mono.css');
		
		// additional js
		plugins.WebClientUtils.addJsReference('templates/psl/js/progressbar.min.js');
	}
}