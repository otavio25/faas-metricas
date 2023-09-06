const mongoose = require('../database/index')

const PapersSchema = new mongoose.Schema ({
    _id: String,
    databases: Array,
    limit: Number,
    limit_per_database: Number,
    number_of_papers: Number,
    number_of_papers_by_database: Object,
    papers: Array,
    processed_at: String,
    publication_types: String,
    query: String,
    since: String,
    until: String
})

const papers = mongoose.model('papers', PapersSchema)

module.exports = papers