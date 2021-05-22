const router = require('express').Router();
const { Category } = require('../models/category.model');
const { Product } = require('../models/product.model')

router.get('/', async (req, res) => {
    console.log("hello")
    const productList = await Product.find().select('name image isFeatured');
    if (!productList) {
        return res.status(500).json({ success: false })
    }
    res.send(productList);
});


router.get('/:id', async (req, res) => {
    console.log("hello")
    const product = await Product.findById(req.params.id).populate('category    ');
    if (!product) {
        return res.status(500).json({ success: false })
    }
    res.send(product);
});

router.post('/', async (req, res) => {
    console.log(req.body, 167)
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send({ success: false, message: 'invalid category' })
    }
    product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });
    product = await product.save();
    if (!product) {
        return res.status(500).send({ success: false, message: 'this product cant be saved' });
    }
    res.send(product);
});



router.put('/:id', async (req, res) => {
    let category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send("invalid category")
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {
            new: true
        }
    )
    if (!product) {
        return res.status(500).send({ success: false, message: "the product cant be updated" })
    }
    res.send(product)
});


router.delete('/:id', async (req, res) => {
    product = await Product.findByIdAndRemove(req.body.id);
    if (!product) {
        return res.status(500).send("unable to find the document");
    }
    res.send(product)
})

router.get('/get/count', async (req, res) => {

    const product = await Product.countDocuments((count) => count)
    if (!product) {
        return res.status(500).json({ success: false })
    }
    res.send({ count: product });
});

router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    console.log(count,82734)
    const product = await Product.find({  "isFeatured": true, }).limit(+count)
    if (!product) {
        return res.status(500).json({ success: false })
    }
    res.send({ count: product });
});

module.exports = router;