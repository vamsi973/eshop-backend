const router = require('express').Router();
const { User } = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    const usersList = await User.find().select('name email country');
    if (!usersList) {
        res.status(500).json({ success: false })
    }
    res.send(usersList);
});

router.get('/:id', async (req, res) => {
    const usersList = await User.findById(req.params.id).select('-passwordHash');
    if (!usersList) {
        res.status(500).json({ success: false })
    }
    res.send(usersList);
});


router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
    })
    user = await user.save()
    if (!user) {
        return res.json({ success: false, message: "user created " });
    }
    res.send({ success: true, data: user })
})


router.put('/:id', async (req, res) => {
    console.log(req.params.id, 4789)
    let userExists = await User.findById(req.params.id);
    let newPassword;

    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExists.passwordHash;
    }
    console.log(newPassword, 177)
    const user = await User.findByIdAndUpdate(
        req.params.id, {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
    })
    if (!user) {
        return res.send({ success: false, error: error })
    }

    res.send({ success: true, data: userExists })
})



router.post('/login', async (req, res) => {
    const secretKey = process.env.secret;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('user not found');
    }
    // console.log(user,req.body.password)
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        console.log(user, 89)
        const token = jwt.sign({
            userId: user._id,
            isAdmin: user.isAdmin
        }, secretKey,
            { expiresIn: '1d' })
        res.status(200).send({ success: true, user: user.email, token: token });
    } else {
        res.status(400).send("user password not correct")
    }
})


router.get("/get/count", async (req, res) => {
    let userCount = await User.countDocuments(count => count);

    if (!user) {
        return res.status(400).send('count not available')
    }
    res.send({ count: userCount })
})



router.delete('/:id', async (req, res) => {
    user = await User.findByIdAndRemove(req.body.id);
    if (!user) {
        return res.status(500).send("unable to find the document");
    }
    res.send(user)
})

module.exports = router;