const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const app = getApp();

Page({
  data: {
    userInfo: {},
    tmpuserInfo: {},
    showLoginDialog: false,
    canIUseGetUserProfile: false,
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(app.globalData.userInfo);
   // console.log(JSON.stringify(options));
  
  },
  onReady: function() {
   
  },
  onShow: function() {
  
    this.setData({
      userInfo:  app.globalData.userInfo ,
      tmpuserInfo: {"nickname":"点击登录","avatar":"http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png"},
    });

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },
 
  onWechatLogin(detail,goto) {
  //  console.log(this.data.code)
    if (detail.errMsg !== 'getUserProfile:ok') {
      if (detail.errMsg === 'getUserProfile:fail auth deny') {
        return false
      }
      wx.showToast({
        title: '微信登录失败',
      })
      return false
    }
    
    util.request(api.AuthLoginByWeixin, {
        code: this.data.code,
        userInfo: detail
      }, 'POST').then(res => {
      if (res.errno !== 0) {
        wx.showToast({
          title: '微信登录失败',
        })
        return false;
      }
     // 设置用户信息
     //console.log(JSON.stringify(detail));
      this.setData({
        userInfo: detail.userInfo,
        showLoginDialog: false
      });
      app.globalData.userInfo = detail.userInfo;
      app.globalData.token = res.data.token;
      wx.setStorageSync('userInfo', JSON.stringify(detail.userInfo));
      wx.setStorageSync('token', res.data.token);
      if(goto=='orderclick'){
        wx.navigateTo({
          url: '../order/order'
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  // onUserInfoClick: function() {
  //   if (wx.getStorageSync('token')) {

  //   } else {
  //     this.showLoginDialog();
  //   }
  // },

  onUserInfoClick: function(goto) {
    wx.login({
      success:(res) => {
        this.setData({
          code : res.code
        })
      },
     });
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        //console.log(JSON.stringify(res));
        this.onWechatLogin(res,goto);
      }
  })
  },
  onUserInfoOut () {
    this.setData({
      userInfo: '',
      showLoginDialog: false
    });
  },
  showLoginDialog () {
    this.setData({
      showLoginDialog: true
    })
  },
  onCloseLoginDialog () {
    this.setData({
      showLoginDialog: false
    })
  },

  onDialogBody () {
    // 阻止冒泡
  },
  userOrderClick (e) {
    var goto = e.currentTarget.dataset.id;
      if(wx.getStorageSync('token')){
        wx.navigateTo({
          url: '../order/order'
        })}else{
          this.onUserInfoClick(goto);
           
      }
  },
  onOrderInfoClick: function(event) {
    wx.navigateTo({
      url: '/pages/ucenter/order/order',
    })
  },

  onSectionItemClick: function(event) {

  },

  // TODO 移到个人信息页面
  exitLogin: function() {
    let that = this;
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
 //         console.log(JSON.stringify(that.data.tmpuserInfo));
          that.data.userInfo = that.data.tmpuserInfo;
          app.globalData.userInfo= that.data.tmpuserInfo;
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  }
})