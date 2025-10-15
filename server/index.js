const express= require("express")
const app = express()
const cors= require("cors");

// server();
require('dotenv').config();
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
  return res.status(200).json({"run":"Your code is running"});
});
app.use("/api/v1/gen",require("./routes/handlereport"))
app.listen(process.env.PORT,()=>{
    // console.log(process.env.FRONTEND_URL);
    console.log(`the app is run in ${process.env.PORT} port `);
});