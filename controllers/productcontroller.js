const Product = require('../model/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary')
exports.getProductall= catchAsyncErrors(async (req,res,next)=>{
    const resPerPage = 8 ;
    const productCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resPerPage)
    const products = await apiFeatures.query;
    setTimeout(() => {
        res.status(200).json({
            success:true,
            count:products.length,
            productCount,
            products:products

        })  
    }, 2000);
   
})

exports.productadd = catchAsyncErrors(async (req, res,next) => {
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
});

exports.singleProduct = catchAsyncErrors(async (req,res,next) =>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product Not Found',404));
    }

    res.status(200).json({
        success:true,
        product
    })
})

exports.updateProduct = catchAsyncErrors(async(req,res,next) =>{
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }



    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
})

exports.deleteProduct = catchAsyncErrors(async(req,res,next) =>{
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })
})

exports.createProductReview = catchAsyncErrors(async(req,res,next) =>{
    const {rating,comment,productId} = req.body;
    const review = {
         user: req.user._id,
         name:req.user.name,
         rating: Number(rating),
         comment
    }
    const obj = await Product.findById(productId)
    const json = JSON.stringify(obj)
    const product = JSON.parse(json);
    const isReviwed = product.reviews.find(
        r=>r.user.toString() === req.user._id.toString()
    )
    if(isReviwed){
        product.reviews.forEach(review=>{
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
        })
    }else{
        product.reviews.push(review)
        product.numofReviews = product.reviews.length
    }
    product.rating = product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length 

    const json1 = JSON.stringify(product)
    const json2 = JSON.parse(json1)

    console.log(json2)

    await Product.findByIdAndUpdate(productId,json2,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    // await obj.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
    })
})

exports.getProductReivews = catchAsyncErrors(async (req, res,next) => {
    const product = await Product.findById(req.query.id);
    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
});

exports.deleteProductReivews = catchAsyncErrors(async (req, res,next) => {
    const product = await Product.findById(req.query.productId);
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())
    const numofReviews = reviews.length
    const ratings = product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length 
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numofReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
});

exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })

})