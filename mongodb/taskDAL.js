const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
// const assert = require('assert');
// require('dotenv').config()

// Connection URL
const url = process.env.DATABASE_URL

// Database Name
const dbName = 'todo';
const settings = {
    useUnifiedTopology: true
}

const testConnection = () => {
    const iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                // assert.equal(null, err);
                reject(err)
            } else {
                const db = client.db(dbName);
                // console.log("client", client)
                // console.log("db", db)
                client.close();
                resolve("Connected successfully to server")
            }
        });
    })
    return iou
}

const createTask = (task) => {
    // Use connect method to connect to the server
    let iou = new Promise((resolve, reject) => {

        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            }
            else {
                console.log("Connected to server for Creation of Task");
                const db = client.db(dbName);
                // Get the tasks collection
                const collection = db.collection('tasks');
                // Insert a document
                collection.insertOne(task, function (err, result) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        client.close();
                        resolve("Inserted a task into the collection");
                    }

                });
            }
        })
    });
    return iou
}

const createList = (list) => {
    // Use connect method to connect to the server
    let iou = new Promise((resolve, reject) => {

        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            }
            else {
                console.log("Connected to server for Creation of List");
                const db = client.db(dbName);
                // Get the lists collection
                const collection = db.collection('lists');
                // Insert a document
                collection.insertOne(list, function (err, result) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        client.close();
                        resolve("Inserted a list into the collection");
                    }

                });
            }
        })
    });
    return iou
}

const readTasks = () => {
    let iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            } else {
                console.log("Connected to server Read tasks");

                const db = client.db(dbName);
                // Get the tasks collection
                const collection = db.collection('tasks');
                // Find some documents
                collection.find({}).toArray(function (err, docs) {
                    if (err) {
                        reject(err)
                    } else {
                        const results = {
                            data: docs,
                            msg: "Found the following records"
                        }

                        client.close();
                        resolve(results);
                    }
                });
            }
        });
    })
    return iou;
}

const readTasksByListID = (id) => {
    let iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            } else {
                console.log("Connected to server Read tasks by ListID");

                const db = client.db(dbName);
                // Get the tasks collection
                const listsCollection = db.collection('lists');
                // Find some documents
                listsCollection.find({ _id: ObjectId(id) }).toArray(function (err, docs) {
                    if (err) {
                        reject(err)
                    } else {
                        if(docs.length){
                            const results = docs[0].todos.map( async (p) => {
                                return await readTaskById(p)
                            })
                            
                            client.close();
                            resolve(results);
                        } else{
                          reject("No List found")
                        }
                    }
                });
            }
        });
    })
    return iou;
}

const readTaskById = (id) => {
    let iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            } else {
                console.log("Connected to server Read Contacts");

                const db = client.db(dbName);
                // Get the tasks collection
                const collection = db.collection('tasks');
                // Find some documents
                collection.find({ _id: ObjectId(id) }).toArray(function (err, docs) {
                    if (err) {
                        reject(err)
                    } else {
                        const results = {
                            data: docs,
                            msg: "Found the following records"
                        }

                        client.close();
                        resolve(results);
                    }
                });
            }
        });
    })
    return iou;
}

const readLists = () => {
    let iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            } else {
                console.log("Connected to server Read Lists");

                const db = client.db(dbName);
                // Get the tasks collection
                const collection = db.collection('lists');
                // Find some documents
                collection.find({}).toArray(function (err, docs) {
                    if (err) {
                        reject(err)
                    } else {
                        const results = {
                            data: docs,
                            msg: "Found the following records"
                        }

                        client.close();
                        resolve(results);
                    }
                });
            }
        });
    })
    return iou;
}

const readListByID = (id) => {
    let iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            } else {
                console.log("Connected to server Read Lists");

                const db = client.db(dbName);
                // Get the tasks collection
                const collection = db.collection('lists');
                // Find some documents
                collection.find({ _id: ObjectId(id) }).toArray(async function (err, docs) {
                    if (err) {
                        reject(err)
                    } else {
                        if(docs.length){
                            const todos = await readTasksByListID(id) 
                            const results = {
                                data: {
                                    todos,
                                    _id: docs[0]._id,
                                    title: docs[0].title
                                },
                                msg: "Found the following records"
                            }
                            client.close();
                            resolve(results);
                        }else {
                            reject('No List Found')
                        }
                    }
                });
            }
        });
    })
    return iou;
}

const updateTask = async(id) => {
    const task = await readTaskById(id);
    let iou = new Promise((resolve, reject) => {

        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            }
            else {
                console.log("Connected to server to Update a Task");

                const db = client.db(dbName);
                // Get the contacts collection
                const collection = db.collection('tasks');
                // Insert a document
                collection.updateOne({ '_id': ObjectId(id) },
                    { $set: {completed: !task.completed} },
                    function (err, result) {
                        if (err) {
                            reject(err)
                        } else {
                            client.close();
                            resolve("Updated a record in the collection");
                        }
                    });
            }
        });
    })
    return iou
}

