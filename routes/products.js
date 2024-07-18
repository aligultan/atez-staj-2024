var express = require('express');
const verifyAuth = require('./auth');
var router = express.Router();
const db = require('../db/knex.db'); // db importunu kontrol edin

// Company users can add a product
router.post('/add', verifyAuth, async function (req, res) {
    const { name, description, price } = req.body;
    const email = req.user.email;

    try {
        const user = await db('users').select('*').where('email', email).first();
        if (!user || user.user_type !== 'company') {
            return res.status(400).json({ message: 'Only companies can add products' });
        }

        const [productId] = await db('products').insert({ name, description, price });
        const product = await db('products').where('id', productId).first();

        return res.status(200).json({
            message: 'Product added successfully',
            product
        });
    } catch (error) {
        return res.status(500).json({ message: 'There is an error', error: error.message });
    }
});

// Company users can update a product
router.patch('/update/:id', verifyAuth, async function (req, res) {
    const { name, description, price } = req.body;
    const email = req.user.email;
    const id = req.params.id;

    try {
        const user = await db('users').select('*').where('email', email).first();
        if (!user || user.user_type !== 'company') {
            return res.status(400).json({ message: 'Only companies can update products' });
        }

        const product = await db('products').select('*').where('id', id).first();
        if (!product) {
            return res.status(400).json({ message: 'No product found with given id' });
        }

        await db('products').where('id', id).update({ name, description, price });

        const updatedProduct = await db('products').select('*').where('id', id).first();

        return res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        return res.status(500).json({ message: 'There is an error', error: error.message });
    }
});

// Company users can delete a product
router.delete('/delete/:id', verifyAuth, async function (req, res) {
    const email = req.user.email;
    const id = req.params.id;

    try {
        const user = await db('users').select('*').where('email', email).first();
        if (!user || user.user_type !== 'company') {
            return res.status(400).json({ message: 'Only companies can delete products' });
        }

        const product = await db('products').select('*').where('id', id).first();
        if (!product) {
            return res.status(400).json({ message: 'No product found with given id' });
        }

        await db('products').where('id', id).del();

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'There is an error', error: error.message });
    }
});

// Get all products
router.get('/', verifyAuth, async function (req, res) {
    try {
        const products = await db('products').select('*');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'There is an error', error: error.message });
    }
});

// Get a product by id
router.get('/:id', verifyAuth, async function (req, res) {
    const id = req.params.id;
    try {
        const product = await db('products').select('*').where('id', id).first();
        if (!product) {
            return res.status(400).json({ message: 'No product found with given id' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'There is an error', error: error.message });
    }
});

// Search products by name
router.get('/list/:searchParam', verifyAuth, async function (req, res) {
    const searchParam = req.params.searchParam;
    try {
        const products = await db('products').select('*').where('name', 'like', `%${searchParam}%`);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'There is an error', error: error.message });
    }
});

module.exports = router;
