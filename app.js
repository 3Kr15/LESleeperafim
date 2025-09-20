const express = require("express");
const app = express();
const port = process.env.PORT || 44223;
const staticMiddleware = express.static("public");
app.use(staticMiddleware);  


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