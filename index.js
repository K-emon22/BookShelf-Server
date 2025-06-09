const express = require("express");
const app = express();
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = 3000;

const uri =
  "mongodb+srv://emonsheikhkhalid2:1RwfmEIHE2FxsBna@bookshelf.bpdctut.mongodb.net/?retryWrites=true&w=majority&appName=bookShelf";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("allBooks");
    const collection = database.collection("allBook");
    const reviewCollection = database.collection("review");

    app.get("/allBooks", async (req, res) => {
      const allBook = await collection.find().toArray();
      res.send(allBook);
    });
    app.post("/allBooks", async (req, res) => {
      const book = req.body;
      const allBook = await collection.insertOne(book);
      res.send(allBook);
    });

    app.get("/review", async (req, res) => {
      const AllReview = await reviewCollection.find().toArray();
      res.send(AllReview);
    });
    app.get("/sorted", async (req, res) => {
      const sorted = await collection
        .find({upvote: {$gt: 0}})
        .sort({upvote: -1})
        .limit(6)
        .toArray();
      res.send(sorted);
    });

    app.get("/bookDetails/:id", async (req, res) => {
      const {id} = req.params;
      const bookDetails = await collection.findOne({_id: new ObjectId(id)});
      res.send(bookDetails);
    });

    app.patch("/upvote/:id", async (req, res) => {
      const {id} = req.params;
      const result = await collection.updateOne(
        {_id: new ObjectId(id)},
        {$inc: {upvote: 1}}
      );

      if (result) {
        const updatedDoc = await collection.findOne({_id: new ObjectId(id)});
        res.send(updatedDoc);
      }
    });

    app.post("/review", async (req, res) => {
      const review = req.body;

      const addedRev = await reviewCollection.insertOne(review);

      res.send(addedRev);
    });

    app.put("/review/:id", async (req, res) => {
      const review = req.body;
      const {id} = req.params;
      const addedRev = await reviewCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set: review}
      );
      if (addedRev.modifiedCount > 0) {
        const refreshedReview = await reviewCollection.findOne({
          _id: new ObjectId(),
        });
        res.send(refreshedReview);
      }
    });

    app.delete("/review/:id", async (req, res) => {
      const {id} = req.params;
      const deleteRev = await reviewCollection.deleteOne({
        _id: new ObjectId(id),
      });
      if (deleteRev) {
        res.send({message: "Deleted successfully"});
      }
    });

    await client.db("admin").command({ping: 1});
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("❌ MongoDB Error:", error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("backend is walking");
});

app.listen(port, () => {
  console.log("port", port, "is running");
});
