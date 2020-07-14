
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'scb-rxdjs'
})

const db = cloud.database()


const _ = db.command

exports.main = async (event, context) => {
  console.log(event)
  console.log(context)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()

  let result= await db.collection('player').where({
    room:event.room
  }).get()

  let created=false

  if (result.data.length>0) created=true

  if (created==false) {
    let res1=await db.collection('player').add({
      data:{
        id:wxContext.OPENID,
        name:event.name,
        avatar:event.avatar,
        score:[0],
        room:event.room,
        owner:true
      }
    })

    

    return{
      full:false,
      id: [wxContext.OPENID],
      name:[event.name],
      avatar:[event.avatar],
      score:[[0]],
      owner:true,

    }
  }

  else {
    let idlist=[]
    let namelist=[]
    let avatarlist=[]
    let scorelist=[]
    let scorerow=[]
    let scoretemp=[]
    let res3=await db.collection('player').where({
      room:event.room
    }).get()

    if (res3.data.length>5){
      return {
        full:true
      }
    }
    else {
      
    for (i=0;i<res3.data.length;i++){
      namelist.push(res3.data[i].name)
      idlist.push(res3.data[i].id)
      avatarlist.push(res3.data[i].avatar)
      
    }

    for (j=0;j<res3.data[0].score.length;j++){
      for (i=0;i<res3.data.length;i++){
      scorerow.push(res3.data[i].score[j])
      
      }
      scoretemp.push(0)
      scorelist.push(scorerow)
      scorelist.push(0)
      scorerow=[]
    }

      idlist.push(wxContext.OPENID)
      namelist.push(event.name)
      avatarlist.push(event.avatar)
      let res4=await db.collection('player').add({
        data:{
          id:wxContext.OPENID,
          name:event.name,
          avatar:event.avatar,
          score:scoretemp,
          room:event.room,
          owner:false
        }
      })
      
      return{
        full:false,
        id: idlist,
        name:namelist,
        avatar:avatarlist,
        score:scorelist
      }
    }
    
    
  }
}

