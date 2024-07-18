var express = require('express');
var router = express.Router();
const db = require('../db/knex.db');
const verifyAuth = require('./auth');

router.post('/', verifyAuth, async function(req, res) {
    const user_id = req.user.id;
    const { paymentDetails } = req.body;

    try {
        const user = await db('users').select('*').where('id', user_id).first();
        if (!user) {
            return res.status(400).send({ message: 'There is no user with given ID' });
        }

        const cartItems = await db('cart').select('*').where('user_id', user_id);
        if (cartItems.length === 0) {
            return res.status(400).send({ message: 'Your cart is empty' });
        }

        // Process payment (this is a mock, in real scenario you would integrate with a payment gateway)
        const paymentSuccess = true; // Mock payment success
        if (!paymentSuccess) {
            return res.status(400).send({ message: 'Payment failed' });
        }

        // Clear the cart
        await db('cart').where('user_id', user_id).del();

        return res.status(200).send({ message: 'Checkout successful', cartItems });
    } catch (error) {
        return res.status(500).send({ message: 'There is an error', error: error.message });
    }
});

module.exports = router;
