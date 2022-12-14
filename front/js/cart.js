let ProductsLS;
let ProductsAPI;

//Fonction pour récupérer les données dans le LocalStorage
function getCartProducts(){
    let cartproducts = localStorage.getItem('cartproducts');
    if (cartproducts != undefined && cartproducts != '[]'){
        return JSON.parse(cartproducts);
    }
}

//Fonction pour vérifier si le panier est vide
function checkCartEmpty(){
    if (ProductsLS === undefined || ProductsLS === '[]'){
        document.querySelector('.cart__price').style.visibility = 'hidden';
        document.querySelector('.cart__order').style.visibility = 'hidden';
        document.querySelector('h1').innerText = `Votre panier est vide, selectionner des articles à l'accueil`;
        return true;
    }
}

//Fonction pour effectuer des requêtes HTTP depuis l'API
function getDatasFromAPI(url){
    fetch(url)
    //Fonction pour interroger url
        .then(function(response){
            if (response.ok){
                return response.json();
            }
        })
        //Fonction de récupération de la réponse
        .then(function(products){
            ProductsAPI = products;
            showSelectProduct();
        })
        //Fonction pour récupérer les erreurs
        .catch(function(err){
            let cartproduct = document.querySelector('#cart__items');
            cartproduct.innerHTML = 'Une erreur est survenue, veuillez réessayer plus tard';
            console.log('getDatasFromAPI : erreur de paramètre', err);
        })
}

//Fonction pour afficher les produits du panier depuis le LocalStorage
function showSelectProduct(){
    for (let selectproduct of ProductsLS){

        //Création des éléments du produit
        let articleproduct = document.createElement('article');
        let imagedivision = document.createElement('div');
        let imageproduct = document.createElement('img');
        let contentdivision = document.createElement('div');
        let descriptiondivision = document.createElement('div');
        let titleproduct = document.createElement('h2');
        let colorproduct = document.createElement('p');
        let priceproduct = document.createElement('p');
        let settingsdivision = document.createElement('div');
        let quantitydivision = document.createElement('div');
        let quantityproduct = document.createElement('p');
        let inputquantity = document.createElement('input');
        let deletedivision = document.createElement('div');
        let deleteproduct = document.createElement('p');

        //Attribution des valeurs avec les données du LocalStorage
        articleproduct.classList.add('cart__item');
        articleproduct.setAttribute('data-id', `${selectproduct.id}`);
        articleproduct.setAttribute('data-color', `${selectproduct.color}`);
        imagedivision.classList.add('cart__item__img');
        contentdivision.classList.add('cart__item__content');
        descriptiondivision.classList.add('cart__item__content__description');
        colorproduct.innerText = `${selectproduct.color}`;
        settingsdivision.classList.add('cart__item__content__settings');
        quantitydivision.classList.add('cart__item__content__settings__quantity');
        quantityproduct.innerText = `Qté : `+`${selectproduct.quantity}`;
        inputquantity.setAttribute('type', 'number');
        inputquantity.classList.add('itemQuantity');
        inputquantity.setAttribute('name', 'itemQuantity');
        inputquantity.setAttribute('min', '1');
        inputquantity.setAttribute('max', '100');
        inputquantity.setAttribute('value', `${selectproduct.quantity}`);
        deletedivision.classList.add('cart__item__content__settings__delete');
        deleteproduct.classList.add('deleteItem');
        deleteproduct.innerText = `Supprimer`;

        //Attribution des valeurs avec les données de l'API
        for (let product of ProductsAPI){
            if (product._id === selectproduct.id){
                imageproduct.src = `${product.imageUrl}`;
                imageproduct.alt = `${product.altTxt}`;
                titleproduct.innerText = `${product.name}`;
                priceproduct.innerText = `${product.price}`;
            }
        }

        //Attribution des éléments dans le code HTML
        document.querySelector('#cart__items').append(articleproduct);
        articleproduct.append(imagedivision, contentdivision);
        imagedivision.append(imageproduct);
        contentdivision.append(descriptiondivision, settingsdivision);
        descriptiondivision.append(titleproduct, colorproduct, priceproduct);
        settingsdivision.append(quantitydivision, deletedivision);
        quantitydivision.append(quantityproduct, inputquantity);
        deletedivision.append(deleteproduct);
    }
    changeQuantityProducts();
    deleteSelectProduct();
    getQuantityProducts();
    getPriceProducts();
}

//Fonction pour changer la quantité du produit dans le panier
function changeQuantityProducts(){
    let cartitem = document.querySelectorAll('.cart__item');
    cartitem.forEach((cartitem) => {
        let alertquantity = document.createElement('div');
        alertquantity.style.height = '0px';
        cartitem.querySelector('.cart__item__content__settings').append(alertquantity);
        let changequantity = cartitem.querySelector('.itemQuantity');
        let showquantity = cartitem.querySelector('.cart__item__content__settings__quantity');
        changequantity.addEventListener('change', function(event){
            event.preventDefault();
            console.log(changequantity.value)
            if (changequantity.value < 1 || changequantity.value > 100){
                alertquantity.innerText = `Sélectionner une quantité entre 1 et 100`;
                alertquantity.style.color = 'red';
            }
            else {
                alertquantity.innerText = ``;
                for (let selectproduct of ProductsLS){
                    changeproduct = ProductsLS.find(selectproduct => 
                    selectproduct.id === cartitem.dataset.id && selectproduct.color === cartitem.dataset.color);
                    if (selectproduct.color === cartitem.dataset.color){
                    selectproduct.quantity = parseInt(changequantity.value);
                    showquantity.firstElementChild.textContent = ('Qté : '+parseInt(changequantity.value));
                    localStorage.setItem('cartproducts', JSON.stringify(ProductsLS));
                    }
                    getQuantityProducts();
                    getPriceProducts();
                }
            }
        })
    })
}

