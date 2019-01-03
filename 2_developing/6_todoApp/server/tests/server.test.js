const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// funuzt noch nicht sauber nur ERRORS ! muss irgenetwas aktualierst werden
// habe ich getan nun funzt es sauber !!! sehr guter Ansatz jetzt !!
// funzt auch nicht Abschnitt 7 ist der beste Part !!
const todos = [{_id: new ObjectID(),
                text: 'First test todo'},
               {_id: new ObjectID(),
                text: '2nd test todo'}];


// löscht die Datenbank vor dem test
beforeEach( (done) => {
    Todo.deleteMany({}).then( () => {
       return Todo.insertMany(todos);
    }).then( () => done() );
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        let text = 'Testlauf';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end( (err, res) => {
                if (err)  { 
                    return done(err);
                };

                // Datenbank Test Überprüfung, aber mit {text bezieht es sich nur auf dieobig Var
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a new todo with invalid body data', (done) => {
        
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end( (err, res) => {
                if (err)  { 
                    return done(err);
                };

                // Datenbank Test Überprüfung
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});


describe('GET /todos', () => {

    it('should get all todos', (done) => {
        
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });

});

describe('GET /todos/:id', () => {

    it('should return todo doc', (done) => {
        
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        
        request(app)
            .get('/todos/1234567abc')
            .expect(404)
            .end(done);
    });

});
