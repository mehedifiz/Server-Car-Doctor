const express = require("express");
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ensactw.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}); 

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('carDoctor').collection('services');
    const orderCollection = client.db('carDoctor').collection('order');

    // Services Endpoints
    app.get('/services', async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const option = {
        projection: { title: 1, price: 1, service_id: 1, img: 1 }
      };
      console.log(option);
      const result = await serviceCollection.findOne(query, option);
      res.send(result);
    });

    // Bookings Endpoints
    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await orderCollection.insertOne(booking);
      res.send(result);
    });

    app.get('/bookings', async (req, res) => {
    
      let query = {};
      console.log(req.query.email)
      if (req.query.email) {
      query = { email: req.query.email };
      }
      const result = await orderCollection.find(query).toArray();
    return  res.send(result);
    });

    app.delete('/bookings/:id', async (req, res) => {
      const id = new ObjectId(req.params.id);
      const query = { _id: id };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

    app.put('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const updateBooking = req.body;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: updateBooking.status
        }
      };
      const result = await orderCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.patch('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const query = { _id: new ObjectId(id) };
      console.log(update);

      const updatedDoc = {
        $set: {
          status: update.status
        }
      };

      const result = await orderCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Car server running on port ${port}`);
});
