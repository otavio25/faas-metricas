const express = require('express')
const router = express('router')
const dataLoadController = require('../controller/dataLoadController')

router.post("/dataload", dataLoadController.dataLoad)
router.post("/update/data", dataLoadController.updateData)
router.get("/metrics", dataLoadController.getMetricsPapersAws)

module.exports = router