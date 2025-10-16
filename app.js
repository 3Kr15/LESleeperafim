const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 44223;
const staticMiddleware = express.static("public");
let usageDataStore = {}; // memory storage for usage data

app.use(staticMiddleware);
app.use(express.json()); // parse JSON body
app.use(cors({ origin: '*' })); // allow all origins for demo purposes

// Endpoint where extension POSTS usage
app.post('/api/usage', (req, res) => {
    const usageData = req.body;
    console.log('Received usage data:', usageData);

    // Merge into store
    usageDataStore = { ...usageDataStore, ...usageData };
    res.json({ status: 'ok' });
});

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Endpoint where dashboard GETs usage
app.get('/api/usage', (req, res) => {
   const response = {};
    for (const [domain, ms] of Object.entries(usageDataStore)) {
        response[domain] = Math.round(ms / 1000);
    }
    // clear after sending
    usageDataStore = {};
    res.json(response);
});

app.listen(port, async () => {
    try {
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    process.exit(0);
});