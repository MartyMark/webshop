var modal = document.getElementById('loginModul');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        location.href = "/index.html"
    }
}