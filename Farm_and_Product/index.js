const express = require('express'); // import express
const app = express(); // create express app
const path = require('path');   // import path
const mongoose = require('mongoose'); // import mongoose 
const methodOverride = require('method-override') // import method-override

const Product = require('./models/product'); // import product model
const Farm = require('./models/farm');  // import farm model
const { AsyncLocalStorage } = require('async_hooks'); // import asyncLocalStorage 

main().catch(err => console.log(err)); // connect to database 

async function main() { // connect to database
    await mongoose.connect('mongodb://127.0.0.1:27017/farmStand');
    console.log('open')
}
app.set('views', path.join(__dirname, 'views')); // set views directory
app.set('view engine', 'ejs'); // set view engine to ejs 
app.use(express.urlencoded({ extended: true })); // use express urlencoded
app.use(methodOverride('_method')); // use method-override 

//Farms Routes
// get all farms
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });
})

// get new farm form 
app.get('/farms/new', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/new');
})
// post new farm
app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect('/farms');
})
// get farm by id
app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('products');
    res.render('farms/show', { farm });
})
// get new product form
app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', { categories, farm });
})
// post new product
app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category });
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${farm._id}`);
})
//delete farm and all products associated with farm
app.delete('/farms/:id', async (req, res) => { // delete farm
    const { id } = req.params;
    const farm = await Farm.findByIdAndDelete(id);
    res.redirect('/farms');
})


// categories array
const categories = ['fruit', 'vegetable', 'dairy'];
//Products Routes//////////////////////////////////////////////////////////////////////
app.get('/products', async (req, res) => {  // get all products
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})

        res.render('products/index', { products, category: 'All' })
    }
})
// get new product form
app.get('/products/new', (req, res) => {
    res.render('products/new')
})
// post new product
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
})
// get product by id
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('farm', 'name');
    res.render('products/show', { product })
})
// get edit product form
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories })
})
// put edit product
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
})
// delete product
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect(`/products`);
})

// listen on port 3000
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})
