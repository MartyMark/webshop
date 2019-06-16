const modalHandle = require('./modal');

/**
 * Window-Clickfunction die aufgerufen wird, sobald außerhalb des modalen
 * Dialogs geklickt wurde.
 */
window.onclick = modalHandle.modalHandlerFn;