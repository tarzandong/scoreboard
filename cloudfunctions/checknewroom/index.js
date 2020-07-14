// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'scb-rxdjs'
})

const db = cloud.database()


const _ = db.command

exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  let res0=await db.collection('player').where({
    id:wxContext.OPENID
  }).get()

  if (res0.data.length>0) {
    let res1=await db.collection('player').where({
      room:res0.data[0].room
    }).get()
    let namelist=[]
    let idlist=[]
    let avatarlist=[]
    let scorelist=[]
    let scorerow=[]
    let postemp=0
    for (i=0;i<res1.data.length;i++){
      namelist.push(res1.data[i].name)
      idlist.push(res1.data[i].id)
      avatarlist.push(res1.data[i].avatar)
      if (res1.data[i].id==wxContext.OPENID) postemp=i
      
    }

    for (j=0;j<res1.data[0].score.length;j++){
      for (i=0;i<res1.data.length;i++){
      scorerow.push(res1.data[i].score[j])
      
      }
      scorelist.push(scorerow)
      scorerow=[]
    }

    
    return {
      newroom:false,
      reload:true,
      name:namelist,
      id:idlist,
      avatar:avatarlist,
      score:scorelist,
      room:res1.data[0].room,
      owner:res0.data[0].owner,
      pos:postemp,
    }
  }

  let res2=await db.collection('player').where({
    room:event.room
  }).get()

  if (res2.data.length==0) {
    return {
      newroom:true,
      reload:false
    }
  }
  else {
    
    return {
      newroom:false,
      reload:false,
    }
  }
}