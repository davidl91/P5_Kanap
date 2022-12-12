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
        showDatas(products);
    })
    //Fonction pour récupérer les erreurs
    .catch(function(err){
        let sectionproducts = document.querySelector('#items');
        sectionproducts.innerHTML = 'Une erreur est survenue, veuillez réessayer plus tard';
        console.log('getDatasFromAPI : erreur de paramètre', err);
    });
}

//Fonction pour récupérer des données de la réponse avec une boucle
function showDatas(products){
    for (let product of products){
        showData(product);
    }
}

//Fonction pour afficher une card d'un produit
function showData(product){

    //Création des éléments du produit
    let aproduct = document.createElement('a');
    let articleproduct = document.createElement('article');
    let imageproduct = document.createElement('img');
    let titleproduct = document.createElement('h3');
    let descriptionproduct = document.createElement('p');

    //Contrôle du produit
    if (product == null){
        console.log('showData : erreur de paramètre');
        return;
    }

    //Attribution des valeurs dans les éléments avec les données de l'API
    imageproduct.src = `${product.imageUrl}`;
    imageproduct.alt = `${product.altTxt}`;
    titleproduct.classList.add('productName');
    titleproduct.innerText = `${product.name}`;
    descriptionproduct.classList.add('productDescription');
    descriptionproduct.innerText = `${product.description}`;
    articleproduct.append(imageproduct, titleproduct, descriptionproduct);
    aproduct.href = `./product.html?id=${product._id}`;
    aproduct.append(articleproduct);

    //Envoie de la card du produit
    document.querySelector('#items').append(aproduct);
}

//Fonction main de l'API
function main(){
    let url = "http://localhost:3000/api/products/";
    getDatasFromAPI(url);
}
main();