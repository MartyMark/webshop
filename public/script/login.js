import { modalHandlerFn } from './modal.js';

/**
 * Window-Clickfunction die aufgerufen wird, sobald außerhalb des modalen
 * Dialogs geklickt wurde
 */
console.log('function', modalHandlerFn);

window.onclick = modalHandlerFn;