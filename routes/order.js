const router = require('express').Router();
const { Order } = require('../models/orders.model')
const { OrderItems } = require('../models/order-items.model');
const { compareSync } = require('bcryptjs');
router.get('/', async (req, res) => {
    const ordersList = await Order.find().populate('user', 'name email').sort({ 'dateOrdered': -1 });
    if (!ordersList) {
        res.status(500).json({ success: false })
    }
    res.send(ordersList);

});

router.get('/:id', async (req, res) => {
    const ordersList = await Order.findById(req.params.id).populate('user', 'name email').populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } });

    if (!ordersList) {
        res.status(500).json({ success: false })
    }
    res.send(ordersList);

});

router.post('/', async (req, res) => {

    const orderItems = Promise.all(req.body.orderItems.map(async (ele) => {
        console.log(ele);
        console.log(OrderItems, 2900)
        item = new OrderItems({
            quantity: ele.quantity,
            product: ele.product
        });
        console.log(item);
        item = await item.save();
        return item._id;
    }))
    let orderIdsResolved = await orderItems;
    let totalPrices = await Promise.all(orderIdsResolved.map(async (item, i) => {
        const orderItem = await OrderItems.findById(item).populate('product', "price");
        const totalPrice = orderItem.quantity * orderItem.product[0]['price'];
        return totalPrice;
    }))
    console.log(totalPrices, 34343)
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    console.log(totalPrice)
    let order = await Order({
        orderItems: orderIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        street: req.body.street,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country, phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();
    if (!order) {
        return res.status(400).send('unable to create order')
    }
    console.log(order, 2321)
    res.send(order)
})



router.delete('/:id', async (req, res) => {
    let orderData = await Order.findById(req.params.id);

    Order.findOneAndDelete(req.param.id).then((order => {
        if (!order) {
            res.status(404).json({ success: false, message: 'unable to perform the delete operation' });
        } else {
            orderData.orderItems.forEach(async (element) => {
                let deleteStatus = await OrderItems.findByIdAndDelete(element._id);

                if (deleteStatus) {
                    console.log(`orderItem ${element._id} was delted`)
                } else {
                    console.log("not delted")
                }
            });
            res.status(200).json({ success: true, message: 'delete operation perfromed' });
        }
    })).catch(error => {
        console.log(error, 839);
        res.status(400).json({ success: false, error: error })
    })
})

router.put('/:id', async (req, res) => {
    console.log(req.body, req.params.id, 4536)
    let order = await Order.findOneAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        },
        {
            new: true
        }
    );
    console.log(order, 86);
    if (!order)
        return res.status(400).send('status  cant be updated');

    console.log("hey success")
    res.send(order)
})



router.get('/get/totalSales', async (req, res) => {
    const totalSales = await Order.aggregate([{
        $group: {
            _id: null,
            totalSales: {
                $sum: '$totalSales'
            }
        }
    }])
    if (!totalSales) {
        res.status(500).json({ success: false })
    }
    res.send({ success: true, totalSales: totalSales[0]['totalSales'] });
});

router.get('/get/totalOrders', async (req, res) => {
    const totalOrders = await Order.countDocuments(count => count)
    if (!totalOrders) {
        return res.status(500).json({ success: false })
    }
    res.send({ success: true, totalOrders: totalOrders });
});



router.get('/get/userOrders/:id', async (req, res) => {
    const userOrders = await Order.find({ user: req.params.id }).populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } });
    console.log(userOrders, 140);
    // if (!userOrders) {
    //     return res.status(500).json({ success: false })
    // }   
    res.send({ success: true, data: userOrders });
});

module.exports = router;