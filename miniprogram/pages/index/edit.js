// miniprogram/pages/index/edit.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ani:[],
    saving:false,
    switch1Checked:true,
    avatar:[],
    name:[],
    lastscore: [],
    id:[],
    imagepath:[['/images/+1.png','/images/-1.png'],['/images/+2.png','/images/-2.png'],['/images/+4.png','/images/-4.png'],['/images/+8.png','/images/-8.png']]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let playerinfo=wx.getStorageSync("playerinfo")
    console.log(playerinfo.avatar)
      
    let inroom1=[true,true,true,true,true,true]
    for (let i=0;i<playerinfo.avatar.length;i++){
      if (playerinfo.avatar[i]=='cloud://scb-rxdjs.7363-scb-rxdjs-1302185290/user-unlogin.png') {
        inroom1[i]=false
      }
    }

    this.setData({
      avatar:playerinfo.avatar,
      name:playerinfo.name,
      lastscore:playerinfo.lastscore,
      id:playerinfo.id,
      getscore:["+0","+0","+0","+0","+0","+0"],
      inroom:inroom1,
    })
    //console.log(this.data.lastscore)

  },

  start:function(i){
    var anitemp=['','','','','','']
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    });
    animation.opacity(0.1).scaleX(2).scaleY(2).step()
    animation.opacity(1).scaleX(1).scaleY(1).step()
    
    anitemp[i]=animation.export()
    this.setData({
      ani:anitemp
    })

  },

  plus:function(e){
    //console.log(e.currentTarget.dataset.player,e.currentTarget.dataset.point,e.currentTarget.dataset.dir)
    let pl=parseInt(e.currentTarget.dataset.player)
    let pt=Math.pow(2,parseInt(e.currentTarget.dataset.point))
    let dir=e.currentTarget.dataset.dir
    let gstemp=this.data.getscore
    let gs=parseInt(gstemp[pl])
    let gss=''
    if (dir=='+') {
      gs = gs+pt
    } else gs=gs-pt

    if (gs<0) {gss=''+gs}
    else gss='+'+gs

    gstemp[pl]=gss

    this.setData({
      getscore:gstemp
    })
    
    this.start(pl)

  },

  savescore:function(){
    if (this.data.switch1Checked) {
      let sum=0
      for (let i=0;i<this.data.getscore.length;i++) {
        sum+=parseInt(this.data.getscore[i])        
      }
      if (sum!==0) {
        wx.showToast({
          title: '计分和不为0!',
          icon:'none'
        })
        return
      }
    }
    if (this.data.saving==false){
      this.setData({
        saving:true
      })
    for (let i=0;i<this.data.lastscore.length;i++) {
      this.data.lastscore[i]=this.data.lastscore[i]+parseInt(this.data.getscore[i])
    }
    //console.log(this.data.lastscore)
    wx.cloud.callFunction({
      name:"updatescore",
      data:{
        id:this.data.id,
        lastscore:this.data.lastscore
      
      },
      success:res2=>{
        console.log(res2)
        wx.navigateBack({ changed: true });
        /*wx.reLaunch({
          url: 'index',
        })*/
      }
    })
    }
  },

  switch1Change:function(e){
    this.data.switch1Checked=e.detail.value
    console.log(e.detail.value)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})