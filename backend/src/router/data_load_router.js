const express = require('express')
const router = express('router')
const data_load_controller = require('../controller/data_load_controller')

router.post("/dataload", data_load_controller.dataLoad)
router.post("/update/data", data_load_controller.updateData)
router.get("/metrics", data_load_controller.getMetricsPapersAws)

module.exports = router