const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');

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


const noteSchema = new mongoose.Schema({
  subject: String,
  chapterNo: Number,
  chapterName: String,
  text: String,
  title: String
  
});

const Note = mongoose.model('Note', noteSchema);

app.post('/notes', async (req, res) => {
  try {
      const { subject, chapterNo, chapterName, text , title } = req.body;
      // Check if the note already exists with the same subject, chapterNo, and chapterName
      const existingNote = await Note.findOne({ subject, chapterNo, chapterName });
      if (existingNote) {
          // If the note exists, update the existing record
          existingNote.text = text;
          await existingNote.save();
          return res.status(200).json({
              success: true,
              message: 'Data updated successfully.',
          });
      } else {
          // If the note doesn't exist, create a new record
          const newNote = new Note({
              subject,
              chapterNo,
              chapterName,
              text,
              title
          });
          await newNote.save();
          return res.status(201).json({
              success: true,
              message: 'Data saved successfully.',
          });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: 'Failed to save data.',
          error: error,
      });
  }
});




app.get('/notes', async (req, res) => {
    try {
      const experiences = await Note.find();
      res.json(experiences);
    } catch (error) {
      alert(error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch.',
        error: error,
      });
    }
  });

  


  
app.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { subject, chapterNo, chapterName, text  , title} = req.body;
  
    try {
      const updatedExperience = await Note.findByIdAndUpdate(id, {
        subject : subject,
         chapterNo : chapterNo,
         chapterName : chapterName,
          text:text,
          title:title
      }, { new: true });
  
      res.json(updatedExperience);
    } catch (error) {
      console.error('Error updating experience', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  



// Delete an experience
app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await Note.findByIdAndDelete(id);
  
      res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
      console.error('Error deleting experience', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  







// code for construction sending emails form


app.post("/send-data", (req, res) => {
  
  const {  name , email , subject , message} = req.body;
  console.log(name);
  
  const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'vascularbundle43@gmail.com',
    pass: 'gxauudkzvdvhdzbg',
  },
});

const storeMailOptions = {
  from: email,
  to: "vascularbundle43@gmail.com",
  subject: `New Message from ${name} through Notes App`,
  html: `
    <center><h2 style="color: #c8a97e;">Great News! <br> <span style="color:#212529">You have received a message from ${name}</span></h2></center>
    <hr style="border: 2px solid #c8a97e;">
    <center><h3>Message</h3></center>
    <p> ${message}</p>
    <p style="margin-top:10px;">Contact: ${email}</p>
    
    
    `,
};
const userMailOptions = {
  from: "vascularbundle43@gmail.com",
  to: email,
  subject: subject,
  html: `
    <center><h2>Welcome to Usman Kashif Notes & Resources,<br><br> <center><span style="color: #c8a97e;">${name}!</span></center></h2></center>
    <p>Thank you for reaching put to us. Here is your message:</p>
    <center><h3>Message</h3></center>
    <p> ${message}</p>
    
    <p>Your email has been received and will be processed shortly. Thank you for Us!</p>
  `,
};

// Send the email to the store
transporter.sendMail(storeMailOptions, function(error, storeInfo) {
  if (error) {
    console.error(error);
    res.status(500).send("Error sending email to store");
  } else {
    console.log("Email sent to store: " + storeInfo.response);

    // Send the email to the user
    transporter.sendMail(userMailOptions, function(error, userInfo) {
      if (error) {
        console.error(error);
        res.status(500).send("Error sending email to user");
      } else {
        console.log("Email sent to user: " + userInfo.response);
        res.status(200).send("Order submitted successfully");
      }
    });
  }
});

});








app.get("/", (req,res) =>{
  res.send("Backend server has started running successfully...");
});




const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
  
