const express = require('express')
const app = express()
const port = 5000
//use post
const bodyParser = require('body-parser');
const { User } = require("./models/Users");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://birdkim:tmax2020@boilerplate.z2irs.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//use post
app.post('/register', (req, res) => {

  const user = new User(req.body)
  user.save((err, userInfo) => {
      if(err) return res.json({ success: false, err})
      return res.status(200).json({
          success: true
      })
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

