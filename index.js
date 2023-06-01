import express from "express";
import cors from "cors";
import mongoose from "mongoose";


const app = express();
app.use(express.json());
app.use(express.urlencoded())
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/LoginRegisterAppDB' ,{

useNewUrlParser:true,
useUnifiedTopology:true
}, () =>{
    console.log('DB connected succesfully')
}

);


app.listen(5000 , () =>{
    console.log("server is running suceesfully ")
})

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const User = new mongoose.model("user" , userSchema);

app.post( "/register",  (req,resp) => {
    // console.log(req.body)
     const {name , email , password} = req.body ;
     User.findOne({email:email} , ( err , user) => {
          if (user) {
             resp.send({message:"user already registered"})
          } else {
             const user = new User(
                {
                    name,
                    email,
                    password
                }
             )
             user.save( err => {
                if (err) {
                    resp.send(err)
                } else {
                    resp.send({message: "Succesfully Registered , Login Now"})   
                }
             })
          }
     })

})
app.post( "/login",  (req,resp) => {
    const {email , password} = req.body ;
    User.findOne({email:email}, (err , user) => {
         if (user) {
             if (password === user.password) {
                 resp.send({message:"user succesfull login" , user : user})
                
             } else {
                resp.send({message:"the passsword is incorrect"});
             }
         } else {
             resp.send({message:"user is not registered"})
         }
    })
    

})