//Fonction pour supprimer un produit du panier
function deleteSelectProduct(){
    let cartitem = document.querySelectorAll('.cart__item');
    cartitem.forEach((cartitem) => {
        let deleteproduct = cartitem.querySelector('.deleteItem');
        deleteproduct.addEventListener('click', function(event){
            event.preventDefault();
            ProductsLS = ProductsLS.filter(selectproduct => 
                selectproduct.id != cartitem.dataset.id || selectproduct.color != cartitem.dataset.color);
            localStorage.setItem('cartproducts', JSON.stringify(ProductsLS));
            location.reload();
        })
    })
}

//Fonction pour récupérer la quantité total des produits et l'afficher
function getQuantityProducts(){
    let quantityproducts = 0;
    let cartitem = document.querySelectorAll('.cart__item');
    cartitem.forEach((cartitem) => {
        quantityproducts += parseInt(cartitem.querySelector('.itemQuantity').value);
        document.querySelector('#totalQuantity').innerText = quantityproducts;
    })
}

//Fonction pour récupérer le prix total des produits et l'afficher
function getPriceProducts(){
    let priceproducts = 0;
    let cartitem = document.querySelectorAll('.cart__item');
    cartitem.forEach((cartitem) => {
        for (let product of ProductsAPI){
            let priceproduct = `${product.price}`;
            if (product._id === cartitem.dataset.id){
                priceproducts += parseInt(cartitem.querySelector('.itemQuantity').value) * priceproduct;
            }
        }
        document.querySelector('#totalPrice').innerText = priceproducts;
    })
}

//Fonction pour vérifier la validité du prénom
function checkFirstName(){
    let regexname = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    if (regexname.test(document.querySelector('#firstName').value) == true){
        return true
    } else {
        document.querySelector('#firstNameErrorMsg').innerText = 'Veuillez saisir un prénom valide';
        setTimeout(function(){
            document.querySelector('#firstNameErrorMsg').innerText = '';
        }, 3000);
    }
}

//Fonction pour vérifier la validité du nom
function checkLastName(){
    let regexname = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    if (regexname.test(document.querySelector('#lastName').value) == true){
        return true
    } else {
        document.querySelector('#lastNameErrorMsg').innerText = 'Veuillez saisir un nom valide';
        setTimeout(function(){
            document.querySelector('#lastNameErrorMsg').innerText = '';
        }, 3000);
    }
}

//Fonction pour vérifier la validité de l'adresse
function checkAddress(){
    let regexaddress = /((^[0-9]*).?((BIS)|(TER)|(QUATER))?)?((\W+)|(^))(([a-z]+.)*)([0-9]{5})?.(([a-z\'']+.)*)$/;
    if (regexaddress.test(document.querySelector('#address').value) == true){
        return true
    } else {
        document.querySelector('#addressErrorMsg').innerText = 'Veuillez saisir une adresse valide';
        setTimeout(function(){
            document.querySelector('#addressErrorMsg').innerText = '';
        }, 3000);
    }
}

//Fonction pour vérifier la validité de la ville
function checkCity(){
    let regexname = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    if (regexname.test(document.querySelector('#city').value) == true){
        return true
    } else {
        document.querySelector('#cityErrorMsg').innerText = 'Veuillez saisir une ville valide';
        setTimeout(function(){
            document.querySelector('#cityErrorMsg').innerText = '';
        }, 3000);
    }
}

//Fonction pour vérifier la validité de l'email
function checkEmail(){
    let regexemail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (regexemail.test(document.querySelector('#email').value) == true){
        return true
    } else {
        document.querySelector('#emailErrorMsg').innerText = 'Veuillez saisir un email valide';
        setTimeout(function(){
            document.querySelector('#emailErrorMsg').innerText = '';
        }, 3000);
    }
}

//Fonction pour envoyer le formulaire de contact à l'API
function addEventToForm(){
    let cartform = document.querySelector('.cart__order__form');
    cartform.addEventListener('submit', function(event){
        event.preventDefault();
        let orderproducts = ProductsLS.map(selectproduct => selectproduct.id);
        let idproducts = orderproducts.filter((x, i) => orderproducts.indexOf(x) === i);
        if (checkFirstName() && checkLastName() && checkAddress() && checkCity() && checkEmail()){
            let order = {
                contact: {
                firstName: document.querySelector('#firstName').value,
                lastName: document.querySelector('#lastName').value,
                address: document.querySelector('#address').value,
                city: document.querySelector('#city').value,
                email: document.querySelector('#email').value,
                },
                products: idproducts,
            }
            console.log(order)
            fetch("http://localhost:3000/api/products/order/", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order),
            })
            //Fonction pour interroger url
            .then(function(response){
                if (response.ok){
                    return response.json();
                }
            })
            //Fonction de récupération de la réponse
            .then(function(data){
                let orderid = data.orderId;
                window.location.href = "confirmation.html?orderid="+orderid;
            })
            //Fonction pour récupérer les erreurs
            .catch(function(err){
                let cartproduct = document.querySelector('#cart__items');
                cartproduct.innerHTML = 'Une erreur est survenue, veuillez réessayer plus tard';
                console.log('addEventToForm : erreur de paramètre', err);
            })
        }
    })
}
addEventToForm();

//Fonction main de l'API
function main(){
    let url="http://localhost:3000/api/products/";
    ProductsLS = getCartProducts();
    if (checkCartEmpty() != true){
        getDatasFromAPI(url);
    }
}
main();