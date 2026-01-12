/*** Imports ***/
import dotenv from "dotenv";
dotenv.config();
import { ObjectId, ServerApiVersion } from "mongodb";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import logger from "morgan";
import cors from "cors";
import { stringify, parse } from "flatted";
import axios from "axios";
import jwt from "jsonwebtoken";

const app = express();

//Mongo Connection
const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.set("strictQuery", true);

mongoose
  .connect(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      deprecationErrors: true,
    },
  })
  .then(() => {
    console.log("connected to dB");
  })
  .catch((err) => {
    console.error(err);
  });

/***** Middlewares *****/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://recapnote.netlify.app",
  "http://localhost:3000",
];

const options = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "UPDATE", "PATCH"],
  credentials: true,
};

app.use(cors(options));
app.use(logger("combined"));

/*******  Module Imports  ******/
import Note from "./models/Note.js";
import User from "./models/User.js";
import Collection from "./models/Collection.js";

passport.use(User.createStrategy());

// JWT Secret Key
const jwtSecret = process.env.JWT_SECRET;

//Auth Middlewares

function validateObjectId(id) {
  if (ObjectId.isValid(id)) {
    return true;
  } else {
    return false;
  }
}

/****   Routes **** */

/**Register */
app.post("/register", (req, res) => {
  User.findOne({ username: req.body.username })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({
          message: "Username already exists. Login Instead.",
          authenticated: false,
        });
      }
      const newUser = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };
      const password = req.body.password;

      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!password.match(passwordRegex)) {
        return res.status(400).json({
          success: false,
          message: "Password must meet the required criteria!",
          authenticated: false,
        });
      }
      User.register(newUser, password, (err, user) => {
        if (err) {
          console.error(err);
          return res.status(400).json({
            message: "Registration failed",
            authenticated: false,
          });
        }
        const token = jwt.sign({ _id: user._id }, jwtSecret, {
          expiresIn: "1d",
        });
        res.status(201).json({
          message: "Registration successful",
          user: user,
          authenticated: true,
          token,
        });
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        message: "something went wrong, try again",
        authenticated: false,
      });
    });
});

//Login
app.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong, try again.",
        authenticated: false,
      });
    }

    if (!user) {
      return res.status(403).json({
        message: "Wrong username or password.",
        authenticated: false,
      });
    }

    const token = jwt.sign({ _id: user._id }, jwtSecret, {
      expiresIn: "24h",
    });
    res.status(200).json({
      message: "Login successful",
      user: user,
      authenticated: true,
      token,
    });
  })(req, res, next);
});

//logout
app.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

/**** get user*/

// get user
app.get("/user/:uid", async (req, res) => {
  const uid = new ObjectId(req.params.uid);
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }
  jwt.verify(token.split(" ")[1], jwtSecret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (validateObjectId(uid)) {
      const response = await User.findOne({ _id: uid });
      res.json(response);
    } else {
      console.log("Invalid Id String");
    }
  });
});

//returns the notes
app.get("/notes/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const uid = new ObjectId(req.params.uid);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (validateObjectId(uid)) {
      await Note.find({ user: uid })
        .then((foundNotes) => {
          if (foundNotes) {
            res.json(foundNotes);
          } else if (!foundNotes) {
            res.json({ message: "No notes found" });
          }
        })
        .catch((err) => console.error(err));
    } else {
      console.log("Invalid Id String");
    }
  });
});

//creates a new note
app.post("/addnotes", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  const title = req.body.title;
  const content = req.body.content;
  const user = req.body.userID;

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const note = new Note({
      title: title,
      content: content,
      user: user,
    });

    try {
      const savedNote = await note.save();
      res.status(200).json({
        success: true,
        message: "Note Added Successfully!",
        note: savedNote,
      });
    } catch (err) {
      console.error("error adding note:", err);
      res
        .status(500)
        .json({ success: false, message: "Something went wrong, try again!" });
    }
  });
});

//deletes a note
app.delete("/note/delete/:nid/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const uid = new ObjectId(req.params.uid);
  const nid = new ObjectId(req.params.nid);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (validateObjectId(uid) && validateObjectId(nid)) {
      await Note.findOneAndRemove({ _id: nid, user: uid }).then(
        (deletedNote) => {
          if (deletedNote) {
            return res
              .status(200)
              .json({ message: "Note deleted successfully" });
          } else {
            return res
              .status(404)
              .json({ message: "No note found or deleted" });
          }
        }
      );
    } else {
      return res.status(400).json({ message: "Invalid ID strings" });
    }
  });
});

//Edit a note
app.get("/edit/:nid/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const uid = new ObjectId(req.params.uid);
  const nid = new ObjectId(req.params.nid);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (validateObjectId(uid) && validateObjectId(nid)) {
      const editedNote = await Note.findOne({ _id: nid, user: uid });
      if (editedNote) {
        res.json(editedNote);
      } else {
        return res.status(404).json({ message: "Note not found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid ID strings" });
    }
  });
});

//put method editing

app.put("/edit/:nid/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const uid = new ObjectId(req.params.uid);
  const nid = new ObjectId(req.params.nid);
  const title = req.body.title;
  const content = req.body.content;

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (validateObjectId(uid) && validateObjectId(nid)) {
      const updatedNote = await Note.findOneAndUpdate(
        { _id: nid, user: uid },
        { title: title, content: content }
      );

      if (updatedNote) {
        res.json(updatedNote);
      } else {
        return res.status(404).json({ message: "Note not found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid ID strings" });
    }
  });
});

