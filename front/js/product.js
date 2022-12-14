//Fonction pour récupérer l'ID du produit
function getIdProductFromUrl(){
    let urlproduct = new URLSearchParams(window.location.search);
    return urlproduct.get('id');
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
        .then(function(product){
            showData(product); 
        })
        //Fonction pour récupérer les erreurs
        .catch(function(err){
            let sectionproduct = document.querySelector('.item');
            sectionproduct.innerHTML = 'Une erreur est survenue, veuillez réessayer plus tard';
            console.log('getDatasFromAPI : erreur de paramètre', err);
        });
}

//Fonction pour afficher les éléments du produit
function showData(product){

    //Création des éléments du produit
    let imageproduct = document.createElement('img');

    //Contrôle du produit
    if (product == null){
        console.log('showData : erreur de paramètre');
        return;
    }

    //Attribution des valeurs dans les éléments avec les données de l'API
    imageproduct.src = `${product.imageUrl}`;
    imageproduct.alt = `${product.altTxt}`;
    let titleproduct = `${product.name}`;
    let priceproduct = `${product.price}`;
    let descriptionproduct = `${product.description}`;

    //Attribution des éléments dans le code HTML
    document.querySelector('.item__img').append(imageproduct);
    document.querySelector('title').append(": "+titleproduct);
    document.querySelector('#title').append(titleproduct);
    document.querySelector('#price').append(priceproduct);
    document.querySelector('#description').append(descriptionproduct);

    //Boucle pour mettre les couleurs dans le menu déroulant
    for (let colorproduct of product.colors){
        let optionproduct = document.createElement('option');
        optionproduct.value = colorproduct;
        optionproduct.innerText = colorproduct;
        document.querySelector('#colors').append(optionproduct);
    }
}

//Fonction pour créer la division du message dans l'html
function message(){
    let alertaddcart = document.createElement('div');
    alertaddcart.classList.add('alertcart');
    alertaddcart.style.margin = 'auto';
    alertaddcart.style.marginTop = '15px';
    alertaddcart.style.height = '0px';
    alertaddcart.style.fontWeight = '600';
    document.querySelector('.item__content').append(alertaddcart);
}
message();

//Fonction pour afficher le message
function showMessage(type, message){
    document.querySelector('.alertcart').style.color = type;
    document.querySelector('.alertcart').innerText = message;
    setTimeout(function(){
        document.querySelector('.alertcart').innerText = ``;
    }, 2000);
}

//Fonction pour récupérer les données du produit
function addEventToButtonCart(){

    //Récupération de l'élément bouton
    let buttoncart = document.querySelector('#addToCart');

    //Écoute de l'évènement "click" sur le bonton "Ajouter au panier"
    buttoncart.addEventListener('click', function(event){
        event.preventDefault();
        let selectcolor = document.querySelector('#colors');
        let selectquantity = document.querySelector('#quantity');
        if (selectcolor.value == ""){
            document.querySelector('#colors').style.color = 'red';
            setTimeout(function(){
                document.querySelector('#colors').style.color = '#2d2f3e';
            }, 2000);
        }
        else if (selectquantity.value < 1 || selectquantity.value > 100){
            showMessage('red', `Sélectionner une quantité entre 1 et 100`);
        }
        else {
            showMessage('green', `Article(s) ajouter au panier`);
            addToCart();
        }
    })
}

//Fonction pour créer un produit à stocker
function createSelectProduct(){
    let selectcolor = document.querySelector('#colors');
    let selectquantity = document.querySelector('#quantity');
    return {
        id: getIdProductFromUrl(),
        color: selectcolor.value,
        quantity: parseInt(selectquantity.value),
    }
}

//Fonction pour vérifier le LocalStorage
function getLocalStorage(){
    let cartstorage = localStorage.getItem('cartproducts');
    return cartstorage === null ? [] : JSON.parse(cartstorage);
}

//Fonction pour stocker les données du produit dans le LocalStorage
function addToCart(){
    let selectproduct = createSelectProduct();
    let cartstorage = getLocalStorage();
    if (cartstorage === []){
        cartstorage.push(selectproduct);
    } 
    else {
        let searchproduct = cartstorage.find(
            resultproduct => resultproduct.id == selectproduct.id && resultproduct.color == selectproduct.color);
        if (searchproduct == undefined){
            cartstorage.push(selectproduct);
        }
        else {
            let qty=JSON.parse(searchproduct.quantity) + JSON.parse(selectproduct.quantity);
            searchproduct.quantity = qty > 100 ? 100 : qty;
            if (qty > 100) {
                showMessage('red', `Vous avez déja une quantité de 100 articles dans votre panier`);
            }
        }
    }
    localStorage.setItem('cartproducts', JSON.stringify(cartstorage));
}

//Fonction main de l'API
function main(){
    let url = "http://localhost:3000/api/products/";
    let id = getIdProductFromUrl();
    getDatasFromAPI(url+id);
    addEventToButtonCart();
}
main();