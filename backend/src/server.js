require("dotenv").config({ silent: true });
const app = require("./app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
