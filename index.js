const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2otfv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("traveling");
    const servicesCollection = database.collection("travelingServices");
    const ordersCollection = database.collection("orders");

    // get api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // get single id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });
    // post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });

    // delete api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    // get api for orders
    app.get("/orders/:name", async (req, res) => {
      const name = req.params.name;
      const query = { name: name };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });

    // order api
    app.post("/orders", async (req, res) => {
      const order = req.body;
      order.createdAt = new Date();
      const result = await ordersCollection.insertOne(order);
      // console.log("result");
      res.json("result");
    });
    // get api for orders
    app.get("/myorders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await ordersCollection.find(query).toArray();
      res.json(result);
    });
    app.get("/allOrders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is backend");
});

app.listen(port, () => {
  console.log("running port is : ", port);
});
