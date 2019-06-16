import modal from 'modal';

/**
 * Window-Clickfunction die aufgerufen wird, sobald außerhalb des modalen
 * Dialogs geklickt wurde
 */
window.onclick = modal.modalHandlerFn;

submitButton.addEventListener("click", function () {
    var model_content = document.getElementById("modal-content")

    var password = model_content.elements[5].value
    var passwordRepeat = model_content.elements[6].value

    if (password != passwordRepeat) {
        alert("\nPassword did not match: Please try again...")
        return false;
    }
});