const router = require('express').Router();
const { Order } = require('../models/orders.model')

router.get('/', async (req, res) => {
    const ordersList = await Order.find();
    if (!ordersList) {
        res.status(500).json({ success: false })
    }
    res.send(ordersList);

});


module.exports = router;