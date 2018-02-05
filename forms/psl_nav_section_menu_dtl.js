/**
 * @param sections
 *
 * @properties={typeid:24,uuid:"46559125-12EB-4D3E-8507-732D9775FA2B"}
 */
function createMenu(sections)
{
	return getMenuTab().createMenu(sections);
}

/**
 * @properties={typeid:24,uuid:"9A973EC8-C6DB-4716-8BE4-42FED5BE0594"}
 */
function getMenuTab()
{
	/** @type {RuntimeForm<psl_nav_menu>} */
	var form = forms[elements.menu_tab.getTabFormNameAt(1)];
	return form;
}