const express = require('express')
const router = express('router')
const dataLoadController = require('../controller/dataLoadController')

router.get("/metrics/aws", dataLoadController.getMetricsPapersAws)

module.exports = router