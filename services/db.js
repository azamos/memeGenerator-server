const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'memeGeneratorApp';
const client = new MongoClient(url);

function write(thingsToWrite, whereToWrite) {
    if (thingsToWrite === undefined || thingsToWrite === null) {
        return null;
    }
    //thingsToWrite instanceof Array ? thingsToWrite = thingsToWrite
    //: thingsToWrite = [thingsToWrite];
    return client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection(whereToWrite);
            collection.createIndex('name',{unique:true});
            return collection.insert(thingsToWrite)
        })
        //.then(res => JSON.stringify(res.ops))
        .catch(err => console.log(err));
}

function read(thingToFind = {}, whereToFindIt) {
    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection(whereToFindIt);
            collection.find(thingToFind)
        })
        .catch(err => console.log(err));
}

module.exports = {
    write,
    read
}
