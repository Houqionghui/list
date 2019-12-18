let inProductData = [] //全部的数据
let product = [] //要渲染的数据
let listQuerys = {
  currPagea: 1,
  pageSizea: 10
}

let scroll = document.querySelector('.list'); //ul
let outerScroller= document.querySelector('.content'); //包裹ul的盒子
let slided=document.querySelector('.slided'); //释放更新
let sliding=document.querySelector('.sliding'); //加载中
let refreshs = false;
let touchStart = 0; //记录当手指触摸屏幕时候的位置
// let touchDis = 0;

/*手指触摸屏幕的时候*/
outerScroller.addEventListener('touchstart', function (event) {
  let touch = event.targetTouches[0];
  // 把元素放在手指所在的位置
  touchStart = touch.pageY;
  // event.preventDefault();
  // event.stopPropagation()
}, false);

/*手指在屏幕上滑动的时候触发*/
outerScroller.addEventListener('touchmove', function (event) {
  slided.style.display='none';
  let touch = event.targetTouches[0];
  if(outerScroller.scrollTop<=0){
   scroll.style.top = scroll.offsetTop + touch.pageY - touchStart + 'px';
   touchStart = touch.pageY;

   if(scroll.offsetTop>=100) {
    sliding.style.display='block';
    refreshs = true;
  }
  }
}, false);

/*手指从屏幕上移开时触发*/
outerScroller.addEventListener('touchend', function (event) {
  if(scroll.offsetTop>=50){
    console.log(scroll.offsetTop);

    let time = setInterval(function(){
      scroll.style.top = scroll.offsetTop -3 +'px';
      if(scroll.offsetTop<=0){
        clearInterval(time);
        // text.innerHTML = "下拉刷新....";
        // text.innerHTML=''
        sliding.style.display='none';
        slided.style.display='block';

        setTimeout(function(){
          slided.style.display='none';
          getAll();
          if(refreshs){
           getAll(); //请求数据
          }
          },3000);


      }
    })
  }

}, false);

function bindHTMLS() {
  let oUl = document.createElement('div');
  let str = '';
  let data = product;
  for (let i = 0; i < data.length; i++) {
    //  console.log(data[i].news_title);
    str += `
            <li class="clearfix">
            <div class="single-mode">
                <div class="single-mode-rbox clearfix ">
                    <div class="title-box" id="titleBox" onclick="showBox()">
                      <p>${data[i].news_title}</p>
                     
                    </div>
                    <div class="bui-boxaa clearfix">
                        <div class="bui-left ">
                            <a href="" class="source">${data[i].news_source}</a>
                            <span class="footer-bar-action">&nbsp;${data[i].news_pubdate}</span>
                        </div>
                    </div>
                </div>
                  <div class="bui-left imgdata clearfix">
                    <img src="${data[i].news_imges}" alt="">
                </div>
                </div>
                <div class="abstract top" style="display: none;" id="abstract">
                <div class="abstract-title">文章摘要</div>
                <p class="abstract-text">
                    文章摘要文章摘要文章摘要文章摘要文章,摘要文章摘要文章摘要文章摘要文章摘要,文章摘要文章摘要摘要文章摘要摘要文章,文章摘要文章摘要摘要文章摘要摘要文章摘要摘要文章摘要文章摘要摘要文章摘要摘要文章
                </p>
                <div class="read"><a href="">阅读全文</a></div>
       </div>
        </li>
        <div class="bg_color" onclick="deleteLogin()" id="bg_filter" style="display: none;"></div>
          `

  }
  oUl.innerHTML += str;

  scroll.insertBefore(oUl, scroll.firstChild);
  console.log(scroll.insertBefore(oUl, scroll.firstChild));
}

function queryDataw() { //currPagea 页码     pageSizea 条数
  //数据处理
  product = inProductData.slice((listQuerys.currPagea - 1) * listQuerys.pageSizea, listQuerys.currPagea * listQuerys.pageSizea)
  listQuerys.currPagea++;
  // 更新视图
  bindHTMLS();
  console.log(product)
  console.log(listQuerys.currPagea);
}

function getAll() {
  let xhr = new XMLHttpRequest();

  // TODO  添加下拉刷新功能
  xhr.open('get', './json/data.json', false);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      inProductData = JSON.parse(xhr.responseText).RECORDS;
      // 初始化列表数据  并渲染视图
      queryDataw();

    }
  }
  xhr.send(null);

}

