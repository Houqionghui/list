
let page = 0,
	imgData = null,
    isRun = false;

let allProductData = [] //全部的数据
let productData = [] //要渲染的数据
let listQuery = {
	currPage: 1,
	pageSize: 10
}

// function myFuncton(date_time){
//     //去掉日期数据中的T 和Z
//     //by XiaoMa
//     var date=new Date(+new Date(date_time)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
//     return date
// }

let dateDiff = function (timestamp) {

        // 补全为13位
        let arrTimestamp = (timestamp + '').split('');
        for (let start = 0; start < 13; start++) {
            if (!arrTimestamp[start]) {
                arrTimestamp[start] = '0';
            }
        }
        timestamp = arrTimestamp.join('') * 1 + 8*3600*1000;
        let minute = 1000 * 60; //  分
        let hour = minute * 60;//时
        let day = hour * 24; //天
        let halfamonth = day * 15; //周
        let month = day * 30;  //半个月
        let now = new Date().getTime();

        let diffValue = now - timestamp;

        // 如果本地时间反而小于变量时间
        if (diffValue < 0) {
            return '不久前';
        }
        // 计算差异时间的量级
        let monthC = diffValue / month;
        let weekC = diffValue / (7 * day);
        let dayC = diffValue / day;
        let hourC = diffValue / hour;
        let minC = diffValue / minute;

        // 数值补0方法
        let zero = function (value) {
            if (value < 10) {
                return '0' + value;
            }
            return value;
        };

        // 使用
        if (monthC > 4) {
            // 超过1年，直接显示年月日
            return (function () {
                let date = new Date(timestamp);
                return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
            })();
        } else if (monthC >= 1) {
            return parseInt(monthC) + "月前";
        } else if (weekC >= 1) {
            return parseInt(weekC) + "周前";
        } else if (dayC >= 1) {
            return parseInt(dayC) + "天前";
        } else if (hourC >= 1) {
            return parseInt(hourC) + "小时前";
        } else if (minC >= 1) {
            return parseInt(minC) + "分钟前";
            // console.log('');
        }

        return '刚刚';
    };

function bindHTML (){
    let oUl = document.getElementsByClassName('list')[0];
	// console.log(oUl);
	let str = '';
	let data = productData;
	for (let i = 0; i < data.length; i++) {
        //  console.log(data[i].news_title);
       let Dtime=data[i].news_pubdate;
        //去掉日期数据中的T 和Z
        var date=new Date(+new Date(Dtime)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        let newtime = date.replace(/-/g, "/");
        let timeDate = newtime;
        var Time = new Date(timeDate);
        var timestemp = Time.getTime();
        console.log(timestemp);
        
         dateDiff(timestemp);
         let timeHour=dateDiff(timestemp);
        console.log(timeHour);
                
         str += `     
    <li class="clearfix main "  >
           <div class="single-mode  ">
             <div class="single-mode-rbox clearfix" >
                     <div class="title-box " onclick="showBox(this)">
                         <p>${data[i].news_title}</p >
                     </div>
                     <div class="bui-boxaa clearfix" >
                         <div class="bui-left">
                            <a href="javascript:;" target="_blank" class="footer-bar-action source">${data[i].news_source}</a>
                             
                             <span class="footer-bar-action">${timeHour}</span>
      
                         </div>
                     </div>
                 </div>
                 <div class="bui-left single-mode-lbox clearfix">
               
                <img src="${data[i].news_img}" alt="">
      
               </div>
             </div>
            <div class="abstract top" style="display: none;" id="abstract">
                <div class="abstract-title">文章摘要</div>
                <p class="abstract-text">${data[i].news_summary_info}</p >
                <div class="read" onclick="info(this)" id="${data[i].news_id}"><a href="javascript:;" >阅读全文</a></div>
            </div> 
            
      </li> `

	}
	oUl.innerHTML += str;

}
function getImgSrc() {
    let mySrc=document.images;

for (var i = 0; i < mySrc.length; i++) {
    console.log(mySrc[i]);

console.log(mySrc[i].src);
    if(mySrc[i].src=='http://home.insight-time.com/wx/'){
        mySrc[i].remove();
    }
}
  }

// function queryData(){
//     //数据处理
//     // productData = allProductData.slice((listQuery.currPage-1) * listQuery.pageSize, listQuery.currPage * listQuery.pageSize);
//     // listQuery.currPage++;
//     $.ajax({
//              type: "POST",
//              url: "./json/data.json",
//              contentType: 'application/x-www-form-urlencoded;charset=utf-8',
//              data: {currPage:listQuery.currPage, pageSize:listQuery.pageSize},
//              dataType: "json",
//             // 　headers: {"X-CSRFToken":$.cookie("csrftoken")},
//              success: function(data){
//                  if(data['data'] != '') {
//                      productData = data['data']
//                      listQuery.currPage++;
//                      loading.style.display = 'block';
//                      // 及时更新视图
//                      bindHTML();
//                      getImgSrc();
//                      // console.log(productData)
//                  }
//                       },
//              error:function(e){
//                  // console.log(e);
//              }
//          });

// }

// queryData();


function queryData() {
    loading.style.display = 'block';
  //数据处理                             
    productData = allProductData.slice((listQuery.currPage - 1) * listQuery.pageSize, listQuery.currPage * listQuery.pageSize)
    listQuery.currPage++;

    // 及时更新视图
    bindHTML();
  
    // console.log(productData)

}
// 拿到全部数据
function getAllData() {
   let xhr = new XMLHttpRequest();
    xhr.open('get', './json/data.json', false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            
            allProductData = JSON.parse(xhr.responseText).RECORDS;
            // 初始化列表数据  并渲染视图
            queryData();
            // loading.style.display = 'block';
           
           }
    }
    xhr.send(null);
   
}
getAllData();

function load(){
    loading.style.display = 'none';
}
load();

window.onscroll = function() {
	// 文档内容实际高度（包括超出视窗的溢出部分）
	var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
	// console.log(scrollHeight)
	//滚动条滚动距离
	var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
	// console.log(scrollTop)
	//窗口可视范围高度
	var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);
	// console.log(clientHeight);

	if (clientHeight + scrollTop >= scrollHeight) {
            queryData();
        }


    if(window.pageYOffset >= 800){
        box.style.display = 'block';
    }else{
        box.style.display = 'none';
    }
    let timer = null;
    box.onclick = function(){
        let t = window.pageYOffset;
        timer = setInterval(() => {
            t-=100;
            if(t <= 0){
                t = 0;
                clearInterval(timer);
            }
            window.scrollTo(0,t);
        }, 16.7);
    }

}


function info(e){
        let news_id = e.id;
        // let openid=$.cookie("openid");
        // window.open ('http://home.insight-time.com/wx/news_detail/?news_id='+news_id + '&openid=' + openid);
        window.open ('http://home.insight-time.com/wx/news_detail/?news_id='+news_id);
}

function deleteLogin() {
   var bg_filter = document.getElementById("bg_filter"); //遮罩层
    bg_filter.style.display = "none";
    for (let i = 0; i < abstract.length; i++) {
        abstract[i].style.display='none';

    }
}

function showBox(){
    var show = document.querySelectorAll(".title-box");
    var abstract = document.querySelectorAll(".abstract");
    var bg_filter = document.getElementById("bg_filter");

        for(let i=0; i<show.length;i++){
            show[i].index = i;
            // console.log(i);
            show[i].onclick=function(){
            console.log(this.index);
            for (let i = 0; i < abstract.length; i++) {
                abstract[this.index].style.display='block';
                bg_filter.style.display='block';
            }
        }

}


}