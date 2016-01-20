/***************************
* logger_model.js
*
* defines the JSON schema for the loggers and log entries
****************************/

var mongoose = require('mongoose');

// Schema : logger
var LoggerSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
	name: String,
    max_entries: { type: Number, default: 0 },
    total_days_stored: { type: Number, default: 0 },
    archive_location: String,
    archive_period: { type: String, enum: ['day','hour','week','max']},
    last_seq: { type: Number, default: 0 }
});

var LogEntrySchema = new mongoose.Schema({
	id: mongoose.Schema.Types.ObjectId,
	logger_id: mongoose.Schema.Types.ObjectId,
	timestamp: Date,
	level: { type: String, enum: ['Critical','Warning','Notice','Info','Debug']},
	source_ip: String,
	source_name: String,
	source_sequence: Number,
	message_group: String,
	message: String,
});

module.exports = mongoose.model('logger', LoggerSchema);
module.exports = mongoose.model('log_entry', LogEntrySchema);