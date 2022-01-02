var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
var fs = require('fs');
var videoshow = require('videoshow')
var _ = require('lodash')
app.use(express.json());
app.use(cors())

const images = []
const audio = []
var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if (file.fieldname === 'images') {
      images.push({ path: './public/images/' + file.originalname })
      cb(null, 'public/images')
    } else if (file.fieldname === 'audio') {
      audio.push({ path: './public/audio/' + file.originalname })
      cb(null, 'public/audio')
    }
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage }).any()
app.get('/', function (req, res) {
  return res.send('Hello Server')
})
app.post('/upload', async function (req, res) {

  upload(req, res, async function (err) {

    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
      // A Multer error occurred when uploading.
    } else if (err) {
      return res.status(500).json(err)
      // An unknown error occurred when uploading.
    }

    console.log(images, audio);
    const sortedImages = _.orderBy(images, ['path'], ['asc']); // Use Lodash to sort array by 'name'
    console.log(sortedImages, 'sortedImages');
    var videoOptions = {
      fps: 25,
      loop: 5, // seconds
      transition: true,
      transitionDuration: .5, // seconds
      videoBitrate: 1024,
      videoCodec: 'libx264',
      size: '640x?',
      audioBitrate: '128k',
      audioChannels: 2,
      format: 'mp4',
      pixelFormat: 'yuv420p'
    }

    videoshow(sortedImages, videoOptions)
      .audio('./public/audio/1.mp3')
      .audioParams('./public/audio/2.mp3')
      .save('./public/1slideshow.mp4')
      .on('start', function (command) {
        console.log('ffmpeg process started:', command)
      })
      .on('error', function (err, stdout, stderr) {
        console.error('Error:', err)
        console.error('ffmpeg stderr:', stderr)
      })
      .on('end', function (output) {
        console.error('Video created in:', output)
      })
    return res.status(200).send(req.images)

    // Everything went fine.
  })
});

app.listen(8000, function () {
  console.log('App running on port 8000');
});