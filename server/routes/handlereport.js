const express = require("express");
const router = express.Router()

router.post("/genreport", async (req, res) => {
    try {
        const { diagnosis,patient,doctor,prescriptions,rx,signature } = req.body;
        console.log(diagnosis,patient,doctor,prescriptions,rx,signature)
        return res.status(200).json({"Message":"Hello" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ "error": "Internal server error" })
    }
})

module.exports=router;