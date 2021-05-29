const router = require('express').Router();
const { Category } = require('../models/category.model');
const { Product } = require('../models/product.model')
const multer = require('multer');
const { Mongoose, mongo } = require('mongoose');
const File_Type_Map = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        const isValid = File_Type_Map[file.mimetype];
        let uploadError = new Error('invalid image format');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileName = file.originalname.split(' ').join('-');
        const extension = File_Type_Map[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})
var uploadOptions = multer({ storage: storage })
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

router.post('/', uploadOptions.single("image"), async (req, res) => {
    console.log(req.body, 167)
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send({ success: false, message: 'invalid category' })
    }
    if (!req.file) {
        return res.send("no image was uploaded")
    }
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
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
    console.log(count, 82734)
    const product = await Product.find({ "isFeatured": true, }).limit(+count)
    if (!product) {
        return res.status(500).json({ success: false })
    }
    res.send({ count: product });
});


router.put('/gallery-images/:id', uploadOptions.array('images', 20), async (req, res) => {
    console.log('Hi')
    // if (!mongoose.isValidObjectId(req.params.id)) {
    //     return res.status(400).send('invalid product id')
    // }
    const files = req.files;
    let imagePaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    if (!req.files) {
        return res.status(500).send('unable to find format of the images')
    }
    if (req.files) {
        files.map((file) => {
            imagePaths.push(`${basePath}${file.filename}`)
        })
    }
    const product = Product.findByIdAndUpdate(req.params.id, {
        images: imagePaths
    })
    if (!product) {
        return res.status(400).send("unable to update the image")
    }

    res.send(product)
})

module.exports = router;