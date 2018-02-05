/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"1B6AA178-D075-451A-9654-F28D0E32A5FD"}
 */
var v_html = '<script type="text/javascript">\
				$(document).ready(function()\
				{\
					$("div.section-btn").hover(\
						function(e){\
							$(this).addClass("section-selected");\
						},\
						function(e){\
							$(this).removeClass("section-selected");\
						});\
				});\
			  </script>';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"A65385EA-3695-4304-8F1E-6816F39F94FE"}
 */
var previous_menu = '';

/**
 * @return {RuntimeForm<psl_nav_section_menu>}
 * 
 * @properties={typeid:24,uuid:"4F8A4894-532C-4D99-B263-D9F816DB6F9C"}
 */
function getParentMenu()
{
	return forms.psl_nav_section_menu;
}

/**
 * @param {String}                    name
 * @param {Array<scopes.psl.Sezione>} sections
 * @param {String}                    [parent]
 * 
 * @properties={typeid:24,uuid:"9BB5A30F-EC2C-4100-828B-7AFC1CCE3A0E"}
 */
function buildMenu(name, sections, parent)
{
	var form = controller.getName();
	
	var jsForm = solutionModel.getForm(form);
	if(!jsForm)
		throw new Error('Form not found: ' + form);
		
	var x = 20, y = 20;
	var btnWidth = 320 - x - y, btnHeight = 60;
	
	var enabledSections = sections.filter (function(sezione) { return !sezione.disabled; });
		enabledSections.forEach(function(sezione, index) {
			var sectionButton = jsForm.newLabel(sezione.menu, x, y, btnWidth, btnHeight, getMenuItemOnAction(jsForm, sezione));
				sectionButton.name = 'btn_section_' + sezione.nome;
				sectionButton.rolloverCursor = SM_CURSOR.HAND_CURSOR;
				sectionButton.styleClass = 'material-button';//'section-btn';
				sectionButton.transparent = false;
				sectionButton.showClick = false;
				sectionButton.horizontalAlignment = SM_ALIGNMENT.CENTER;
				sectionButton.anchors = SM_ANCHOR.WEST | SM_ANCHOR.EAST | SM_ANCHOR.NORTH;
				
			var sectionHtml = jsForm.newVariable('v_section_html_' + sezione.nome, JSVariable.TEXT);
			var sectionIcon = jsForm.newHtmlArea(sectionHtml.name, sectionButton.x + 20, sectionButton.y + 15, 30, 30);
				sectionIcon.name = 'v_html_' + sezione.nome;
				sectionIcon.transparent = true;
				sectionIcon.styleClass = 'icon';
				sectionIcon.editable = false;
				sectionIcon.scrollbars = SM_SCROLLBAR.VERTICAL_SCROLLBAR_NEVER | SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_NEVER;

				y += btnHeight + 10;
		});
	
	if(y > jsForm.getBodyPart().height)
	{
		var gap = y - jsForm.getBodyPart().height;
		jsForm.getBodyPart().height += gap;
	}
	
	forms[form].controller.recreateUI();
	
	if(parent)
		forms[form].setPreviousMenu(parent);
	
	enabledSections.forEach(function(sezione) {
		plugins.WebClientUtils.setExtraCssClass(elements['btn_section_' + sezione.nome], 'material-button material-button-section');
		plugins.WebClientUtils.setExtraCssClass(elements['v_html_' + sezione.nome], 'menu-icon');
		forms[form]['v_section_html_' + sezione.nome] = scopes.string.Format('<span class="icon icon-small @0"></span>', sezione.icona);
	});
	
	return form;
}

/**
 * @properties={typeid:24,uuid:"3349C9DC-38FE-47B9-B96C-5D2D0CCFAD0B"}
 */
function getMenuItemOnAction(jsForm, sezione)
{
	return null;
}

/**
 * @properties={typeid:24,uuid:"A36A5391-3ADB-44E0-91EB-9E7D832A8140"}
 */
function createMenu(sections)
{
	buildMenu('main', sections);
}

/**
 * @properties={typeid:24,uuid:"D53E3839-D9E5-46FF-AF07-A2BEECC410CC"}
 */
function resetInfo()
{
	forms.psl_nav_info.resetInfo();
}

/**
 * @param {String} info
 *
 * @properties={typeid:24,uuid:"B3519FCC-ADD1-4874-9341-A038D73E4467"}
 */
function showInfo(info)
{
	forms.psl_nav_info.setInfo(info);
}