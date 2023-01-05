const adminModel = require("../model/adminModel")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const { uploadFile } = require("./aws")

const { isValidMail, isItEmpty, isValidName, urlreg, isValidRequestBody, isValidMobile, isValidPassword, validPin, validString } = require("../validator/validation")

const createAdmin = async function (req, res) {
    try {
        let data = req.body 

        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: "body cant't be empty Please enter some data." })

        let { fname, lname, email, phone, password, address } = data

        // isItEmpty() is validation function to make sure request data is not empty 
        if (!isItEmpty(fname)) return res.status(400).send({ status: false, message: "fname is required" })
        if (!isItEmpty(lname)) return res.status(400).send({ status: false, message: "lname is  required" })
        if (!isItEmpty(email)) return res.status(400).send({ status: false, message: "email id is required" })
        if (!isItEmpty(phone)) return res.status(400).send({ status: false, message: "phone is required" })
        if (!isItEmpty(password)) return res.status(400).send({ status: false, message: "password is required" })

        if (!isValidName.test(fname)) return res.status(406).send({
            status: false, message: "Enter a valid fname length of f-name has to be in between (3-20), use only String"})
    
        if (!isValidName.test(lname)) return res.status(406).send({
            status: false, message: "Enter a valid fname length of f-name has to be in between (3-20), use only String"})
        
        if (!isValidMail.test(email)) return res.status(406).send({
            status: false, message: "email must be in correct format for e.g. xyz@abc.com",
        })
        let uniqueEmail = await adminModel.findOne({ email: email })
        if (uniqueEmail) return res.status(400).send({ status: false, message: "email Id Already Exists." })

        if (!isValidMobile.test(phone)) return res.status(406).send({
            status: false, message: "mobile no. is not valid it must be 10 digit Number & it should be a indian mobile no.",
        })
        let uniquePhone = await adminModel.findOne({ phone: phone })
        if (uniquePhone) return res.status(400).send({ status: false, message: "phone no. Already Exists." })

        if (!isValidPassword(password)) return res.status(406).send({
            status: false, message: "passWord should be in between(8-15) & must be contain upperCase, lowerCase, specialCharecter & Number",
        })
        let newPassword = await bcrypt.hash(password, 10) //using bcrypt for password hashing
        password = newPassword

        if(typeof data.address == "string"){ address = JSON.parse(data.address)}
        data.address = address
        if (!isValidRequestBody(address)) return res.status(400).send({ status: false, message: "address cant't be empty Please enter some data." })

        if (!isItEmpty(address.street)) return res.status(400).send({ status: false, message: "please enter billing street " })
        if (!isItEmpty(address.city)) return res.status(400).send({ status: false, message: "please enter billing city" })
        if (!isItEmpty(address.pincode)) return res.status(400).send({ status: false, message: "please enter billing pincode" })
        if (!validPin.test(address.pincode)) return res.status(400).send({ status: false, message: "please enter valied billing pincode " })

        const adminData = { fname, lname, email, phone, password, address }
        let savedData = await adminModel.create(adminData)
        res.status(201).send({ status: true, message: "Success", data: savedData })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const adminLogin = async function (req, res) {
    try {
        const body = req.body
        const { email, password } = body

        if (!isItEmpty(email)) return res.status(400).send({ status: false, message: "email id is required" })
        if (!isItEmpty(password)) return res.status(400).send({ status: false, message: "password is required" })
        if (!isValidMail.test(email)) return res.status(400).send({ status: false, message: "email must be in correct format for e.g. xyz@abc.com" })

        let adminInDB = await adminModel.findOne({ email: email });
        if (!adminInDB) return res.status(401).send({ status: false, message: "email or password is not corerct" })

        const validPassword = await bcrypt.compare(password, adminInDB.password)
        if (!validPassword) {
            return res.status(400).send({ status: false, message: "wrong password" })
        }

        let token = jwt.sign(
            {
                adminId: adminInDB._id.toString(),
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // After 24 hours it will expire //Date.now() / 1000 => second *60
                iat: Math.floor(Date.now() / 1000)
            }, "secret JWT code for E-commerce"); //This secret keys ideal length should be of 32 letters

        let data = {
            userId: adminInDB._id.toString(),
            token: token
        }
        res.status(201).send({ status: true, message: "Login successfully", data: data });
    }
    catch (err) {
        console.log("catch error :", err.message)
        res.status(500).send({ status: false, message: "Error", error: err.message })
    }

}


module.exports = { createAdmin, adminLogin }