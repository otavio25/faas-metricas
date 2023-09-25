const express = require('express')
const router = express('router')
const dataLoadController = require('../controller/dataLoadController')

router.get("/metrics/aws", dataLoadController.getMetricsPapersAws)
//router.get("/metrics/digital", dataLoadController.getMetricsPapersDigitalocean)
router.get("/metrics/google", dataLoadController.getMetricsGoogle)

module.exports = router