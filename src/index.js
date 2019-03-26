const express = require('express')
const app = express()
const multer = require('multer')
const upload = multer({
  dest: 'uploads/'
})

/**
 * 处理单个文件上传
 * avatar:上传表单中对应的文件名称
 */
app.post('/profile', upload.single('avatar'), (req, res, next) => {
  res.send(req.file)
})

/**
 * 处理多个文件上传
 * 指定最多上传3个
 */

app.post('/photos/upload', upload.array('photos', 3), (req, res, next) => {
  res.send(req.files)
})

app.listen(3000, () => {
  global.console.log('localhost:3000')
})