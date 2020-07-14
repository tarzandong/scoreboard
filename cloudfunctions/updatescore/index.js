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
  for (let i=0;i<event.id.length;i++){
    await db.collection('player').where({
      id:event.id[i]
    }).update({
      data:{
      score:_.push(event.lastscore[i])
      }
    })
  }
}