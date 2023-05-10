const User = require('../models/users');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

//get all users
router.get('/', async (req, res) => {
    //return all user information exception PW
    const users = await User.find().select('-passworeHash');
    if(!users){
        res.status(400).send("No users found");
    }
      res.send(users);
  });

//get user by id
router.get('/:id', async (req, res) => {
    //return all user information exception PW
    const user = await User.findById(req.params.id).select('-passworeHash');
    if(!user){
        res.status(400).send("No user found");
    }
      res.send(user);
  });

//get user by email -> 之后研究一下
// router.get('/test', async (req, res, next) => {
//     //return all user information exception PW
//     // const vehicle = await User.find({ email: req.body.email }).select('-passworeHash');
//     // res.status(200).json(vehicle);
    

//     try {
  
//         const vehicle = await User.find({ email: req.body.email });
//         res.status(200).json(vehicle);
//       } catch (error) {
//         res.status(500).json({ message: error });
//       }
    
//     // if(!user){
//     //     res.status(400).send("No user found");
//     // }
//     //   res.send(user);
//     // User.findOne({email :req.body.email})
//     //   .then((docs)=>{
//     //       console.log("Result :",docs);
//     //   })
//     //   .catch((err)=>{
//     //       console.log(err);
//     //   });
//   }
// );

//register the new user and hashPW
//这里没有还没有检查email 的unique
router.post('/register', async (req, res) => {
    let user = new User({
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password),
        isAdmin: req.body.isAdmin
    })

    user = await user.save();
    
    if(!user){
        res.status(400).send("User cannot be created!");
    }

    res.send(user);
});

//update user by id
router.put('/:id', async (req,res) => {
    const userInfo = await User.findById(req.params.id);
    let newPassword;

    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.password);
    } else {
        newPassword = userInfo.passwordHash;
    }
    let user = await User.findByIdAndUpdate(req.params.id , {
        email:req.body.email,
        password: newPassword,
        isAdmin:req.body.isAdmin
    },{
        new:true
    })
    if(!user){
        return res.status(400).send("User not found");
    }
    res.send(user);
});

//login router
router.post('/login', async (req, res) => {
    const user = await User.findOne({email : req.body.email});

    if(!user) {
        return res.status(400).send("Invalid email");
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        //create token
        const token = jwt.sign({
            userId:user._id,
            isAdmin:user.isAdmin
        }, process.env.secret,
        { expiresIn:'1d'});
        return res.status(200).json({
            user:user.email,
            token:token,
            isAdmin:user.isAdmin
        })
    } else {
        return res.status(400).send("Invalid email or password!");
    }
} );

//delete user
router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    .then((user) => {
        if(user){
            return res.status(200).send(user);
        } else {
            return res.status(400).send("User not found");
        }
    })
    .catch((err) => {
        return res.status(500).json({
            success:false,
            error:err
        });
    });
});


module.exports = router;