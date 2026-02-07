const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const amenitySchema = ({

	name: {
		type: String,
		required: true
	},
	room_type: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'RoomType',
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	}

})


module.exports = mongoose.model('amenity', ammenitySchema);

