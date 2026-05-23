const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

let latestECG = {
bpm: 0,
ecg: 0,
condition: "NORMAL",
timestamp: Date.now(),
};

app.post("/api/ecg", (req, res) => {

latestECG = req.body;

console.log(latestECG);

res.json({
success: true
});

});

app.get("/api/latest", async (req, res) => {

latestECG.ecg =
2000 +
Math.floor(Math.sin(Date.now() / 100) * 300) +
Math.floor(Math.random() * 100);

latestECG.bpm =
70 + Math.floor(Math.random() * 20);

if (latestECG.bpm > 100) {


latestECG.condition = "TACHYCARDIA";


} else if (latestECG.bpm < 60) {


latestECG.condition = "BRADYCARDIA";


} else {


latestECG.condition = "NORMAL";


}

latestECG.timestamp = Date.now();

let mlPrediction = {
prediction: "Unknown",
confidence: 0
};

try {


const ecgArray = Array(187).fill(latestECG.ecg);

const mlResponse = await axios.post(
  "http://127.0.0.1:8000/predict",
  {
    ecg: ecgArray
  }
);

mlPrediction = mlResponse.data;


} catch (err) {


console.log(err.message);


}

res.json({
bpm: latestECG.bpm,
ecg: latestECG.ecg,
condition: latestECG.condition,
timestamp: latestECG.timestamp,
aiPrediction: mlPrediction.prediction,
confidence: mlPrediction.confidence
});

});




app.listen(PORT, () => {

console.log(`Server running on port ${PORT}`);

});
