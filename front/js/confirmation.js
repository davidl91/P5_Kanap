//Fonction pour récupérer l'ID de la commande
function getIdOrderFromUrl(){
    localStorage.clear();
    let urlorder = new URLSearchParams(window.location.search)
    return urlorder.get('orderid')
}
getIdOrderFromUrl();
//Fonction pour afficher l'ID de la commande
function showOrderID(){
    document.querySelector('#orderId').innerText = getIdOrderFromUrl();
}
showOrderID();