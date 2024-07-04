const express = require("express");
const cors =  require('cors');
require('dotenv').config()
const app = express();
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ensactw.mongodb.net/?appName=Cluster0`;

// const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ensactw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


const serviceCollection = client.db('carDoctor').collection('services')
const orderCollection = client.db('carDoctor').collection('order')


app.get('/services',async (req , res)=>{
    const result = await serviceCollection.find().toArray();
  res.send(result)
})




app.get('/services/:id', async(req ,res)=>{

const id = req.params.id;
const query = {_id : new ObjectId(id)};
const option ={
    projection:{title :1 ,price : 1 , service_id : 1 , img : 1}
}
console.log(option)
const result = await serviceCollection.findOne(query , option)
res.send(result)


})

//bookings

app.post('/bookings', async(req , res)=>{
    const booking = req.body;
    console.log(booking)

    const result = await orderCollection.insertOne(booking)
    res.send(result)
})

app.get('/bookings', async(req , res)=>{
  console.log(req.query.email)
  let query ={}

  if(req.query.email){
    query = {email : req.query.email}
  }

// delete

app.delete('/bookings/:id' , async(req , res)=>{
  const id = new ObjectId(req.params.id);
  const query = {_id : id}
  const result = await orderCollection.deleteOne(query)
  res.send(result)
})


  const result = await orderCollection.find(query).toArray()
  res.send(result)

})
 




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req ,res)=>{
    res.send('Server is runnng ')
}) 


app.listen(port ,() =>{
    console.log(`car server running on port ${port} `  )
})