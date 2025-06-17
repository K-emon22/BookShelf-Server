const express = require("express");
const app = express();
require("dotenv").config();
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");

const admin = require("firebase-admin");

const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://emons-bookshelf.netlify.app",
    "http://localhost:5174",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

app.use(express.json());

const port = 3000;
const serviceAccount = require("./jot.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const verifyFBtoken = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({message: "unauthorized access"});
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).send({message: "unauthorized access"});
  }
};

async function run() {
  try {
    const database = client.db("allBooks");
    const collection = database.collection("allBook");
    const reviewCollection = database.collection("review");

    app.get("/allBooks", async (req, res) => {
      const allBook = await collection.find().toArray();
      res.send(allBook);
    });

    app.post("/allBooks", verifyFBtoken, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const queryEmail = req.query.email;

      if (!decodedEmail) {
        return res.status(401).send({message: "Unauthorized: Missing email"});
      }

      if (decodedEmail !== queryEmail) {
        return res.status(403).send({message: "Forbidden: Email mismatch"});
      }

      const book = req.body;
      const result = await collection.insertOne(book);
      res.send({message: "Book added successfully ✅", result});
    });

    app.put("/allBooks/:id", async (req, res) => {
      const body = req.body;
      const {id} = req.params;
      const book = await collection.updateOne(
        {_id: new ObjectId(id)},
        {$set: body}
      );
      if (book) {
        const updatedBook = await collection.findOne({
          _id: new ObjectId(id),
        });
        res.send(updatedBook);
      }
    });

    app.get("/userBook", verifyFBtoken, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const queryEmail = req.query.email;

      if (!decodedEmail || !queryEmail) {
        return res.status(401).send({message: "Unauthorized: Missing email"});
      }

      if (decodedEmail !== queryEmail) {
        return res.status(403).send({message: "Forbidden: Email mismatch"});
      }

      const myBook = await collection
        .find({"user.email": queryEmail})
        .toArray();

      res.send({
        message: "JWT data fetched successfully ✅",
        myBook,
      });
    });

    app.get("/alldata", verifyFBtoken, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const queryEmail = req.query.email;
      if (!decodedEmail || !queryEmail) {
        return res.status(401).send({message: "Unauthorized: Missing email"});
      }

      if (decodedEmail !== queryEmail) {
        return res.status(403).send({message: "Forbidden: Email mismatch"});
      }
      const allBook = await collection.find().toArray();
      res.send({
        message: "JWT data fetched successfully ✅",
        allBook,
      });
    });

    app.delete("/allBooks/:id", async (req, res) => {
      const {id} = req.params;
      const deleteBook = await collection.deleteOne({_id: new ObjectId(id)});

      if (deleteBook) {
        res.send({message: "Deleted successfully"});
      }
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

    app.patch("/bookDetails/:id", async (req, res) => {
      const {id} = req.params;
      const {reading_status: newStatus} = req.body;
      const result = await collection.updateOne(
        {_id: new ObjectId(id)},
        {$set: {reading_status: newStatus}}
      );
      if (result) {
        const updateStatus = await collection.findOne({_id: new ObjectId(id)});
        res.send(updateStatus);
      }
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
      console.log("hsdfbklaweghfkjshf");

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
          _id: new ObjectId(id),
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
