document.addEventListener("DOMContentLoaded", () => {
    function navigate(viewId){
        if(viewId === "home"){
            window.location.href = "home.html"
        }
        if(viewId === "map"){
            window.location.href = "map.html"  
        }
        if(viewId === "about"){
            window.location.href = "about.html"
        }
    }

    document.getElementById("home").addEventListener("click", () => {
        navigate("home");
    });
    document.getElementById("map").addEventListener("click", () => {
        navigate("map");
    });
    document.getElementById("about").addEventListener("click", () => {
        navigate("about");
    });

})

