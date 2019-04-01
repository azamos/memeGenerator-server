const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'memeGeneratorApp';
const client = new MongoClient(url);
const maxLimit = 101;

function write(thingsToWrite, whereToWrite) {
    if (thingsToWrite === undefined || thingsToWrite === null) {
        return null;
    }
    return client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection(whereToWrite);
            collection.createIndex({ aliases: 'text' },{unique:false});//I specify that aliases is 'text' to allow text searches
                                                                      //unique:false because dups, for example: bluebird123 and bluey645
            collection.createIndex('name',{unique:true});
            return collection.insertMany(thingsToWrite)
        })
        .catch(err => console.log(err));
}

function read(whereToFindIt, thingToFind) {
    return client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection(whereToFindIt);
            if (thingToFind) {
                if(thingToFind.from && thingToFind.to && parseInt(thingToFind.to - thingToFind.from)< maxLimit){
                    
                    return collection.find().skip(parseInt(thingToFind.from)).limit(parseInt(thingToFind.to - thingToFind.from)).toArray();
                }
                return collection.find({aliases:thingToFind}).toArray()
                //return collection.find({ $text: { $search: thingToFind } }).toArray()
            }
            return collection.find({}).toArray()
        })
        .catch(err => console.log(err));
}

module.exports = {
    write,
    read
}
