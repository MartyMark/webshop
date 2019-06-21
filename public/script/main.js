let cartContaiener = document.getElementById('cartContainer');
let homeBtn = document.getElementById('homeBtn');

cartContaiener.addEventListener("click", clickOnCart)
cartContaiener.addEventListener("mouseover", mouseOverCart)
cartContaiener.addEventListener("mouseout", mouseOutCart)

function clickOnCart() {
    window.location.href = '/shoppingcard'
}

function mouseOverCart() {
    let cartImage = document.getElementById('cartImage')
    let productCount = document.getElementById('productTotalCount')
    let totalAmount = document.getElementById('totalAmount')

    cartImage.style.opacity = 0.7
    productCount.style.opacity = 0.7
    totalAmount.style.opacity = 0.7
}

function mouseOutCart() {
    let cartImage = document.getElementById('cartImage')
    let productCount = document.getElementById('productTotalCount')
    let totalAmount = document.getElementById('totalAmount')

    cartImage.style.opacity = 1
    productCount.style.opacity = 1
    totalAmount.style.opacity = 1
}

homeBtn.addEventListener("mouseover", function() {
    homeBtn.style.opacity = 0.7
})

homeBtn.addEventListener("mouseout", function() {
    homeBtn.style.opacity = 1
})