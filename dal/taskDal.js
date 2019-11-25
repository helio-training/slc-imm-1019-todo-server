var mongoose = require('mongoose');



const testConnection = () => {
    console.log('Testing Connection')
    
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("Wow Connected!")
    });
} 

module.exports = {
    testConnection
}
