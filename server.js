const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
require('dotenv/config');
const morgan = require('morgan');
const cors = require('cors');
app.use(cors());
app.use(morgan('tiny'));
const mongoose = require('mongoose');

const api = process.env.API_URL;
var port = 2100;
const productsRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const ordersRoutes = require('./routes/order');
const userRoutes = require('./routes/order');

app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/users`, userRoutes);


app.get('',(req,res)=>{
    console.log("he;;p")
    res.send('hello world')
})

mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'eshop' }).then((db) => {
    console.log('database connection');
}).catch((error) => {
    console.log(error)
});



app.listen(port, () => {
    console.log(api)
    console.log(`server is running at ${port}`)
})