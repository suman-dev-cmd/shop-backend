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
    deleteProductReivews,
    getAdminProducts
} = require('../controllers/productcontroller')
    
const {isAuthenticatedUser,authorizeRoles} = require('../middlewares/auth')
router.route('/product').get(getProductall)
router.route('/admin/products').get(getAdminProducts);
router.route('/product/:id').get(singleProduct)
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),productadd)
router.route('/admin/product/:id')
            .put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct)
            .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct)

router.route('/review').put(isAuthenticatedUser,createProductReview)
router.route('/reviews').get(isAuthenticatedUser,getProductReivews)
router.route('/reviews').delete(isAuthenticatedUser,deleteProductReivews)

module.exports = router