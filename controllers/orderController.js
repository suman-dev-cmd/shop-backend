const Order = require('../model/order');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const product = require('../model/product');

exports.newOrder = catchAsyncErrors(async (req, res,next) => {
    const {shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice} = req.body;
    const oder = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    });
    res.status(201).json({
        success:true,
        oder 
    })
});

exports.getSingleOrder = catchAsyncErrors(async (req, res,next) => {
    const order = await Order.findById(req.params.id).populate('user','name email');
    if(!order){
        return next(new ErrorHandler('Order Not Found',400))
    }
    res.status(200).json({
        success:true,
         order
    })
});

exports.myOrders = catchAsyncErrors(async (req, res,next) => {
    const orders = await Order.find({user:req.user.id});
   
    res.status(200).json({
        success:true,
        orders
    })
});

exports.allOrders = catchAsyncErrors(async (req, res,next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
});

exports.updateOrder = catchAsyncErrors(async (req, res,next) => {
    const order = await Order.findById(req.params.id);
    if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler('You Have already delivered this order',400));
    }
    order.orderItems.forEach(async item=>{
        await updateStock(item.product,item.quantity)
    })
    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now()
    await order.save()
    res.status(200).json({
        success:true,
        message:'order update'
    })
});

async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({validateBeforeSave:false})
}

exports.deleteOrder = catchAsyncErrors(async (req, res,next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler('Order Not Found',400))
    }
    await order.remove()
    res.status(200).json({
        success:true,
        message:'order delete'
    })
});