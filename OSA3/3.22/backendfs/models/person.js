const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
console.log('Connecting to', url);

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error.message));

const phoneRegex = /^(\d{2,3})-\d{5,}$/;

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    validate: {
      validator: (v) => phoneRegex.test(v),
      message: props => `${props.value} is not a valid phone number! It must be in format XX-XXXXXXX or XXX-XXXXXXXX`
    },
    required: [true, 'Phone number is required']
  }
});

module.exports = mongoose.model('Person', personSchema);
