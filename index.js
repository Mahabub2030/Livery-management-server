const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-cgkxfia-shard-00-00.x9t7sgg.mongodb.net:27017,ac-cgkxfia-shard-00-01.x9t7sgg.mongodb.net:27017,ac-cgkxfia-shard-00-02.x9t7sgg.mongodb.net:27017/?ssl=true&replicaSet=atlas-nszs70-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwdhs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    
    // await client.connect();
    
    const bookCollection =  client.db('book-db').collection('book');
    const borrowedBookCollection =  client.db('book-db').collection('borrowedBook')


    // for book add to DB
    app.get('/books', async(req,res)=>{
      const cursor = bookCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // for update
    app.get('/books/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookCollection.findOne(query);
      res.send(result);
    })

    app.post('/books',async(req,res)=>{
      const newBook = req.body
      console.log(newBook);
      const result = await bookCollection.insertOne(newBook);
      res.send(result);
    })

    app.put('/books/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = {upsert:true};
      const updateBook = req.body;
      const Book = {
        $set: {
          image: updateBook.image,
          name: updateBook.name,
          authorName: updateBook.authorName,
          category: updateBook.category,
          rating: updateBook.rating,
        }
      }
      const result = await bookCollection.updateOne( filter, Book,options);
      res.send(result);
    })

    // for add borrowed book to DB

    app.get('/borrowedBooks', async(req,res)=>{
      const cursor = borrowedBookCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
  
    app.post('/borrowedBooks',async(req,res)=>{
      const borrowedBooks = req.body
      console.log(borrowedBooks);
      const result = await borrowedBookCollection.insertOne(borrowedBooks);
      res.send(result)
    })

    
    app.delete('/borrowedBooks/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await borrowedBookCollection.deleteOne(query);
      res.send(result);
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


app.get('/',(req,res)=>{
    res.send('Laibry is on with the port')
})

app.listen(port,()=>{
    console.log(`Laibry is on port: ${port}`);
})