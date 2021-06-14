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
      //  console.log(JSON.stringify(res));
        that.setData({
          orderList: res.data.data
        });
      }
    });
  },
  payOrder(options){
  //  console.log(this.data.orderList[options.target.dataset.orderIndex].order_sn);
    
    wx.redirectTo({
      url: '/pages/pay/pay?orderId='+this.data.orderList[options.target.dataset.orderIndex].order_sn+'&actualPrice='+this.data.orderList[options.target.dataset.orderIndex].actual_price,
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
  },
  deleteOrder: function(options) {
    let temorder_sn = this.data.orderList[options.target.dataset.orderIndex].order_sn;
    wx.setStorageSync('temorder_sn',temorder_sn);
    let that = this;
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '删除这个订单？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.OrderDelete,{
            ordersn: wx.getStorageSync('temorder_sn'),
          }, 'POST').then(function (res) {
     
            if (res.errno === 0) {
            //  console.log(JSON.stringify(res));
              that.setData({
                orderList: res.data.data
              });
              // wx.navigateTo({
              //   url: './order'
              // });
            }
          });
          that.getOrderList();
        }
      }
    })

  }

})