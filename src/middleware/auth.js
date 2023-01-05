const jwt = require('jsonwebtoken')
const userModel = require("../model/userModel")
const adminModel = require("../model/adminModel")
const mongoose = require('mongoose')


const authentication = function (req, res, next) {
    try {
        let bearerHeader = req.headers.authorization;
        if (typeof bearerHeader == "undefined") {
            return res.status(401).send({ status: false, message: "Token is missing! please enter token." });
        }
        let bearerToken = bearerHeader.split(' '); // converting it to array 
        let token = bearerToken[1];
        jwt.verify(token, "secret JWT code for E-commerce", function (error, data) {
            if (error && error.message == "jwt expired") {
                return res.status(401).send({ status: false, message: "Session expired! Please login again." })
            }
            if (error) {
                return res.status(401).send({ status: false, message: "Incorrect token" })
            }
            else {
                req.decodedUserToken = data.userId;
                req.decodedAdminToken = data.adminId;
                next()
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}


let userAuthorization = async function (req, res, next) {
    try {
        let userId = req.params.userId

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: " userId is not a valid ObjectId" })
        }
        let userDetails = await userModel.findOne({ _id: userId })
        if (!userDetails) {
            return res.status(404).send({ status: false, msg: "userId not found Auth error" })
        }
        if (req.decodedUserToken != userDetails._id) {
            return res.status(403).send({ status: false, msg: "you are not authorized user" })
        }

        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error })
    }
}

let adminAuthorization = async function (req, res, next) {
    try {
    
        let adminId = req.params.adminId
 
            if (!mongoose.isValidObjectId(adminId)) {
                return res.status(400).send({ status: false, msg: " adminId is not a valid ObjectId" })
            }
            let adminDetails = await adminModel.findOne({ _id: userId })
            if (!adminDetails) {
                return res.status(404).send({ status: false, msg: "adminId not found Auth error" })
            }
            if (req.decodedAdminToken != adminDetails._id) {
                return res.status(403).send({ status: false, msg: "you are not authorized Admin" })
            }
        
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error })
    }
}

module.exports = { authentication, adminAuthorization, userAuthorization }