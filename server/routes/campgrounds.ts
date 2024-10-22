import express from "express";


const router = express.Router();
router.get("/test", (req, res) => {
    res.json({message: "Message recieved!"})
});


export default router