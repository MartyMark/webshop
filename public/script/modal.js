/**
 * Exportiert eine Handlerfunction. Dieser Handler kümmert sich
 * um die Verarbeitung des Modalendialogs, der modale Dialog verschwindet
 * und man gelangt zu der Index-Seite zurück.
 * 
 * @param {Event} event - Event welches im modalen Dialog geworfen wird
 */
export function modalHandlerFn(event) {
    var modal = document.getElementById('modalHandle');

    if (event.target == modal) {
        modal.style.display = "none";
        location.href = "/"
    }
}

