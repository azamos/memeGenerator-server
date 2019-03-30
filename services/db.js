const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'memeGeneratorApp';
const client = new MongoClient(url);

function write(thingsToWrite, whereToWrite) {
    if (thingsToWrite === undefined || thingsToWrite === null) {
        return null;
    }
    return client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection(whereToWrite);
            collection.createIndex({aliases:'text'},{unique:true});//I specify that name is 'text' to allow text searches
            return collection.insert(thingsToWrite)
        })
        .catch(err => console.log(err));
}

function read(whereToFindIt, thingToFind = {}) {
    return client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection(whereToFindIt);
            return collection.find( { $text: { $search: thingToFind } }).toArray()
        })
        .catch(err => console.log(err));
}

module.exports = {
    write,
    read
}
