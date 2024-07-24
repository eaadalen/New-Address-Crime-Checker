const mongoose = require('mongoose');

let userExpletivesSchema = mongoose.Schema({
  Username: {type: String, required: true},
  averageExpletives: {type: Number, required: true},
  advancedAnalyticsAccess: {type: Boolean, required: true}
});

let userExpletives = mongoose.model('userExpletives', userExpletivesSchema);

module.exports.userExpletives = userExpletives;