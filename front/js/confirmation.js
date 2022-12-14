//Fonction pour récupérer l'ID de la commande
function getIdOrderFromUrl(){
    localStorage.clear();
    let urlorder = new URLSearchParams(window.location.search)
    return urlorder.get('orderid')
}

//Fonction pour afficher l'ID de la commande
function showOrderID(id){
    document.querySelector('#orderId').innerText = id;
}

//Fonction main de l'API
function main(){
    let id = getIdOrderFromUrl;
    showOrderID(id);
}
main();

