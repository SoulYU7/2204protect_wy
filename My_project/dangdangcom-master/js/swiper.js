class Swiper{
    constructor(){
        this.lastIndex = 0;
        this.index = 0;
        this.times = '';
        this.getNode();
        this.rightPrevHandler();
        this.leftPrevHandler();
        this.portHandler();
        this.autoPlay();
        this.mouseoverHandler();
        this.mouseoutHandler();
    }

    //获取节点
    getNode(){
        this.ulLisObj = this.$('.swiper_li li');
        this.olLisObj = this.$('ol li');
        this.rightPrev = this.$('#goNext');
        this.leftPrev = this.$('#goPrev');
    }
    
    rightPrevHandler(){//右边按纽
        this.rightPrev.onclick = ()=>{
            this.lastIndex = this.index;
            this.index++;
            //判断索引是否超过最大值
            if(this.index > this.ulLisObj.length - 1){
                this.index = 0;
            }
            this.change();
        }
    }


    leftPrevHandler(){//左边按钮
        this.leftPrev.onclick = ()=>{
            this.lastIndex = this.index;
            this.index--;
            if(this.index < 0){
                this.index = this.ulLisObj.length - 1;
            }
            this.change();
        }
    }

    portHandler(){//小圆点函数
        this.olLisObj.forEach((li , key)=>{
            li.onclick = ()=>{
                this.lastIndex = this.index;
                this.index = key;
                this.change();
            }
        })
    }


    autoPlay(){
        this.times = setInterval(()=>{
            this.rightPrev.onclick();
        },2000);
    }

    mouseoverHandler(){
        this.rightPrev.parentNode.onmouseover = ()=>{
            clearInterval(this.times);
        }
    }

    mouseoutHandler(){
        this.rightPrev.parentNode.onmouseout = ()=>{
            this.autoPlay();
        }
    }
    change(){

        //上一张图片隐藏
        this.ulLisObj[this.lastIndex].className = '';
        this.olLisObj[this.lastIndex].className = '';
        //设置当前操作的图片显示
        this.ulLisObj[this.index].className = 'swiper_img';
        this.olLisObj[this.index].className = 'swiper_img';

    }


    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }
}

new Swiper;