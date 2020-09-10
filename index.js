const express = require('express')
const app = express()
const port = 5000
//use key_20200903
const config = require ('./config/key');

//use cookie parser
const cookieParser = require ('cookie-parser');

//use post
const bodyParser = require('body-parser');
const { User } = require("./models/Users");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());


//use key_20200903
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))


// const mongoose = require('mongoose')
// mongoose.connect('mongodb+srv://birdkim:tmax2020@boilerplate.z2irs.mongodb.net/<dbname>?retryWrites=true&w=majority', {
//     useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
// }).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))



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


// login 기능 추가
app.post('/login', (req, res) => {
  //요청된 이메일 데이터베이스에서 찾기
  User.findOne({email: req.body.email}, (err, userInfo) => {
    if(!userInfo){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    //이메일이 잊다면 비번까지 확인
    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch){
        return res.json({
          loginSuccess: false, 
          message: "비밀번호가 틀렸습니다."
        })
      }  
      //비밀번호 맞으면 토큰 확인
      userInfo.generateToken((err, userInfo) => {
        if(err){
          return res.status(400).send(err);
        }
        //토큰을 저장한다 어디에?, 쿠키 또는 로컬스토리지 
        //쿠키에 함
        res.cookie("x_auth", userInfo.token).status(200).json({loginSuccess: true, userId: userInfo._id})
      })
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

