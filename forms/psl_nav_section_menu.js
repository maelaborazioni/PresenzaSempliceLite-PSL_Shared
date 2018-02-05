/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected 
 *
 * @properties={typeid:24,uuid:"D1EA7B88-E63A-46F5-9062-870BBBCDD214"}
 */
function onLoad(event)
{
	getMenu().createMenu(getSections());
}

/**
 * @return {RuntimeForm<psl_nav_section_menu_dtl>}
 * 
 * @properties={typeid:24,uuid:"BBD70B4F-DE45-49C3-9B28-0F29EDF81C03"}
 */
function getMenu()
{
	/** @type {RuntimeForm<psl_nav_section_menu_dtl>} */
	var form = forms[elements.nav_tab.getTabFormNameAt(1)];
	return form;
}

/**
 * @properties={typeid:24,uuid:"FCEB242C-7D97-42C4-BA48-31E3DDED03B5"}
 */
function getSections()
{
	return [];
}

/**
 * @properties={typeid:24,uuid:"5F1C3E36-A9B8-4E63-9034-E4A1A7FD2F14"}
 */
function openDataSection()
{
	elements.nav_tab.tabIndex = 'data';
	enableMenu();
}

/**
 * @properties={typeid:24,uuid:"A4180A68-9D28-4617-A0B1-9C79CBA95F8F"}
 */
function getDataSection()
{
	return forms[elements.nav_tab.getTabFormNameAt(2)];
}


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"05092D6A-FBC2-4B88-9505-D3E01C3B38CE"}
 */
function onAction$btn_menu(event)
{
	gotoMenu();
}

/**
 * @properties={typeid:24,uuid:"93438610-4E93-466A-A6EE-869DFB81D2B4"}
 */
function gotoMenu()
{
	elements.nav_tab.tabIndex = 'menu';
	disableMenu();
}

/**
 * @properties={typeid:24,uuid:"EA69C67A-409B-4DD3-91C5-CD810B959596"}
 */
function enableMenu()
{
	elements.btn_menu.visible = true;
}

/**
 * @properties={typeid:24,uuid:"31F7B350-A234-4815-8DB0-5FDF231DDC66"}
 */
function disableMenu()
{
	elements.btn_menu.visible = false;
}