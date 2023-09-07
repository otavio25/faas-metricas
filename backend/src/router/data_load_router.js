const express = require('express')
const router = express('router')
const data_load_controller = require('../controller/data_load_controller')

router.post("/dataload", data_load_controller.data_load)
router.post("update/data", data_load_controller.update_data)
router.get("/metrics", data_load_controller.get_metrics_papers_aws)

module.exports = router