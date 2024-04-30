const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_TYPES);
console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_TYPES}:${process.env.DB_PASS}@cluster0.nshaxle.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const tourSpotsCollections = client.db("tourDB").collection('tour');
    const tourCountriesCollection = client.db("tourDB").collection('countries');

    app.post('/spots', async (req, res) => {
      const tourSpots = req.body;
      const result = await tourSpotsCollections.insertOne(tourSpots);
      res.send(result);
    })
  // __________________get country spot_____________________//
    app.get('/countries', async (req, res) => {
      const countriesSpots = req.body;
      const result = await tourCountriesCollection.find(countriesSpots).toArray();
      res.send(result)
    })
    // ________________Get spots According to country name______________//
    app.get('/spots/:country', async(req, res) => {
      const result = await tourSpotsCollections.find({country: req.params.country}).toArray();
      res.send(result)
    })
    app.get('/spots', async(req, res) => {
      const spots = req.body;
      const cursor = tourSpotsCollections.find(spots);
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/spots/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await tourSpotsCollections.findOne(query);
      res.send(result)
    });
    app.get('/myList/:email', async (req, res) => {
      const result = await tourSpotsCollections.find({email: req.params.email}).toArray();
      res.send(result)
    });
    
  app.put('/spots/:id', async(req, res) =>{
    const id = req.params.id;
    const spot = req.body;
    const query = {_id: new ObjectId(id)}
    const options = { upsert: true };
    const updateSpot = {
        $set: {
          country: spot.country, spots: spot.spots, location: spot.location, description: spot.description, cost: spot.cost, session: spot.session, time: spot.time, visitors: spot.visitors, photo: spot.photo
        }
      };
      const result = await tourSpotsCollections.updateOne(query, updateSpot, options)
      res.send(result)
  });
  app.delete('/spots/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id)};
    const result = await tourSpotsCollections.deleteOne(query);
    res.send(result)
  })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
  res.send('world tour spots is running');
})

app.listen(port, () => {
  console.log(`my world tour server is running on port ${port}`);
})