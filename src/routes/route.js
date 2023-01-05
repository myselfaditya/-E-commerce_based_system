const express = require('express')
const router = express.Router()

const { createAdmin, adminLogin } = require("../controllers/adminController")
const { createUser, userLogin } = require("../controllers/userController")
const { authentication, adminAuthorization, userAuthorization } = require('../middleware/auth')
const { createProduct, getProductByQuery, getProductById, updateProduct, deleteProduct } = require("../controllers/productController")
const { createCart, updateCart } = require("../controllers/cartController")
const { createOrder, orderHistory, orderList} = require("../controllers/orderController")

//===========================================================Admin Api's================================================================//
router.post("/adminRegister", createAdmin)
router.post("/adminLogin", adminLogin)

//=========================================================== User Api's ===============================================================//
router.post("/userRegister", createUser)
router.post("/userLogin", userLogin)

//=========================================================== Product Api's ============================================================//
router.post("/products", authentication, adminAuthorization, createProduct)
router.get("/products", authentication, getProductByQuery)
router.get("/products/:productId", authentication, getProductById)
router.put("/products/:productId", authentication, adminAuthorization, updateProduct)
router.delete("/products/:productId", authentication, adminAuthorization, deleteProduct)

//=========================================================== Cart Api's ============================================================//
router.post("/users/:userId/cart", authentication, userAuthorization, createCart)
router.put("/users/:userId/cart", authentication, userAuthorization, updateCart)

//=========================================================== Order Api's ============================================================//
router.post("/users/:userId/orders", authentication, userAuthorization, createOrder )
router.get("/users/:userId/orders", authentication, userAuthorization, orderHistory)
router.get("/users/orders", authentication, adminAuthorization, orderList)

router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })

module.exports = router