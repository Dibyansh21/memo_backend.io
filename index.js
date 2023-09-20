import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(cors());
app.use(cors({
  origin: "*",
}));


mongoose
  .connect(process.env.MONGODB_URI || 'mongodb+srv://root:root@cluster0.cb98oei.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const keeperSchema = mongoose.Schema({
  title: String,
  description: String,
});

const Keeper = mongoose.model("Keeper", keeperSchema);

app.get("/api/getAll", async (req, res) => {
  try {
    const keeperList = await Keeper.find({});
    res.status(200).json(keeperList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch keepers" });
  }
});

// ...

app.post("/api/addNew", async (req, res) => {
  const { title, description } = req.body;

  // Add validation here to check if title and description are valid.

  try {
    const keeperObj = new Keeper({
      title: title,
      description: description,
    });
    await keeperObj.save();

    // Fetch the updated list of keepers and send it in the response
    const updatedKeeperList = await Keeper.find({});
    res.status(200).json(updatedKeeperList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add keeper" });
  }
});

// ...

app.post("/api/delete", async (req, res) => {
  const { id } = req.body;
  try {
    // Delete the keeper with the specified ID
    await Keeper.deleteOne({ _id: id });

    // Fetch the updated list of keepers
    const keeperList = await Keeper.find({});

    // Send the updated keeper list in the response
    res.status(200).json(keeperList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete keeper" });
  }
});

const port = process.env.PORT || 3001;

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(port, () => {
  console.log("Backend created at http://localhost:3001");
});
