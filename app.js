const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
// const Item = require('./models/items');
// const jwtBlock = require('./management/jwt');


const app = express();
const cors = require('cors');

const path = require('path');

require('dotenv/config');
const url = process.env.URL;

//Middlewares
app.use(morgan('tiny'));
//manipulate json
app.use(express.json());
//make sure backend and frontend connect without any
app.use(cors());
app.options('*', cors());
//https://expressjs.com/zh-cn/starter/static-files.html
app.use('/public', express.static(path.join('public')));
//use jwtBlock
// app.use(jwtBlock());

const itemRouter = require('./routers/itemRoutes');
app.use(url + '/items', itemRouter);
const categoryRouter = require('./routers/categoryRoutes');
app.use(url + '/categories', categoryRouter);
const userRouter = require('./routers/usersRoutes');
app.use(url + '/users', userRouter);
const cartRouter = require('./routers/cartRoutes');
app.use(url + '/cart', cartRouter);

//1st route
// app.get(url, (req, res) => {
//   const item = req.body;
//     res.send(item);
// });

// app.post(url, async (req,res) => {
//   let item = new Item({
//     name:req.body.name,
//     description:req.body.description,
//     price:req.body.price,
//     image:req.body.image
//   })
//   item = await item.save()
//   .then(() => {
//     res.status(201).send("Item created successfully!")
//   })
//   .catch((err) => {
//     res.status(500).json({
//       error:err,
//       message:"Impossible to create produce : /"
//     })
//   })
// });

  //return a promise
mongoose.connect(process.env.CONNECTION_STRING,
  {
    useNewUrlParser:true,
    useUnifiedTopology:true
  }
  )
.then(() => {
  console.log("Connection to database successful");
})
.catch((err) => {
  console.log("Connection to database failed Error :" + err);
})
app.listen(3000, function() {
    console.log("Server is running on port " + 3000);
});