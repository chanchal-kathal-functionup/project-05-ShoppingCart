const mongoose=require('mongoose')
//

const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}

  // /STRING VALIDATION BY REJEX
   const isValidfeild = (name) => {
    return /^[a-zA-Z]/.test(name.trim());
  };  

/* const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
} */


const isValidBody = (reqBody) => {
  return Object.keys(reqBody).length == 0;
}
 /*  
//STRING VALIDATION BY REJEX
const validatefeild = (name) => {
    return String(name).trim().match(
      /^[a-zA-Z]/);
  }; */

  const isValidString = (String) => {
    return /\d/.test(String)
  }
  
  const isValidPhone = (phone) => {
    return /^[6-9]\d{9}$/.test(phone)
  };

  //EMAIL VALIDATION BY REJEX
  const isValidEmail = (email) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.trim());
  };

  //PASSWORD VALIDATION BY REJEX
  const isValidPassword = (password) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password.trim());
  };

  //STREET VALIDATION BY REJEX
  const isValidstreet = (street) => {
    return /^[a-zA-Z0-9_.-]/.test(street);
  };

  //VALIDATION OF pincode BY REJEX
  const isValidpincode = (pincode) => {
    return /^(\d{4}|\d{6})$/.test(pincode)
    
  };

  
const isValidPrice = function (price) {
  return /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(price);
}

const isValidArray = function (object){
  if (typeof (object) === "object") {
      object = object.filter(x => x.trim())
      if (object.length == 0) {
          return false;
      }
      else {return true;}
      }
    }

 const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
  }
 
  module.exports={isValid, isValidBody,isValidString,
    isValidPhone,isValidEmail,isValidPassword, 
    isValidstreet,isValidpincode,isValidfeild,isValidPrice, isValidArray,isValidObjectId}