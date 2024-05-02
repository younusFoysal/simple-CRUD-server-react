const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




const uri = "mongodb://localhost:27017"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


// middleware
app.use(cors());
app.use(express.json());

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const userCollection = client.db('usersDB').collection('users')

        // TODO: [get] read data from DB [R]
        app.get('/users', async ( req, res ) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })

        // TODO: [post] update data to DB [U]
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await userCollection.findOne(query)
            res.send(user)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(id, user)
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, options);
            res.send(result)
        })

        // TODO: [post] create data to DB [C]
        app.post('/users', async(req, res) => {
            const user = req.body;
            console.log('New User: ', user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        });

        // TODO: [delete] delete data in DB [D]
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Delete data from db id: ', id)
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
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



// handle req res
app.get('/', (req, res) => {
    res.send('Simple CRUD is running')
})


// port listener
app.listen(port, () => {
    console.log(`Current port: ${port}`)
})
