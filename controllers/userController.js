const userModel=require('../models/userModel')
const validate=require('../validator/validation')
const bcrypt=require('bcrypt')
const uploadFile=require('../aws/aws')
const jwt=require('jsonwebtoken')

const createUser=async (req,res) =>{

    try{
let data=req.body
let files=req.files
 
  if(validate.isValidBody(data)){
    return res.status(400).send({ status: false, message: "Oops you forgot to enter details" });
}  
 
//checking for fname
if(!data.fname){
    return res.status(400).send({ status: false, message: "First name is required" }); 
}

if (!validate.isValidfeild(data.fname)) {
    return res.status(400).send({ status: false, message: "Invalid format of first name", });
  }

  if(validate.isValidString(data.fname)){
    return res.status(400).send({ status: false, message: "First name should not contains number" }) }

  //checking for lname

  if(!data.lname){
    return res.status(400).send({ status: false, message: "Last name is required" }); 
}

if (!validate.isValidfeild(data.lname)) {
    return res.status(400).send({ status: false, message: "Invalid format of Last name", });
  }

  if(validate.isValidString(data.lname)){
    return res.status(400).send({ status: false, message: "Last name should not contains number" }) }

 //checking for email
 if(!data.email){
    return res.status(400).send({ status: false, message: "Email is required" }); 
}
if (!validate.isValidEmail(data.email)) {
    return res.status(400).send({ status: false, message: "Invalid Email format", });
  }

  let uniqueEmail=await userModel.findOne({email:data.email})
  if(uniqueEmail){
    return res.status(400).send({ status: false, message: `${data.email} Email Id  Already Registered.Please,Give Another Email Id` })
  }

//checking for profileImage
if(!files.length){
    return res.status(400).send({ status: false, message: "profileImage is required" }); 
}

//checking for phone
//console.log(data)
 if (!data.phone) {
  return res.status(400).send({ status: false, message: "Phone Number is required" });
} 


if (!validate.isValidPhone(data.phone)) {
    return res.status(400).send({ status: false, message: "Invalid Phone number", });
  }

  let uniquePhone=await userModel.findOne({phone:data.phone})
  if(uniquePhone){
    return res.status(400).send({ status: false, message: `${data.phone} this phone number is  Already Registered.Please,Give Another phone number` })
  }



//checking for password 
if(!data.password){
    return res.status(400).send({ status: false, message: "Password is required" }); 
}
if(!validate.isValidPassword(data.password)){
    return res.status(400).send({ status: false, message: "Password should contain at-least one number,one special character and one capital letter with length in between 8-15", })
}
  // bcrypt
  data.password = await bcrypt.hash(data.password, 10);
 

  //check for  address
  if(!(data.address)) {return res.status(400).send({ status: false, message: "Address should be present and must contain shipping and billing addresses" });
  }
  //converting into object
  data.address = JSON.parse(data.address)

  //validating the shipping address
   if(validate.isValid(data.address.shipping) && validate.isValidBody(data.address.shipping) ) {
      return res.status(400).send({ status: false, message: "Shipping address should be in present must contain street, city and pincode" });
} 
 
  //checking for street shipping address
  if(!data.address.shipping.street){ 
      return res.status(400).send({ status: false, message: "Street is required in shipping address" });
    }

  if(!validate.isValidstreet(data.address.shipping.street)) {
  return res.status(400).send({ status: false, message: "Invalid format of street in shipping address" });
  }

//checking for city shipping address
    if(!data.address.shipping.city){ return res.status(400).send({ status: false, message: "City is required of shipping address" });
}

if(validate.isValidString(data.address.shipping.city)) return res.status(400).send({ status: false, message: "City name should not contains number in shipping address" })

//checking for pincode shipping address
if(!data.address.shipping.pincode) {
    return res.status(400).send({ status: false, message: "Pincode is required in shipping address" });
}
if(!validate.isValidpincode(data.address.shipping.pincode)){
    return res.status(400).send({ status: false, message: "Invalid format of pincode in shipping address" });
}
//validating the billing address
  if(validate.isValid(data.address.billing) && validate.isValidBody(data.address.billing)) {
    return res.status(400).send({ status: false, message: "Billing address should be present and must contain street, city and pincode" });
}  
//checking for street billing address
if(!data.address.billing.street) {return res.status(400).send({ status: false, message: "Street is required in billing address" });
}

if(!validate.isValidstreet(data.address.billing.street)) {
    return res.status(400).send({ status: false, message: "Invalid format of street in billing address" });
    }

//checking for city billing address
if(!data.address.billing.city){ return res.status(400).send({ status: false, message: "City name is required of billing address" });
}

if(validate.isValidString(data.address.billing.city)) return res.status(400).send({ status: false, message: "City name should not contains number in billing address" })
//checking for pincode shipping address
if(!data.address.billing.pincode) {
    return res.status(400).send({ status: false, message: "Pincode is required in billing address" });
}
if(!validate.isValidpincode(data.address.billing.pincode)){
    return res.status(400).send({ status: false, message: "Invalid format of pincode in billing address" });
}

//getting the AWS-S3 link after uploading the user's profileImage
let profileImgUrl = await uploadFile.uploadFile(files[0]);
data.profileImage = profileImgUrl;


let saveData = await userModel.create(data);
    res.status(201).send({ status: true, message: "User created successfully", data: saveData })
}
     catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }  
}


//=================================POST /login=====================//

const loginUser=async (req,res)=>{
  try{
  let data=req.body

  if(validate.isValidBody(data)){
    return res.status(400).send({ status: false, message: "Oops you forgot to enter details" });
}  
if(!data.email){
  return res.status(400).send({ sataus: false, message: "Email is missing" });
}
if (!validate.isValidEmail(data.email)) {
  return res.status(400).send({ status: false, message: "Invalid Email format", });
}
let findUser = await userModel.findOne({ email:data.email })
    if (!findUser) return res.status(404).send({ status: false, message: "User is not found" })

    // password checking
    if(!data.password){
      return res.status(400).send({ status: false, message: "Password is required" }); 
  }
  let checkPassWord = await bcrypt.compare(data.password, findUser.password);

    
  if (!checkPassWord) return res.status(400).send({ status: false, message: "Incorrect password" })

let token = jwt.sign(
      { userId: findUser._id },
      "group16", { expiresIn: '12h' }  //sectetkey
    );

    res.status(200).send({ status: true, message: "User login successfully", data: { userId: findUser._id, token: token } })
  }catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }

}

//GET USER
const getUser = async (req, res) => {
  try{
    let id = req.params.userId;
    if (Object.keys(id) == 0) { return res.status(400).send({ status: false, message: 'Please provide UserId for details' }) }
  
    const userDetails = await userModel.findById(id);
    if(!userDetails){ return res.status(404).send({status: false,message:'No user found with this id'})}
    
    return res.status(200).send({ status: true, message: 'User  Details', data: userDetails})
  }
  catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}

//UPDATE USER


module.exports={createUser,loginUser,getUser}