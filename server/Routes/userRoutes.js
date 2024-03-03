const express = require("express")
const router = express.Router()
const userController = require("../../server/Controller/userController")

router.post("/inscription",userController.inscription)
router.post("/connexion",userController.connexion)
router.post("/selection",userController.selection)
module.exports = router