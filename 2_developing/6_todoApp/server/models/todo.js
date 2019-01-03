let mongoose = require('mongoose');

// Mongoose arbeitet mit Models vgl Gettter & Setter in JAVA
// check validations https://mongoosejs.com/docs/validation.html
let Todo = mongoose.model('Todo', { 
    text:         { type: String, 
                    required: true, 
                    minlength: 1, 
                    trim: true },
    completed:  {type: Boolean,
                 default: false },
    completedAt:    { type: Number,
                     default: '' }   // kein null erzeugt Fehler im Test sheet !
});


module.exports = {Todo};