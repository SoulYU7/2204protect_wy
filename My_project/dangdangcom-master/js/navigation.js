
// console.log(clo);
var clo = document.querySelector('.hidden_column');
function init(){
    document.addEventListener(scroll , scrollHandler())
}
function scrollHandler(){
    setInterval(()=>{
        if(document.documentElement.scrollTop>800){
            clo.style.display= "block";
    }else{
        clo.style.display="none";
    }
    }, 500)
}
init();