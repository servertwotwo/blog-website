const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');

const multer = require('multer');
const FormData = require('form-data');

app.use(express.json());
app.use(cors());

const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Update the imageSchema to include title and text fields
const imageSchema = new mongoose.Schema({
  url: String,
  title: String,
  text: String
});
const Image = mongoose.model('Image', imageSchema);

// Define route for image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  const formData = new FormData();
  const { default: fetch } = await import('node-fetch');
  formData.append('image', req.file.buffer.toString('base64'));

  const response = await fetch('https://api.imgbb.com/1/upload?key=368cbdb895c5bed277d50d216adbfa52', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  const imageUrl = data.data.url;
  const title = req.body.title; // Extract the title from the request body
  const text = req.body.text; // Extract the text from the request body

  // Save the image URL, title, and text to the database
  const newImage = new Image({ url: imageUrl, title: title, text: text });
  await newImage.save();
  res.status(200).send('Image uploaded successfully');
});

// Define route for fetching images
app.get('/images', async (req, res) => {
  const images = await Image.find();
  res.send(images);
});

app.get("/", (req, res) => {
  res.send("Backend server for blogs images has started running successfully...");
});

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
