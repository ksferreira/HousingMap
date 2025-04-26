document.addEventListener('DOMContentLoaded', function() {
    let total = 0
    if(localStorage.getItem("total")){
        total = parseInt(localStorage.getItem("total"));
    }
    for(let i = 1; i <= total; i++){
        let list = document.createElement("div");
        list.className += " compare-container";
        let inner = document.createElement("div");
        inner.className += "list";
        inner.textContent = localStorage.getItem(i);
        list.appendChild(inner);
        document.getElementById("list-container").appendChild(list);
    }
}); 
