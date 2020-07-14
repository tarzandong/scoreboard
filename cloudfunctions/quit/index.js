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

  const fateid=Math.floor(99999*Math.random())

  let res=await db.collection('player').where({
    id:wxContext.OPENID
  }).get()

  if (res.data[0].owner) {
    await db.collection('player').where({
      room:res.data[0].room
    }).remove()
  }
  else {
    await db.collection('player').where({
      id:wxContext.OPENID
    }).update({
      data:{
        id:fateid,
        avatar:'cloud://scb-rxdjs.7363-scb-rxdjs-1302185290/user-unlogin.png'
      }
    })
  }
  

  
}