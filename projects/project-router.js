const express = require("express")

const db = require("../data/helpers/projectModel")

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const projects = await db.get(req.query)
        res.status(200).json(projects)
    } catch(error) {
        console.log(error);
    res.status(500).json({
      message: "The posts information could not be retrieved"
    });  
    }
})