//view note
app.get("/view/:nid/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const uid = new ObjectId(req.params.uid);
  const nid = new ObjectId(req.params.nid);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (validateObjectId(uid) && validateObjectId(nid)) {
      const response = await Note.findOne({ _id: nid, user: uid });

      if (response) {
        res.json(response);
      } else {
        return res.status(404).json({ message: "Note not found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid ID strings" });
    }
  });
});

//get favourite notes

app.get("/favourites/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const uid = new ObjectId(req.params.uid);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (validateObjectId(uid)) {
      const response = await Note.find({ user: uid, favourited: true });
      res.json(response);
    } else {
      return res.status(400).json({ message: "Invalid ID string" });
    }
  });
});

//update favourite notes
app.put("/toggleFavourites/:nid/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const uid = new ObjectId(req.params.uid);
  const nid = new ObjectId(req.params.nid);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (validateObjectId(uid) && validateObjectId(nid)) {
      try {
        const foundNote = await Note.findOne({ _id: nid, user: uid });
        if (foundNote) {
          foundNote.favourited = !foundNote.favourited;
          await foundNote.save();
          res.status(200).json({ message: "Toggle done." });
        } else {
          return res.status(404).json({ message: "Note not found" });
        }
      } catch (error) {
        console.error("Error: " + error.message);
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      return res.status(400).json({ message: "Invalid ID string" });
    }
  });
});

/******  COLLECTION ***** */

//get all the user collections

app.get("/collections/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const uid = new ObjectId(req.params.uid);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (validateObjectId(uid)) {
      try {
        const response = await Collection.find({ user: uid });
        res.json(response);
      } catch (error) {
        console.error("Error: " + error.message);
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      return res.status(400).json({ message: "Invalid ID string" });
    }
  });
});

//add note to collection
app.patch("/collection/addnotes/:cid/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const uid = new ObjectId(req.params.uid);
  const cid = new ObjectId(req.params.cid);
  const nid = new ObjectId(req.body.noteId);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (
      validateObjectId(uid) &&
      validateObjectId(cid) &&
      validateObjectId(nid)
    ) {
      try {
        const collection = await Collection.findOne({
          _id: cid,
          notes: { $in: [nid] },
        }).exec();

        if (collection) {
          return res
            .status(200)
            .json({ message: "Note already exists in the collection" });
        }

        await Collection.findOneAndUpdate(
          { _id: cid, user: uid },
          { $addToSet: { notes: nid } }
        );

        return res.status(200).json({ message: "Note added successfully" });
      } catch (error) {
        console.error("Error: " + error.message);
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      return res.status(400).json({ message: "Invalid ID string" });
    }
  });
});

//delete note from collection
app.patch("/collection/deletenote/:cid/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const uid = new ObjectId(req.params.uid);
  const cid = new ObjectId(req.params.cid);
  const nid = new ObjectId(req.body.noteId);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (
      validateObjectId(uid) &&
      validateObjectId(cid) &&
      validateObjectId(nid)
    ) {
      try {
        await Collection.findOneAndUpdate(
          { _id: cid, user: uid },
          { $pull: { notes: nid } }
        );
        return res
          .status(200)
          .json({ message: "Note removed from the collection" });
      } catch (error) {
        console.error("Error: " + error.message);
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      return res.status(400).json({ message: "Invalid ID string" });
    }
  });
});

//get all notes in a collection

app.get("/view-collection/:cid/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const cid = new ObjectId(req.params.cid);
  const uid = new ObjectId(req.params.uid);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (!validateObjectId(uid) || !validateObjectId(cid)) {
      return res.status(400).json({ message: "Invalid ID String" });
    }

    try {
      const collection = await Collection.findOne({
        _id: cid,
        user: uid,
      }).populate("notes");

      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }

      res.status(200).json(collection);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

//create collection
app.post("/createCollection", async (req, res) => {
  const token = req.headers.authorization;
  const collectionName = req.body.name;
  const uid = new ObjectId(req.body.userID);
  const imageUrl = req.body.imageUrl;

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (validateObjectId(uid)) {
      const collection = new Collection({
        name: collectionName,
        user: uid,
        image: imageUrl,
      });

      try {
        const savedCollection = await collection.save();
        res.status(200).json({
          success: true,
          message: "Collection Added Successfully!",
          collection: savedCollection,
        });
      } catch (err) {
        console.error("error adding note:", err);
        res.status(500).json({
          success: false,
          message: "Something went wrong, try again!",
        });
      }
    }
  });
});

//delete collection
app.delete("/collection/delete/:cid/:uid", async (req, res) => {
  const token = req.headers.authorization;
  const uid = new ObjectId(req.params.uid);
  const cid = new ObjectId(req.params.cid);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (validateObjectId(uid) && validateObjectId(cid)) {
      await Collection.findOneAndRemove({ _id: cid, user: uid }).then(
        (deletedCollection) => {
          if (deletedCollection) {
            console.log("Collection deleted");
          } else {
            console.log("No collection found or deleted");
          }
        }
      );
    } else {
      console.log("Invalid Id String");
    }
  });
});

//get random unsplash image for collection
const clientId = process.env.UNSPLASH_CLIENT_ID;
const unsplashRoot = "https://api.unsplash.com";

app.get("/randomImage/:query", async (req, res) => {
  const query = req.params.query;

  try {
    const response = await axios.get(
      `${unsplashRoot}/photos/random?query=${query}&client_id=${clientId}`
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch photo data from Unsplash.");
    }
    res.json(response.data.urls.regular);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the image." });
  }
});

/******************** */
app.listen(process.env.PORT || 3001, () => {
  console.log("Server started on port 3001");
});
