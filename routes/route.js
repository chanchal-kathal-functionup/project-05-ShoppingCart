const express = require('express');
const router = express.Router();
const {createUser,loginUser,getUser}=require('../controllers/userController')
const{ createProduct,deleteProduct}= require('../controllers/productController')

//POST /register
router.post('/register',createUser)
//POST/login
router.post('/login',loginUser)

router.get('/user/:userId/profile',getUser)



router.post('/product',createProduct)
//router.get('/products/:productId',getById)
router.delete('/products/:productId',deleteProduct)


module.exports = router;