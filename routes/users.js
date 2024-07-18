var express = require('express');
const db = require('../db/knex.db'); // db importunu kontrol edin
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var router = express.Router();

// Kullanıcı kayıt endpointi
router.post('/signup', async function(req, res) {
    const { username, password, name, surname, email, userType } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: 'Email or password missing' });
    }

    try {
        const user = await db('users').select('*').where('email', email).first();
        if (user) {
            return res.status(400).send({ message: 'You already have an account' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        await db('users').insert({
            username,
            password: hashedPassword,
            name,
            surname,
            email,
            user_type: userType // Burada `user_type` doğru isimlendirme
        });

        return res.status(201).send({ message: 'User successfully created' });
    } catch (error) {
        return res.status(500).send({ message: 'There is an error', error: error.message });
    }
});

// Kullanıcı giriş endpointi
router.post('/login', async function(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: 'Email or password missing' });
    }

    try {
        const user = await db('users').select('*').where('email', email).first();
        if (!user) {
            return res.status(400).send({ message: 'No account found with given email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Email or password is wrong');
        }

        const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);
        return res.status(200).send({
            message: 'Successfully logged in',
            token
        });
    } catch (error) {
        return res.status(500).send({ message: 'There is an error', error: error.message });
    }
});

// Kullanıcı listeleme endpointi
router.get('/', async function(req, res) {
    try {
        const usersData = await db('users').select('*');
        res.json(usersData);
    } catch (error) {
        res.status(500).send({ message: 'There is an error', error: error.message });
    }
});

// ID ile kullanıcı getirme endpointi
router.get('/:id', async function(req, res) {
    const user_id = req.params.id;
    try {
        const user = await db('users').select('*').where('id', user_id).first();
        if (!user) {
            return res.status(400).send({ message: 'There is no user with given ID' });
        }

        return res.status(200).send({
            message: 'Successful',
            user
        });
    } catch (error) {
        return res.status(500).send({ message: 'There is an error', error: error.message });
    }
});

// Kullanıcı hesabı silme endpointi
router.delete('/delete/:id', async (req, res) => {
    const user_id = req.params.id;

    try {
        const user = await db('users').select('*').where('id', user_id).first();
        if (!user) {
            return res.status(400).send({ message: 'There is no user with given ID' });
        }

        await db('users').where('id', user_id).del();
        return res.status(200).send({ message: 'Your account has been deleted successfully' });
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred while deleting the account', error: error.message });
    }
});

module.exports = router;
