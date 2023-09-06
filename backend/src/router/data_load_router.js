const express = require('express')
const router = express('router')
const data_load_controller = require('../controller/data_load_controller')

router.post("/dataload", data_load_controller.data_load)

module.exports = router