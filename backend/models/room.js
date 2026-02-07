const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')

const RoomSchema = new Schema({
	room_type: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'RoomType',
	},
	room_status: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'RoomStatus',
	},
	// image: {
	//   type: String,
	//   // required: true,
	// },
	room_no: {
		type: String,
		required: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('Room', RoomSchema)
