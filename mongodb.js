const { MongoClient } = require("mongodb");

async function listDatabases(client) {
  databaseList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databaseList.databases.forEach((db) => console.log(`- ${db.name}`));
}

async function createDocument(client, data) {
  const result = await client.db("auth").collection("new").insertMany(data);
  console.log(result);
  //   console.log(`New listings Id is : ${result.insertId}`);
}

async function findOne(client, query) {
  const result = await client
    .db("auth")
    .collection("new")
    .findOne({ name: query });
  if (result) {
    console.log("The listing has been found:");
    console.log(result);
  } else {
    console.log("No such name exit");
  }
}

async function find(client, query) {
  const cursor = await client
    .db("auth")
    .collection("new")
    .find({
      age: { $gte: query },
    })
    .sort({ age: 1 })
    .limit(4);
  const results = await cursor.toArray();
  console.log(results);
}

async function main() {
  const url =
    "mongodb+srv://termi9929:GfLSFP0QdcoQkBlW@cluster0.d1rtgbe.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  try {
    await client.connect();
  } catch (e) {
    console.log(e);
  }
  //   await listDatabases(client);
  const data = [
    {
      name: "Priyank",
      age: 26,
    },
    {
      name: "muskan",
      age: 23,
    },
    {
      name: "manu",
      age: 23,
    },
  ];
  //   await createDocument(client, data);
  //   await findOne(client, "Mohit");
  await find(client, 23);
  await client.close();
}
main().catch(console.error);
