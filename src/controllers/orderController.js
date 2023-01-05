const orderModel = require("../model/orderModel")
const cartModel = require("../model/cartModel")
const userModel = require("../model/userModel")
const mongoose = require('mongoose')

const { isItEmpty, isValidRequestBody, isValidStatus } = require("../validator/validation")

const createOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let data = req.body;
        let { status, cancellable } = data;

        if (!isItEmpty(userId)) {
            return res.status(400).send({ status: false, message: "User ID is missing" });
        }

        //========================= if body is empty ============================================
        if (!isValidRequestBody(data))
            return res.status(400).send({ status: false, message: "Body cannot be empty" });

        //============================ checking if the cart exist from the userid ======================  
        let findingCart = await cartModel.findOne({ userId: userId });
        if (!findingCart)
            return res.status(404).send({ status: false, message: `No cart exist for ${userId}` });
        //========================= if cart exist but cart is empty =====================================
        if (findingCart.items.length === 0)
            return res.status(400).send({ status: false, message: "Cart items are empty" });

        //============================= if status is present in body =====================================
        if (status || typeof status == "string") {
            if (!isItEmpty(status)) {
                return res.status(400).send({ status: false, message: " Please provide status" })
            }
            if (!isValidStatus(status)) //
                return res.status(400).send({ status: false, message: "Status should be 'pending', 'completed', 'cancelled'" });
            if (status == 'cancelled' || status == "completed") {
                return res.status(400).send({ status: false, message: "status cannot be cancelled or completed prior to creating an order" })
            }
        }
        //=============================== if cancelleable is present in body =========================
        if (cancellable) {
            if (!isItEmpty(cancellable))
                return res.status(400).send({ status: false, message: "cancellable should not contain blank spaces" });
            if (typeof cancellable == 'string') {
                cancellable = cancellable.toLowerCase().trim();
                if (cancellable == 'true' || cancellable == 'false') {
                    cancellable = JSON.parse(cancellable)
                } else {
                    return res.status(400).send({ status: false, message: "Please enter 'true' or 'false'" });
                }
            }
        }

        let totalQuantity = 0;
        for (let i = 0; i < findingCart.items.length; i++) {
            totalQuantity += findingCart.items[i].quantity;
        }
        let namedata = await userModel.findById(userId)
        data.customerName= namedata.fname
        
        data.userId = userId;
        data.items = findingCart.items;
        data.totalPrice = findingCart.totalPrice;
        data.totalItems = findingCart.totalItems;
        data.totalQuantity = totalQuantity;

        let result = await orderModel.create(data);
        //console.log(result)
        await cartModel.updateOne({ _id: findingCart._id }, { items: [], totalPrice: 0, totalItems: 0 });

        return res.status(201).send({ status: true, message: "Success", data: result })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const orderHistory = async function (req, res) {
    try {

        let userId = req.params.userId

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid userId" })

        let orderHistory = await orderModel.find({ userId: userId })

        if (!orderHistory) return res.status(404).send({ status: false, message: "You dont have OrderHistory" })

        res.status(200).send({ status: true, message: "Order History", data: orderHistory })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

let orderList = async function (req, res) {

    if (!mongoose.isValidObjectId(adminId)) return res.status(400).send({ status: false, message: "Invalid adminId"})

    let orderList = await orderModel.find()
    if (!orderList) return res.status(404).send({ status: false, message: "You dont have OrderHistory" })
    res.status(200).send({ status: true, message: "Order list", data: orderList })
}

module.exports = { createOrder, orderHistory, orderList}