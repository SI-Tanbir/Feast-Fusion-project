const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const port = process.env.PORT || 5000;

//adding middlewares
app.use(cors());
app.use(express.json());

// starting

//adding mongodb
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
// console.log(dbUser,dbPass)


const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.o9sii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//adding database collection
const menuColl = client.db("feastfusion").collection("menu");
const CartColl = client.db("feastfusion").collection("carts");
const usersColl = client.db("feastfusion").collection("users");

let clientPromise;

if (!clientPromise) {
  clientPromise = client.connect();
}
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await clientPromise;
    // Send a ping to confirm a successful connection
    
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.get("/shafik", (req, res) => {
      res.send("Hello shafik!");
    });

    app.get("/test", async (req, res) => {
      res.send("shafik is testing food");
    });

    app.post('/users',async(req,res)=>{

      const email= req.body.email;
      const query={email:email}
      if (email) {
        // Construct the query to search by email
        const query = { email: email }; 
        
        // Find if the email already exists
        const find = await usersColl.find(query).toArray();

        if (find.length > 0) { // Check if any results are returned
            return res.send("User already exists");
        }

      }

     
        const addEmail= await usersColl.insertOne(req.body)
        res.send("user succesfuly added")
      

    })
  
    app.get("/menu", async (req, res) => {
      const query = { email: req.body.email };
      const result = await menuColl.find(query).toArray();
      res.send(result);
      // console.log(result)
    });

    app.post("/carts", async (req, res) => {
      const data = req.body;
      const result = await CartColl.insertOne(data);
      res.send("data send successfully");
    });

    app.get("/carts", async (req, res) => {
      const query = { email: req.query.email };
      const result = await CartColl.find(query).toArray();
      res.send(result);
    });
    app.post("/delete", async (req, res) => {
      const id = req.query.id;

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).send("invalid or missing ID");
      }

      const query = { _id: new ObjectId(id) };
      const result = await CartColl.deleteOne(query);

      if (result.deletedCount === 0) {
        return res.status(404).send("item not found");
      }

      res.send("successfully deleted ");
    });
  } catch (error) {
    console.log(error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
