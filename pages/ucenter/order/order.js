var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    let pages = getCurrentPages();
    var currentPage = pages[pages.length - 1] 
    if(wx.getStorageSync('token')){this.getOrderList();}
    else{
     
    wx.setStorageSync('goback',currentPage);
    wx.switchTab({
      url: '../index/index'
    })}
    
  },
  getOrderList(){
    let that = this;
    util.request(api.OrderList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          orderList: res.data.data
        });
      }
    });
  },
  payOrder(){
    wx.redirectTo({
      url: '/pages/pay/pay',
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }

})