const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://ghurboDb:JQSeYiFVIn52XjJD@cluster0.w5wg2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tourist_agency');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        // ADD NEW SERVICE API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            res.json(result)
        })

        // GET Services API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        });

        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.json(service)
        });

        // ADD ORDERS API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
            console.log(order);
        });

        // GET ORDERS API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // ORDERS DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            console.log('Deleting ', result);
            res.json(result)
        });

        // UPDATE ORDERS STATUS
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            const filter = {_id: ObjectId(id)};
            const option = {upsert: true};
            const updateDoc = {
                $set: {
                    status: 'Approved'
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, option);

            res.json(result)
        })
        
    }finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Ghurbo Server is Running')
});

app.listen(port, () => {
    console.log('Server running at port', port);
})


