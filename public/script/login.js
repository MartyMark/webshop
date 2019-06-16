import { modalHandlerFn } from './modal.js';

/**
 * Window-Clickfunction die aufgerufen wird, sobald außerhalb des modalen
 * Dialogs geklickt wurde
 */
window.onclick = modalHandlerFn;