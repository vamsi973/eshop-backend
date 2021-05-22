const router = require('express').Router();
const { Category } = require('../models/category.model');
const { route } = require('./order');

router.get('/', async (req, res) => {
    const categorytList = await Category.find();

    if (!categorytList) {
        res.status(500).json({ success: false })
    }
    res.send(categorytList);

});

router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon
    });
    category = await category.save();
    if (!category)
        res.status(400).send('the category cant be created');

    console.log("hey success")
    res.send(category)
});

router.delete('/:id', (req, res) => {
    Category.findOneAndDelete(req.param.id).then((category => {
        if (!category) {
            res.status(404).json({ success: false, message: 'unable to perform the delete operation' });
        } else {
            res.status(200).json({ success: true, message: 'delete operation perfromed' });
        }
    })).catch(error => {
        res.status(400).json({ success: false, error: error })
    })
})

router.put('/:id', async (req, res) => {
    console.log(req.body, 4536)
    let category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            color: req.body.color,
            icon: req.body.icon,
        },
        {
            new : true
        }
    );
    if (!category)
        res.status(400).send('the category cant be created');

    console.log("hey success")
    res.send(category)
})


module.exports = router;