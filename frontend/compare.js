document.addEventListener('DOMContentLoaded', function() {
    let total = 0
    if(localStorage.getItem("total")){
        total = parseInt(localStorage.getItem("total"));
    }
    for(let i = 1; i <= total; i++){
        let aoption = document.createElement("option");
        let boption = document.createElement("option");
        aoption.className += "option";
        boption.className += "option";
        aoption.text = localStorage.getItem(i).split(", ")[0]+", "+localStorage.getItem(i).split(", ")[1];
        boption.text = localStorage.getItem(i).split(", ")[0]+", "+localStorage.getItem(i).split(", ")[1];
        document.getElementById("o1").appendChild(aoption);
        document.getElementById("o2").appendChild(boption);
    }

    // let selectL = document.getElementById("cl")
    // selectL.addEventListener("change", (event) => {
    //     console.log("L")
    //     let name = document.createElement("div")
    //     name.text += event.target.text;
    //     selectL.appendChild(name)
    // })
    // let selectR = document.getElementById("cr")
    // selectR.addEventListener("change", (event) => {
    //     console.log("R")
    //     let name = document.createElement("div")
    //     name.text += event.target.text;
    //     selectR.appendChild(name)
    // })
}); 