const functions = require("firebase-functions");
const cors = require('cors');
const express = require("express");
const stripe = require("stripe")('Enter your stripe secret key here')
// App config

const app = express();

// Middlewares

app.use(cors({origin: true}))
app.use(express.json());

// API routes

app.get('/', (req, res)=> res.status(200).send('Hello world'));

app.post('/payments/create', async (req, res) => {
    const total = req.query.total;

    console.log('Payment request recived BOOM!!! for this amount >> ', total);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "inr"
    })
    res.status(201).send({
        clientSecret: paymentIntent.client_secret,
    });
});
// -Listen

exports.api = functions.https.onRequest(app);

// http://localhost:5001/clone-e9171/us-central1/api