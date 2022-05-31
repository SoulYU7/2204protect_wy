class RunLight{
    constructor(){
        this.ulObjW;
        this.times="" ;
        this.i = 0;
        this.imgArr= [
            {
                src:"./img/29128183-1_l_5.jpg",
            },
            {
                src:"./img/29130983-1_l_6.jpg",
            },
            {
                src:"./img/29147663-1_l.jpg",
            },
            {
                src:"./img/29148045-1_l.jpg",
            },
            {
                src:"./img/29149837-1_l.jpg",
            },
            {
                src:"./img/29151341-1_l_6.jpg",
            },
            {
                src:"./img/29153498-1_l_11.jpg",
            },
            {
                src:"./img/29154444-1_l.jpg",
            }
        ];

        this.getNode();
        this.createLi();
        this.aotoMove();
    }

     //获取节点函数
     getNode(){
        this.ulObj = this.$('.run_light');
        this.swipper =this.$('.swipper');
    }


    createLi(){
        let li = '';
        for (let attr of this.imgArr){
            li +=`<li><img src="${attr.src}" alt=""></li>`
        }
        this.ulObj.innerHTML = li;
        
        this.liS = this.$('.run_light li');
        this.ulObjW = this.liS[0].offsetWidth*this.liS.length;
        this.ulObj.style.width = this.ulObjW*2 + 'px';
        this.ulObj.innerHTML += this.ulObj.innerHTML;
        this.ulObj.addEventListener('mouseover', this.mouseoverHandler.bind(this))
        this.ulObj.addEventListener('mouseout', this.mouseoutHandler.bind(this))
    }

    aotoMove(){
        
        
        this.times = setInterval(()=>{
            this.i++;
            if(this.i > this.ulObjW){
                this.i = 0;
            }
            
            this.ulObj.style.transform = 'translate(' + (-this.i) + 'px)';
        }, 10);
        
    }
    mouseoverHandler(){
        clearInterval(this.times);
    }
    mouseoutHandler(){
        this.aotoMove();
    }
    //获取标签节点方法
    $(ele){
        let res = document.querySelectorAll(ele);
        //如果获取到多个节点就取第一个，如果不是就返回第一个
        return res.length == 1 ? res[0] : res;
    }
}

new RunLight;