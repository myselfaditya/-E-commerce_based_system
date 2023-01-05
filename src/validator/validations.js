const isValidMail = (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/);

const isValidName = (/^[a-zA-Z. ]{1,20}$/)

const isItEmpty = (value) => {
    if (typeof value === "undefined" || value === " " || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}
const validString = (value) => {
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const isValidfild = (value) => {
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

let isValidNumber = (String) => {
    return /\d/.test(String)  
}

let urlreg = /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i

const isValidDigit=function(value) {
    return /^\d+$/.test(value)
} 

const isValidPrice=function(value){
    let pricePattern=/^[0-9.]{1,15}$/;
    if(!(pricePattern.test(value))) return false
    return true
}

const isValidRequestBody = (value) => {
    return Object.keys(value).length > 0
}

const isValidMobile = /^[6-9]{1}[0-9]{9}$/;

const validPin = /^[1-9][0-9]{5}$/;

const validSizes = function (value) {
    if (typeof value !== "string") { return false }
    else {
        let sizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
        for (let i = 0; i < sizes.length; i++) {
            if (sizes[i] == value.trim()) { return true }
        }
        return false
    }
}

const isValidPassword = function (value) {
    if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(value)) return true;
    return false;
};

let isValidStatus = (status) => {
    return ['pending', 'completed', 'cancelled'].includes(status);
}

let imgUrl = /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i

//const regExLogoLink =  /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/

module.exports = {
    isValidMail, isItEmpty, isValidStatus, isValidName, isValidRequestBody,isValidMobile, isValidfild, urlreg, isValidPrice, validSizes, isValidNumber, isValidPassword, imgUrl, validPin, isValidDigit, validString
}