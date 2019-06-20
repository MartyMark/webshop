import { modalHandlerFn } from '../script/modal.js';

/**
 * Window-Clickfunction die aufgerufen wird, sobald außerhalb des modalen
 * Dialogs geklickt wurde
 */
window.onclick = modalHandlerFn;