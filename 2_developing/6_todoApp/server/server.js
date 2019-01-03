// I. real import
let express = require('express');
let bodyParser = require('body-parser');
let {ObjectID} = require('mongodb');


// II. local Imports
// hier wird mehr strukturiert und eine Folderstruktur aufgebaut
// hier wird die ausgelagerte mongoose Konfiguratiuon eingebaut!
let {mongoose} = require('./db/mongoose');
// ausgelagerten Model importieren
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

//preparation for heroku
const port = process.env.PORT || 3000;

// Express
let app = express();

// Defining Middleware with app.use
app.use(bodyParser.json());

// POST
app.post('/todos', (req, res) => {
    //console.log(req.body);
    let todo = new Todo({
        text: req.body.text
    });

    // in Datenbank speichern
    todo.save().then( (doc) => {
        res.send(doc);
    }, (e) => { 
        //console.log('ERROR!', e);
        res.status(400).send(e);
    });
});

// GET
app.get('/todos',  (req, res) => {
    Todo.find().then( (todos) => {
        res.send({todos});
    }, (e) => {
        //console.log('ERROR!', e);
        res.status(400).send(e);
    });
});

// GET:id  -- mehrmals probieren bis es funzt!
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) { 
        return res.status(404).send();
    }

    Todo.findById(id).then( (todo) => {
        if (!todo) {
        res.status(404).send();
        }

        // happy path
        res.send({todo});

    }).catch( (e) => {
        res.status(400).send(e);
    });
  
});




app.listen(port, () => { 
    console.log(`Started on port ${port}!`);
});
 


// Muster
/* in Datenbank speichern
todo.save().then( () => {

}, (e) => { 

});
*/

// important for Tests
module.exports = {app};