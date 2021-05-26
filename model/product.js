const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'please enter product name'],
    trim:true,
    maxlength:[100,'product name cannot exceeds 100 charecters']

  },
  price: {
    type: Number,
    required: [true,'please enter price'],
    maxlength:[5,'price cannot exceeds 5 charecters'],
    default:0.0

  },
  description: {
    type: String,
    required: [true,'Kindly enter the description of the product'], 
  },
  rating: {
    type: Number,
    default:0 
  },
  images:[
    {
      public_id:{
        type:String,
        required:true,
      },
      url:{
        type:String,
        required:true,
      }
    }
  ],
  category:{
    type:String,
    required:[true,'please enter category of product'],
    enum:{
      values:[
        'Electronics',
        'Cameras',
        'Laptop',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
      ],
      message:'please select correct category'
    },
    seller:{
      type:String,
      required:[true,'please enter product seller']
    },
    stock:{
      type:Number,
      required:[true,'please enter product stock'],
      maxLength:[5,'product stock cannot exceed 5 characters'],
      default:0
    },
    numofReviews:{
      type:Number,
      default:0
    },
    reviews:[
      {
        user:{
          type: mongoose.Schema.ObjectId,
          ref:'User',
          required:true
        },
        name:{
          type:String,
          required:true
        },
        rating:{
          type:Number,
          required:true
        },
        comment:{
          type:String,
          required:true
        },
      }
    ],
    user:{
      type: mongoose.Schema.ObjectId,
      ref:'User',
      required:true
    },
    createdAt:{
      type:Date,
      default:Date.now
    }
  }
});

module.exports = mongoose.model('Product', productSchema);