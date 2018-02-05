/**
 * @type {JSWindow}
 *
 * @properties={typeid:35,uuid:"BF6DA7E9-C75F-4152-9CFC-772D6B36995A",variableType:-4}
 */
var window;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"188F4076-2C8C-4609-979A-D38C1C799AB2"}
 */
var html = scopes.string.Format(
			'<html>\
				   <strong>PresenzaSempliceLite</strong> utilizza alcuni <a href="https://it.wikipedia.org/wiki/Tipo_di_carattere">tipi di carattere</a>\
				   personalizzati. Per motivi di sicurezza e nel rispetto della tua privacy, non possiamo accedere al tuo computer per\
				   installare i file necessari al loro utilizzo. Se sei interessato ad utilizzare questa\
				   funzionalità, clicca sul pulsante <strong>@0</strong> qui sotto.\
				   <p>Una volta terminato il download, estrai i file nella cartella <code>C:\\Windows\\Fonts</code> del tuo computer\
				   e ricarica la pagina.</p>\
			</html>',
			i18n.getI18NMessage('svy.fr.lbl.download'));

/**
 * @param {Number} [x]
 * @param {Number} [y]
 * 
 * @properties={typeid:24,uuid:"A7A99E4A-74F7-4B51-A5D1-F3648FFFE765"}
 */
function show(x, y)
{
	window = application.createWindow('w_temp_' + application.getUUID(), JSWindow.MODAL_DIALOG);
//	window.undecorated = true;
	window.title = '';
	window.resizable = false;
	window.setInitialBounds(x || -1, y || -1, 550, 300);
	window.transparent = true;
	
	controller.show(window);
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"72FC1E55-B1B1-4615-809B-F3680A583C34"}
 */
function onAction$btn_close(event) 
{
	window.hide();
	window.destroy();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1EB9E7A2-730D-40E3-8516-33895B2AC77E"}
 */
function onAction$btn_download(event) 
{
	var file = plugins.file.convertToJSFile('templates/psl/fonts/PSL-Fonts.zip');
	plugins.file.writeFile(file.getName(), file.getBytes(), globals.MimeTypes.ZIP);
}
