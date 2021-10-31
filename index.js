const { MongoClient } = require('mongodb');
require("dotenv").config();
const express = require('express')
const app = express()
const cors = require('cors')
const { ObjectId } = require('bson');
// const { ObjectId } = require('bson');
// const { ObjectId } = require('bson')
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8c0v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("discover_world_service");
        const offersCollection = database.collection("discover_world_offers");

        const database1 = client.db("orders");
        const ordersCollection = database1.collection("my_orders");

        //GET API

        app.get('/offer', async (req, res) => {
            const cursor = offersCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })

        // POST API  

        app.get("/offer/:title", async (req, res) => {
            const title = req.params.title;
            const query = { title: `${title}` };

            // console.log(title, 'server');
            const result = await offersCollection.findOne(query);
            // console.log(result);
            res.json(result)
        })



        // POST API for placeorder

        app.post('/placeorder', async (req, res) => {
            // console.log(req.body, ' my orders');
            const order = req.body;
            const myOrders = await ordersCollection.insertOne(order)
            res.json(myOrders)
        })
        // POST API for add service

        app.post('/addservice', async (req, res) => {
            const service = req.body;
            const result = await offersCollection.insertOne(service);
            res.json(result)
        })


        //GET API for myOrders

        app.get('/myorders', async (req, res) => {
            const myemail = req.query.email;
            const query = { email: `${myemail}` };
            // const query = { email: { $in: Object.values(myemail) } }
            const result = await ordersCollection.find(query).toArray()
            // console.log(result);
            res.json(result)
        })
        // GET API for all orders

        app.get('/allorders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.json(result)

        })
        // PUT API for update status 

        app.put('/manageallusers/:id', async (req, res) => {
            const orderId = req.params.id;
            const filter = { _id: orderId }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    status: 'approved'
                }
            }
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })


        // DELETE API

        app.delete('/myorders', async (req, res) => {
            const title = req.query.title;
            const query = { title: title };
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })
        // DELETE API for delete user

        app.delete('/manageallusers', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
            // console.log(title);
        })




    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', async (req, res) => {
    console.log("This is Discover_world");
    res.send("Hit the World!")

})


app.listen(port, () => {
    console.log("World is hitting at: ", port);
})




