document.addEventListener('DOMContentLoaded', function() {
    let total = 0
    if(localStorage.getItem("total")){
        total = parseInt(localStorage.getItem("total"));
    }
    for(let i = 1; i <= total; i++){
        let temp = localStorage.getItem(i)
        console.log(temp)
        let list = document.createElement("div");
        list.class = "compare-container";
        let inner = document.createElement("div");
        inner.class = "list";
        inner.textContent = localStorage.getItem(i);
        list.appendChild(inner);
        document.getElementById("list-container").appendChild(list);
    }
}); 
