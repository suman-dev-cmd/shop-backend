const Product = require('../model/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
exports.getProductall= catchAsyncErrors(async (req,res,next)=>{
    const resPerPage = 4 ;
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
    req.body.user = req.user.id;
    console.log(req.body)
    let product = new Product(
        {
            name: req.body.name,
            price: req.body.price,
            description:req.body.description,
            rating:req.body.rating,
            images:req.body.images,
            category:req.body.category,
            seller:req.body.seller,
            stock:req.body.stock,
            numofReviews:req.body.numofReviews,
            user:req.user.id
        }
    );
    await product.save()

    // const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
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
    let updatePro = await Product.findById(req.params.id);
    if(!updatePro){
        return next(new ErrorHandler('Product Not Found',404));
    }
    updatePro = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        updatePro
    })
})

exports.deleteProduct = catchAsyncErrors(async(req,res,next) =>{
    const deletePro = await Product.findById(req.params.id);
    if(!deletePro){
        return next(new ErrorHandler('Product Not Found',404));
    }
    await deletePro.remove();

    res.status(200).json({
        success:true,
        message:'Product is deleted'
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
    const product = await Product.findById(productId)
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
    await product.save({validateBeforeSave:false})
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