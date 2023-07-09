const Order = require('../models/Order');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require('./verifyToken');

const router = require('express').Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        await newOrder.save();
        res.status(200).json(newOrder);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: false });
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// //Delete 

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
    } catch (error) {
        res.status(500).json(error);
    }
})

// //Get User Order

//Here id is the User Id not the Order Id
router.get("/find/:id", async (req, res) => {
    try {
        Order.findOne({userId:req.params.id}).then((result) => {

            res.status(200).json(result);
        })
    } catch (err) {
        res.status(500).json(err);
    }
});

// //Get All Orders

router.get("/",verifyTokenAndAdmin , async (req, res) => {
    try{
        Order.find().then((result)=>{
            result.json(200).json(result);
        })
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Get Monthly Income

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));

    try {
        const Income = Order.aggregate([
            {$match:{createdAt:{$gte:previousMonth}}},
            {
                $project:{
                    month:{$month:"$createdAt"},
                    sales:"$amount"
                },
                $group:{
                    _id:"month",
                    total:{
                        $sum:"sales"
                    }
                }
            }
        ])
        res.status(200).send(Income);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;