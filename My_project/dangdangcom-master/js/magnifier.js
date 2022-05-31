class Utils{
    constructor() {
         this.iconList=["./img/a_icon.jpg","./img/b_icon.jpg","./img/c_icon.jpg","./img/d_icon.jpg","./img/e_icon.jpg","./img/f_icon.jpg","./img/g_icon.jpg","./img/h_icon.jpg","./img/i_icon.jpg","./img/j_icon.jpg"];
         this.bnList=[];
         this.MASK_WIDTH=247.23;
         this.MIN_WIDTH=402;
         this.MAX_WIDTH=492;
         this.IMAGE_MARGIN=9;
         this.IMAGE_WIDTH=58;
         this.init();
     }
     

     //对象的的合并浅拷贝,动态创建节点标签定义行内样式,函数
     static ce(type,style){//第一个参数是节点标签第二个参数是行内样式属性
         let elem=document.createElement(type);
         Object.assign(elem.style,style);
         return elem;
     }
 
     init(){
         let enwrap = this.$('.product_intro');//获取需要添加标签的最外层标签节点
        //  console.log(enwrap);
         //放大镜最外层父节点标签
         this.zoom=Utils.ce("div",{
             position:'absolute',
             width:"402px",
             height:"590px",
             left:"140px",
             top:"265px",
             marginLeft:'20px'
         });
         this.createMin(this.zoom);
         this.createMax(this.zoom);
         this.createCarousel(this.zoom);
         enwrap.appendChild(this.zoom);//
     }
     //创建放大镜主图(小)
     createMin(parent){
         this.min=Utils.ce("div",{
             position:"absolute",
             width:this.MIN_WIDTH+"px",
             height:this.MIN_WIDTH+"px",
             backgroundImage:"url(./img/a.jpg)",
             backgroundSize:"100% 100%",
             border:"1px solid #CCCCCC"
         });
         //鼠标移入小图移动方块的创建
         this.mask=Utils.ce("div",{
             position:"absolute",
             width:this.MASK_WIDTH+"px",
             height:this.MASK_WIDTH+"px",
             display:"none",
             backgroundColor:"rgba(180,160,0,0.3)"
         })
         this.min.appendChild(this.mask); 
         parent.appendChild(this.min);
        //  console.log(this.min);
         this.min.addEventListener("mouseenter",this.mouseHandler.bind(this));
     }
 
     //放大镜大图的创建
     createMax(parent){
         this.max=Utils.ce("div",{
             position:"absolute",
             width:this.MAX_WIDTH+"px",
             height:this.MAX_WIDTH+"px",
             backgroundImage:"url(./img/a.jpg)",
             border:"1px solid #CCCCCC",
             display:"none",
             left:this.MIN_WIDTH+1+"px"
         });
         parent.appendChild(this.max);
     }
     
     //放大镜底层标签的创建
     createCarousel(parent){
         //底层最外轮廓
         let div=Utils.ce("div",{
             position:"absolute",
             width:this.MIN_WIDTH+2+"px",
             height:"58px",
             top:this.MIN_WIDTH+2+"px",
             marginTop:"40px"
         })
         //左按钮<背景图实现>
         let left=Utils.ce("div",{
             width:"22px",
             height:"32px",
             top:"13px",
             backgroundImage:"url(./img/sprite.png)",
             backgroundPositionX:"0px",
             backgroundPositionY:"-54px",
             position:"absolute",
         });
         //右按钮克隆
         let right=left.cloneNode(false);
         left.style.left="0px";//先复制以后再加样式
         //对象的复制<对象的浅拷贝>
         Object.assign(right.style,{
             right:"-15px",
             backgroundPositionX:"-78px",
             backgroundPositionY:"0px",
         })
         this.bnList.push(left);//存在数组再点击事件中使用
         this.bnList.push(right);
         div.appendChild(left);
         div.appendChild(right);
         let con=Utils.ce("div",{//底层小图片显示位置的标签创建
             position:"absolute",
             width:"360px",
             height:"58px",
             left:"36px",
             overflow:"hidden",
         })
         div.appendChild(con);
         this.createImageCon(con);
         parent.appendChild(div);
         div.addEventListener("click",this.clickHandler.bind(this));//给整个父元素div委托点击事件
     }
 
     createImageCon(parent){//放置底层小图片标签的创建
         let width=this.iconList.length*this.IMAGE_WIDTH+(this.iconList.length-1)*this.IMAGE_MARGIN*2;
         this.imgCon=Utils.ce("div",{
             position:"absolute",
             width:width+"px",
             height:"58px",
             left:0,
             transition: "all 0.5s"
         });
         //底层小图图片标签的创建和位置设置
         for(var i=0;i<this.iconList.length;i++){
             let img=Utils.ce("img",{
                 width:this.IMAGE_WIDTH-6+"px",
                 height:this.IMAGE_WIDTH-6+"px",
                 border:`2px solid rgba(255,0,0,${i==0 ? 1 : 0})`,
                 marginLeft:`${i===0 ? '0px' : this.IMAGE_MARGIN+"px"}`,
                 marginRight: this.IMAGE_MARGIN+"px"
             });
             img.src=this.iconList[i];
             if(i===0) this.preImg=img;
             this.imgCon.appendChild(img);
         }
         this.imgCon.addEventListener("mouseover",this.iconMouseHandler.bind(this));
         parent.appendChild(this.imgCon);
     }
 
     iconMouseHandler(e){
         if(e.target.nodeName!=="IMG") return;
         if(this.preImg){
             this.preImg.style.border="2px solid rgba(255,0,0,0)";
         }
         this.preImg=e.target;
         this.preImg.style.border="2px solid rgba(255,0,0,1)"
     //    console.log( e.target.src.replace(/_icon/,""));
         this.min.style.backgroundImage=this.max.style.backgroundImage=`url(${e.target.src.replace(/_icon/,"")})`;
     }
 
     mouseHandler(e){//鼠标事件 
         
         if(e.type==="mouseenter"){//鼠标事件为移入执行
             this.mask.style.display=this.max.style.display="block" //鼠标移入小方块显示
             this.min.addEventListener("mouseleave",this.mouseHandler.bind(this));//鼠标移入监听鼠标移动和移出事件
             this.min.addEventListener("mousemove",this.mouseHandler.bind(this));
         }else if(e.type==="mousemove"){//鼠标移入移动时执行
             // 获取min块的相对视口位置，矩形
             this.move(e.clientX,e.clientY);//鼠标移入运动时执行函数并且将参数带入
             
         }else if(e.type==="mouseleave"){//鼠标移出时执行
             this.mask.style.display=this.max.style.display="none"//鼠标移出隐藏
            //  this.min.removeEventListener("mouseleave",this.mouseHandler.bind(this));
            //  this.min.removeEventListener("mousemove",this.mouseHandler.bind(this));
         }
     }
 
 
     move(mouseX,mouseY){//参数时鼠标相对于浏览器窗口的位置
         let rect=this.min.getBoundingClientRect();//方法返回元素的的大小相对于视口的位置
             this.x=mouseX-this.MASK_WIDTH/2-rect.x;//获取此时鼠标相对于浏览器窗口的位置x-小方块的宽度/2-主图<小>相对于视口的位置
             this.y=mouseY-this.MASK_WIDTH/2-rect.y;//鼠标位置会保持在小方块中间
             if(this.x<0) this.x=0;//不能超出左上边框<小方块宽度的1/2>
             if(this.y<0) this.y=0;
             if(this.x>this.MIN_WIDTH-this.MASK_WIDTH) this.x=this.MIN_WIDTH-this.MASK_WIDTH;//不能超出右下边框<小方块宽度的1/2>
             if(this.y>this.MIN_WIDTH-this.MASK_WIDTH) this.y=this.MIN_WIDTH-this.MASK_WIDTH;
             this.mask.style.left=this.x+"px";//小方块跟随鼠标位置,鼠标位置保持中间
             this.mask.style.top=this.y+"px";
             this.max.style.backgroundPositionX=-this.x*(this.MAX_WIDTH/this.MASK_WIDTH)+"px";//放大图背景图坐标随着鼠标方块移动位置随着改变
             this.max.style.backgroundPositionY=-this.y*(this.MAX_WIDTH/this.MASK_WIDTH)+"px";//方块移动距离<方块距离小图边框的距离>*大图宽度与方块宽度的比例=大图底背景需要挪动的距离
     }
 
 
     clickHandler(e){
         let index=this.bnList.indexOf(e.target)
        //  console.log(index);//判断点击的是左还是右按钮//还是div中的其他<其他点击返回-1>
         if(index<0) return //点击其他元素是不执行
         if(index===0){//点击左按钮left为0
            this.imgCon.style.left="0px";
         }else{
             this.imgCon.style.left="-295px";//点击有按钮left为-295px
         }
     }
 
 
     $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }
 }
 
 new Utils;