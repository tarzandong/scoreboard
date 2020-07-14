//index.js
const app = getApp()
let roomNum=-1


Page({
  data: {
    loged:false,
    promt: '点击加入',
    avatar:['./user-unlogin1.png'],
    name:[],
    scoretable: [],
    id:[],
    owner:false,
    scrolvalue:0,
    input:[],
    pos:0,
    noting:false,
    keyheight:0,
    keyboard:true, //解决微信小程序键盘拉起页面上推不能控制的bug
    inroom:[],
    quit:false,

  },

  

  onLoad: function(res) {
    
    wx.onKeyboardHeightChange((result) => {
      let that=this;
      
      that.setData({
        keyheight:result.height
      })
      that.reflash()

      if (this.data.keyboard) {
        
        setTimeout(function(){
          that.setData({
          keyboard:false
          })
        },1000)
      }
      
    })
    
    //获取roomNum
    if (res.room) {
      roomNum=parseInt(res.room)
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']){
          this.setData({
            loged:true
          })
        wx.cloud.callFunction({
          name:'checknewplayer',
          
        
          success: res1=>{
            if (res1.result.reload) {
              // roomNum=res1.result.room
              // this.setData({
              //   avatar:res1.result.avatar,
              //   name:res1.result.name,
                
              //   promt:'',
              //   scoretable:res1.result.score,
              //   owner:res1.result.owner,
              //   scrolvalue:50000,
              //   loged:true,
              //   pos:res1.result.pos
              // })
              // this.reflash()
              if (roomNum!==res1.result.room){
                let that=this
                wx.showModal({
                  cancelText: '留在原房',
                 
                  confirmText: '进入新房',
                  fail: (result) => {                   
                    
                  },
                  showCancel: true,
                  success: (result) => {
                    if (result.cancel){
                      roomNum=res1.result.room
                      that.userreload()
                    }
                    if (result.confirm){
                      console.log(roomNum)
                    wx.cloud.callFunction({
                      name:'quit',
                      success:res=>{
                        console.log("退出后"+roomNum)
                        

                        if (roomNum<0)  
                        {
                          roomNum=Math.floor(Math.random()*100000)
                          
                        }
                        that.userlogin()
                      }
                    })
                    }
                    
                  },
                  title: '由于您原来在另一个房间未退出，您现在想：',
                })
                
              }

              else this.userreload()
            }
            else {
              if (roomNum<0)  
                  {
                    roomNum=Math.floor(Math.random()*100000)
                          
                  }
              this.userlogin()
            // wx.getUserInfo({
            //   success: res => {
            //     //console.log (res.userInfo)
            //     wx.cloud.callFunction({
            //       name:'login',
            //       data:{
            //         room:roomNum,
            //         create:newroom,
            //         name:res.userInfo.nickName,
            //         avatar:res.userInfo.avatarUrl,
            //       },
            //       success:res2=>{
            //         if (res2.result.full) {
            //           wx.showToast({
            //             title: '满了！',
            //             duration: 2000
            //           })
                      
            //         }
            //         else{
            //           this.setData({
            //           avatar:res2.result.avatar,
            //           name:res2.result.name,
            //           loged:true,
            //           promt:'',
            //           scoretable:res2.result.score,
            //           owner:res2.result.owner,
            //           scrolvalue:50000,
            //         })
            //         this.reflash()
            //         }
            //       }
            //     })
                  
            //   }
            // })
            }
            


          }


        })
        }
        
      }
    })

    
  },

  userreload:function(){
    let that = this
    wx.getUserInfo({
      success: res => {
        that.reflash()
      }
    })

  },

  userlogin:function() {
    wx.getUserInfo({
      success: res => {
        console.log (roomNum)
        wx.cloud.callFunction({
          name:'login',
          data:{
            room:roomNum,
            name:res.userInfo.nickName,
            avatar:res.userInfo.avatarUrl,
          },
          success:res2=>{
            if (res2.result.full) {
              wx.showToast({
                title: '满了！',
                duration: 2000
              })
              
            }
            else{
              this.setData({
              avatar:res2.result.avatar,
              name:res2.result.name,
              loged:true,
              promt:'',
              scoretable:res2.result.score,
              owner:res2.result.owner,
              scrolvalue:50000,
            })
            this.reflash()
            }
          }
        })
          
      }
    })
  },


  onGetUserInfo: function(e){
    console.log('getinfo')
    if (!this.data.loged && e.detail.userInfo) {
      //console.log(e.detail.userInfo.nickName)
    
      wx.cloud.callFunction({
        name:'checknewroom',
        data:{
          room:roomNum
        },
      
        success: res1=>{
          if (res1.result.reload) {
            roomNum=res1.result.room
            this.setData({
              avatar:res1.result.avatar,
              name:res1.result.name,
              loged:true,
              promt:'',
              scoretable:res1.result.score,
              owner:res1.result.owner,
              scrolvalue:50000,
              pos:res1.result.pos,
            })
            this.reflash()
          }
          else{
          let newroom=res1.result.newroom
          wx.cloud.callFunction({
            name: 'login',
            data:{
              room:roomNum,
              create:newroom,
              name:e.detail.userInfo.nickName,
              avatar:e.detail.userInfo.avatarUrl,
              
            },
            success:res2=>{
              if (res2.result.full) {
                wx.showToast({
                  title: '满了！',
                  duration: 2000
                })
                
              }
              else {
                this.setData({
                avatar:res2.result.avatar,
                name:res2.result.name,
                loged:true,
                promt:'',
                scoretable:res2.result.score,
                owner:res2.result.owner,
                scrolvalue:50000,
                })
                this.reflash()
              }
            }
          })
          }
        }
      })
    }
  },

  reflash:function(){
    console.log(roomNum)
    wx.cloud.callFunction({
      name:'checknewroom',
      data:{
        room:roomNum
      },
    
      success: res1=>{
        
          this.setData({
            avatar:res1.result.avatar,
            name:res1.result.name,
            scoretable:res1.result.score,
            id:res1.result.id,
            scrolvalue:50000,
            pos:res1.result.pos,
            owner:res1.result.owner,
            loged:true,
          })
         
          wx.setStorageSync("playerinfo",{
            avatar:res1.result.avatar,
            name:res1.result.name,
            lastscore:res1.result.score[res1.result.score.length-1],
            id:res1.result.id
          })
          //console.log(res1.result.score[res1.result.score.length-1])
          let inroom1=[]
          for (let i=0;i<this.data.avatar.length;i++){
            if (this.data.avatar[i]=='cloud://scb-rxdjs.7363-scb-rxdjs-1302185290/user-unlogin.png') {
              inroom1[i]=false
            }
            else inroom1[i]=true
          }
          this.setData({
            inroom: inroom1
          })
      }
    })
  },

  editscore:function(){
    wx.cloud.callFunction({
      name:'checknewroom',
      data:{
        room:roomNum
      },
    
      success: res1=>{
        
          this.setData({
            avatar:res1.result.avatar,
            name:res1.result.name,
            scoretable:res1.result.score,
            id:res1.result.id
          })
          wx.setStorageSync("playerinfo",{
            avatar:res1.result.avatar,
            name:res1.result.name,
            lastscore:res1.result.score[res1.result.score.length-1],
            id:res1.result.id
          })
          wx.navigateTo({
            url: 'edit',
          })
          //console.log(res1.result.score[res1.result.score.length-1])
      }
    })
    
  },

  dismiss:function(){
    wx.showModal({
      cancelText: '暂不解散',
      complete: (res) => {},
      confirmText: '解散房间',
      content:'解散房间，所有人的积分将被清零，请再次确认是否解散房间：',
      fail: (res) => {},
      showCancel: true,
      success: (result) => {
        if (result.confirm){
        wx.cloud.callFunction({
          name:'cleardata',
          data:{
            room:roomNum
          },
          success:res=>{
            this.setData({
              avatar:[],
              name:[],
              scoretable:[]
            })
            wx.navigateTo({
              url: 'quit',
            })
            
          }
        })
        }
      },
      title: '解散房间？',
    })
    

  },

  quitroom:function(){
    let tha=this
    wx.showModal({
      cancelText: '返回房间',
      complete: (res) => {},
      confirmText: '退出房间',
      content:'退出房间将不能对您的积分进行改动，请再次确认：',
      fail: (res) => {},
      showCancel: true,
      success: (result) => {
        if (result.confirm){
        wx.cloud.callFunction({
          name:'quit',
          success:res=>{
            this.setData({
              avatar:[],
              name:[],
              scoretable:[]
            })
            wx.navigateTo({
              url: 'quit',
            })
          }
        })
        }
      },
      title: '退出房间？',
    })
    
    
  },

  getinput:function(e){
    this.data.input[e.currentTarget.dataset.index]=e.detail.value
    console.log(this.data.input)
  },

  check:function(){
    let sum=0
    for (let i=0;i<this.data.input.length;i++) {
      sum+=parseInt(this.data.input[i])
    }
    if (sum==0) {
      wx.showToast({
        title: '已取平',
      })
    }
    else {
      wx.showToast({
        title: '未取平',
        icon:'none'
      })
    }

  },

 

  onShareAppMessage: function (res) {
    
    return {
      title: '记分牌',
      path: '/pages/index/index?room='+ roomNum
    }
  },

  

  onShow: function () {
    if (this.data.scoretable.length>0){
    this.reflash()
    this.setData({
      scrolvalue:50000
    })
    let that=this
    setTimeout(function(){that.reflash()},500,)
    }

  },

  onReady:function(){
    
  },

 

  notesw:function(){
    if (this.data.noting==true) {
      this.setData({
        noting:false,
        //keyheight:0,
      })
    }
    else {
      this.setData({
        noting:true,
        //keyheight:200,
      })
    }
    this.reflash()
  },

  swowner:function(e){
    wx.showModal({
      cancelText: '取消',
      complete: (res) => {},
      confirmText: '确定',
      content:'移交管理您将不再是管理者，请再次确认：',
      fail: (res) => {},
      showCancel: true,
      success: (result) => {
        if (result.confirm){
          let pos=this.data.pos
        wx.cloud.callFunction({
          name:'swowner',
          data:{
            oldid:this.data.id[pos],
            newid:this.data.id[e.currentTarget.dataset.index],
          },
          success:res=>{
            this.reflash()
          }
        })
        }
      },
      title: '移交管理？',
    })
  },

 

})
