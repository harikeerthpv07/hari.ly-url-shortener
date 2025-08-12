import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(" MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
  });
const Schema = mongoose.Schema({
  long_url: String,
  short_code: String,
});

const rateLimitSchema = mongoose.Schema({
  ip_address: String,
  count: Number,
  lastshortened_time: Date,
  max_count: Number,
});

const rateLimit = mongoose.model("rateLimit", rateLimitSchema);

const Url = mongoose.model("Url", Schema);
function generateShortCode() {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
}

const app = express();
app.set("trust proxy", true);

const corsOptions = {
  origin: "https://hari-ly.harikeerth.xyz", // replace with your frontend domain or use "*" for testing
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

// Add this line to explicitly handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

app.use(express.json());

app.post("/shorten", async (req, res) => {
  const url = req.body.url;
  if (!url || url.trim() === "") {
    return res.send("Give a valid input");
  }

  const ip = req.ip;
  const ippresent = await rateLimit.findOne({ ip_address: ip });
  if (ippresent) {
    if (ippresent.max_count > 10) {
      return res.send(
        "Your max limit has finished, this is not a production website, so limited storage :("
      );
    }
    const currentHour = new Date().getHours();
    let slotStartTime = new Date();

    if (currentHour >= 18) {
      slotStartTime.setHours(18, 0, 0, 0);
      if (ippresent.lastshortened_time < slotStartTime) {
        ippresent.count = 3;
      }
      if (ippresent.count <= 0) {
        return res.send(
          "Your limit for this 6-hour slot is finished. you can retry in next slot"
        );
      } else {
        ippresent.count--;
        ippresent.max_count++;
        ippresent.lastshortened_time = new Date();
        await ippresent.save();
      }
    } else if (currentHour >= 12) {
      slotStartTime.setHours(12, 0, 0, 0);

      if (ippresent.lastshortened_time < slotStartTime) {
        ippresent.count = 3;
      }
      if (ippresent.count <= 0) {
        return res.send(
          "Your limit for this 6-hour slot is finished. you can retry in next slot"
        );
      } else {
        ippresent.count--;
        ippresent.max_count++;
        ippresent.lastshortened_time = new Date();
        await ippresent.save();
      }
    } else if (currentHour >= 6) {
      slotStartTime.setHours(6, 0, 0, 0);

      if (ippresent.lastshortened_time < slotStartTime) {
        ippresent.count = 3;
      }
      if (ippresent.count <= 0) {
        return res.send(
          "Your limit for this 6-hour slot is finished. you can retry in next slot"
        );
      } else {
        ippresent.count--;
        ippresent.max_count++;
        ippresent.lastshortened_time = new Date();
        await ippresent.save();
      }
    } else {
      slotStartTime.setHours(0, 0, 0, 0);

      if (ippresent.lastshortened_time < slotStartTime) {
        ippresent.count = 3;
      }
      if (ippresent.count <= 0) {
        return res.send(
          "Your limit for this 6-hour slot is finished. you can retry in next slot"
        );
      } else {
        ippresent.count--;
        ippresent.max_count++;
        ippresent.lastshortened_time = new Date();
        await ippresent.save();
      }
    }
  } else {
    // New user - create their first record
    await rateLimit.create({
      ip_address: ip,
      count: 2, // They're using their first request now
      max_count: 1, // This is their first request total
      lastshortened_time: new Date(),
    });
  }

  let shortCode;
  let exists = true;

  while (exists) {
    shortCode = generateShortCode();
    const found = await Url.findOne({ short_code: shortCode });
    if (!found) {
      exists = false;
    }
  }

  await Url.create({ long_url: url, short_code: shortCode });
  res.send(`https://hari-ly.harikeerth.xyz/${shortCode}`);
});

app.get("/:shortCode", async (req, res) => {
  const shortCode = req.params.shortCode;
  const found = await Url.findOne({ short_code: shortCode });
  if (found) {
    const longUrl = found.long_url;
    res.redirect(longUrl);
  } else {
    res.send("Link not found!");
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running `);
});
