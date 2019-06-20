let homeBtn = document.getElementById('homeBtn');

homeBtn.addEventListener("click", function() {
    window.location.href = '/'
})
homeBtn.addEventListener("mouseover", function() {
    homeBtn.style.opacity = 0.7
})

homeBtn.addEventListener("mouseout", function() {
    homeBtn.style.opacity = 1
})