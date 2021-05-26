const express = require('express')
const router = express.Router()
const {
    getProductall,
    productadd,
    singleProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReivews,
    deleteProductReivews} = require('../controllers/productcontroller')
    
const {isAuthenticatedUser,authorizeRoles} = require('../middlewares/auth')
router.route('/product').get(getProductall)
router.route('/product/:id').get(singleProduct)
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('user'),productadd)
router.route('/admin/product/:id')
            .put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct)
            .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct)

router.route('/review').post(isAuthenticatedUser,createProductReview)
router.route('/reviews').post(isAuthenticatedUser,getProductReivews)
router.route('/reviews').delete(isAuthenticatedUser,deleteProductReivews)

module.exports = router