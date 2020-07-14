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
    return {
      reload:true,
      room:res0.data[0].room,
    }
  }
  else {
    return {
      reload:false,
      room:-100,
    }
  }
}