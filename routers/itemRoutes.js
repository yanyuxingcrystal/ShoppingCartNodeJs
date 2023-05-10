const Item = require('../models/items');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const uploads = require('../management/multer');

router.get('/', async (req, res) => {
    // const items = await Item.find();
    const items = await Item.find().populate('category');
    if(!items){
        res.status(400).send("No items found");
    }
      res.send(items);
  });

//old create without image
  
//create with image
router.post('/', uploads.single('image'), async (req,res) => {

    //check if the id is exist
    let category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).send("Unkown category ID");
    }

    //shortcut: option +command + >/< inside outside method
    let file = req.file;
    if(!file){
        return res.status(400).send("Image required!");
    }
    let fileName = file.filename;
    // let filePath = file.path;
    console.log("fileName:"  +file.filename +" + FilePath:"+ file.path);
    let path = `${req.protocol}://${req.get('host')}/public/images`;

    let item = new Item({
      name:req.body.name,
      description:req.body.description,
      price:req.body.price,
      image:`${path}/${fileName}`,
      category:req.body.category
    })
    item = await item.save()
    .then(() => {
      res.status(201).send("Item created successfully!")
    })
    .catch((err) => {
      res.status(500).json({
        error:err,
        message:"Impossible to create produce : /"
      })
    })
  });

//get item by id
router.get('/:id' , async (req, res) => {
    const item = await Item.findById(req.params.id).populate('category');

    if(!item){
        return res.status(400).send("No Item found");
    }
    res.status(200).send(item);
});

  //update method
router.put('/:id', uploads.single('image'), async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Id');
    }

    let category = await Category.findById(req.body.category);

    if(!category){
        return res.status(400).send('Invalid Category Id');
    }

    let item =  await Item.findById(req.params.id);

    if(!item){
        return res.status(400).send('Invalid Product id');
    }

    const file = req.file;
    let image;
    let fileName;
    let path;
    if(file){
        console.log("file:"  + file);
        fileName = file.filename;
        path = `${req.protocol}://${req.get('host')}/public/images`;
        image = `${path}/${fileName}`;
    }else{
        console.log("none file find:" );
        image = item.image;
        console.log("image path:"  + image);
    }

    let modifiedItem = await Item.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image: image,
        category:req.body.category
    },
    {new:true})
    if(!modifiedItem){
        return res.status(500).send('The item cannot be updated');
    }
    res.send(modifiedItem);
    
});

//delete method
router.delete('/:id', async (req, res) => {
    Item.findByIdAndRemove(req.params.id)
    .then((item) => {
        if(item){
            return res.status(200).send('Item deleted successfully');
        } else {
            return res.status(400).send("item id invalid");
        }
    })
    .catch((err) => {
        return res.status(500).json({
            success:false,
            error:err
        })
    })
});


module.exports = router;
