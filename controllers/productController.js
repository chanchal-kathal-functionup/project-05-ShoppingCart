const productModel = require("../models/productModel");
const validator = require("../validator/validation")
const aws = require("../aws/aws");


const createProduct = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, message: 'No data provided' }) }

        let files = req.files;
        if (files.length == 0) { return res.status(400).send({ status: false, message: "Please provide a product image" }) }

        //validations begins

        if (!(validator.isValid(data.title))) { return res.status(400).send({ status: false, message: "Title is required" }) }

        let uniqueTitle = await productModel.findOne({ title: data.title })
        if (uniqueTitle) { return res.status(400).send({ status: false, message: 'Title already exist. Please provide a unique title.' }) }

        if (!(validator.isValid(data.description))) { return res.status(400).send({ status: false, message: "Description is required" }) }

        if (!(validator.isValid(data.price))) { return res.status(400).send({ status: false, message: "Price is required" }) }

        if (!(validator.isValidPrice(data.price))) { return res.status(400).send({ status: false, message: `${data.price} is not a valid price. Please provide input in numbers.` }) }

        if (!(validator.isValid(data.currencyId))) { return res.status(400).send({ status: false, message: "Currency Id is required" }) }

        if (data.currencyId.trim() !== "INR") { return res.status(400).send({ status: false, message: "Please provide Indian Currency Id" }) }

        if (!(validator.isValid(data.currencyFormat))) { return res.status(400).send({ status: false, message: "Currency Format is required" }) }

        if (data.currencyFormat.trim() !== "₹") { return res.status(400).send({ status: false, message: "Please provide right format for currency" }) }
       
        if (!(validator.isValid(data.style))) { return res.status(400).send({ status: false, message: "Please provide style for your product" }) }


        if (!(validator.isValid(data.availableSizes))) { return res.status(400).send({ status: false, message: "Please provide available size for your product" }) }


          data.availableSizes = JSON.parse(data.availableSizes);

         if (!(validator.isValidArray(data.availableSizes))) { return res.status(400).send({ status: false, message: 'Please provide available size for your product' }) }

         if (!(validator.isValid(data.installments))) { return res.status(400).send({ status: false, message: 'Please provide installments for your product' }) }

       
        const uploadedFileURL = await aws.uploadFile(files[0])
        data.productImage = uploadedFileURL;

        const newData = await productModel.create(data);
         return res.status(201).send({ status: true, message: 'Product created successfully', data: newData })

    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const getById = async function(req, res)  {
    try{
      let productId = req.params.productId;
  
      if (!validator.isValidObjectId(productId)){
        return res.status(400).send({ status: false, message: 'Please provide valid productId' })
    }
    
      const product = await productModel.findOne({ _id: productId, isDeleted:false})
      if(!product) return res.status(404).send({ status: false, message:"No product found"})
      
      let {...data} = product._doc

  
      return res.status(200).send({ status: true, message: 'success', data: data})
    }
    
    catch (err) {
      res.status(500).send({ status: false, error: err.message })
    }
  }

  const deleteProduct=async function(req,res){
    try{
         let id=req.params.productId
         if(!validator.isValidObjectId(id)){
           return res.status(400).send({status:false, msg:"ProductId is not valid"})
         }
       const  checkId= await productModel.findById({_id:id})
       if(!checkId)
       return res.status(400).send({status:false,msg:" This productId is not exist"})

       if(checkId.isDeleted==true)
       return res.status(400).send({status:false,msg:" This Product is already deleted"})

        const deletedProduct=await productModel.findByIdAndUpdate({_id:id},{isDeleted:true},{new:true})
        return res.status(200).send({status:true, msg:"successfully deleted", data:deletedProduct})
    }
    catch(err){
      return res.status(500).send({status:false,msg:err})
    }
  }



module.exports={createProduct,getById,deleteProduct}