const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    userId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String
},
{
    timestamps: true
}
)
module.exports =  mongoose.model('Address', AddressSchema)

//this is for giving a custom collection naming e.g -> myAddress in mongoDB collection
// module.exports =  mongoose.model('Address', AddressSchema, 'myAddress')