var express = require('express');
var router = express.Router();
const db = require('../db/knex.db');
const verifyAuth = require('./auth');

// Sepete ürün ekleme endpointi
router.post('/add', verifyAuth, async (req, res) => {
    const user_email = req.user.email;
    const { productId } = req.body;

    try {
        const user = await db('users').select('*').where('email', user_email).first();

        if (!user) {
            return res.status(400).send({ message: 'There is no such a user' });
        }

        if (user.user_type !== 'user') {
            return res.status(400).send({ message: 'Only users can add product to cart' });
        }

        await db('cart').insert({ user_id: user.id, product_id: productId });

        return res.status(200).send({ message: 'The product added to the cart successfully' });
    } catch (error) {
        console.error('Hata:', error);
        return res.status(400).send({ message: 'Something wrong brother.' });
    }
});

// Sepetten ürün silme endpointi
router.delete('/delete', verifyAuth, async (req, res) => {
    const user_email = req.user.email;
    const { productId } = req.body;

    try {
        const user = await db('users').select('*').where('email', user_email).first();

        if (!user) {
            return res.status(400).send({ message: 'There is no such a user' });
        }

        if (user.user_type !== 'user') {
            return res.status(400).send({ message: 'Only users can delete product from cart' });
        }

        await db('cart').select('*').where('product_id', productId).andWhere('user_id', user.id).del();

        return res.status(200).send({ message: 'The product deleted from the cart successfully' });
    } catch (error) {
        console.error('Hata:', error);
        return res.status(400).send({ message: 'Something wrong brother.' });
    }
});

// Kullanıcının sepetini listeleme endpointi
router.get('/list/user/:id', verifyAuth, async function(req, res) {
    const user_id = req.params.id;

    try {
        const user = await db('users').select('*').where('id', user_id).first();
        if (!user) {
            return res.status(400).send({ message: 'There is no user with given ID' });
        }

        const cartItems = await db('cart').select('*').where('user_id', user_id);
        return res.status(200).send(cartItems);
    } catch (error) {
        return res.status(500).send({ message: 'There is an error', error: error.message });
    }
});

module.exports = router;
