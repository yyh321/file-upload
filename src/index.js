const express = require('express')
const fs = require('fs')
const app = express()
const multer = require('multer')
const loki = require('lokijs')

/**
 * 数据库名字为uploads/uploads.json
 */
const db = new loki('uploads/uploads.json', {
  persistenceMethod: 'fs'
})

const loadCollection = (collectionName, db) => {
  return new Promise(resolve => {
    db.loadDatabase({}, () => {
      const collection = db.getCollection(collectionName) || db.addCollection(collectionName)
      resolve(collection)
    })
  })
}

/**
 * 文件上传过滤
 */

const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('images only :)'), false)
  }
  callback(null, true)
}

const upload = multer({
  dest: 'uploads/',
  fileFilter
})

/**
 * 处理单个文件上传
 * avatar:上传表单中对应的文件名称
 */
app.post('/profile', upload.single('avatar'), async (req, res, next) => {
  const collection = await loadCollection('uploads', db)
  const result = collection.insert(req.file)
  db.saveDatabase()
  res.send(result)
})

/**
 * 处理多个文件上传
 * 指定最多上传3个
 */

app.post('/photos/upload', upload.array('photos', 3), async (req, res, next) => {
  const collection = await loadCollection('uploads', db)
  const result = collection.insert(req.files)
  db.saveDatabase()
  res.send(result)
})

/**
 * 获取上传资源
 */
app.get('/uploads/:id', async (req, res) => {
  const collection = await loadCollection('uploads', db)
  const result = collection.get(req.params.id)
  res.setHeader('Content-Type', result.mimetype)
  fs.createReadStream(result.path).pipe(res)
})

/**
 * 错误处理
 */
app.use((error, req, res, next) => {
  res.status(500).send({
    message: error.message
  })
})

app.listen(3000, () => {
  global.console.log('localhost:3000')
})