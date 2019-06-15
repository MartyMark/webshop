var modal = document.getElementById('registerModul');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        location.href = "/index.html"
    }
}

submitButton.addEventListener("click", function() {
    var model_content = document.getElementById("modal-content")

    var password = model_content.elements[5].value
    var passwordRepeat = model_content.elements[6].value

    if (password != passwordRepeat) {
        alert("\nPassword did not match: Please try again...")
        return false;
    }
});