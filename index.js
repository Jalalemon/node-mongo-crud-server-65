const express = require('express');
const app = express();
const cors = require('cors');
const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// password  BrN6ycWrn5Ao8yTq
// dbUser3 

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://dbUser3:BrN6ycWrn5Ao8yTq@cluster0.6fgntc0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {

    try{
        const userCollection =client.db('nodeMongoCrud').collection('users');

        app.get('/users', async(req, res)=> {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);


        });

        app.get('/users/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const user = await userCollection.findOne(query);
            res.send(user)
        })
        app.post('/users', async(req, res)=> {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user)
            console.log(result);
            res.send(result)
        })

        app.put('/users/:id', async(req,res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const option = {upsert: true}
            const user = req.body;
           const updateUser = {
            $set: {
                name: user.name,
                address: user.address,
                email: user.email

            }
           }
           const result = await userCollection.updateOne(filter, updateUser, option);
           res.send(result)
        })
       app.delete("/users/:id", async (req, res) => {
         const id = req.params.id;
         console.log('trying to delete', id);
         const query = { _id: ObjectId(id) };
         const result = await userCollection.deleteOne(query);
         console.log(result);
         res.send(result);
       });
        
    }
    finally{

    }
}
run().catch(error => console.log(error));


app.get('/', (req, res) => {
    res.send('node crud running on server');
})

app.listen(port, () => {
    console.log(`server port running ${port}`);
})