const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.joifp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const profilesCollection = client.db("loan-application-site").collection("profiles");
        const businessDetailsCollection = client.db("loan-application-site").collection("businessDetails");
        const applicationCollection = client.db("loan-application-site").collection("applicationInfos");


        app.get('/profile/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const profile = await profilesCollection.findOne(query);

            return res.send(profile);
        })

        app.put('/profile/:email', async (req, res) => {
            const email = req.params.email;
            const profile = req.body;
            const filter = { email: email };
            const options = { upsert: true };

            // console.log(profile)

            const updateDoc = {
                $set: {
                    name: profile.name,
                    age: profile.age,
                    mobile: profile.mobile,
                    email: profile.email,
                    location: profile.location
                },
            };
            const result = await profilesCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        })

        app.get('/business/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const business = await businessDetailsCollection.findOne(query);

            return res.send(business);
        })

        app.put('/business/:email', async (req, res) => {
            const email = req.params.email;
            const business = req.body;
            const filter = { email: email };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    email: business.email,
                    businessName: business.businessName,
                    gst: business.gst,
                    address: business.address,
                    businessEmail: business.businessEmail
                },
            };
            const result = await businessDetailsCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        })

        app.get('/applications/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const applications = await applicationCollection.findOne(query);

            return res.send(applications);
        })

        app.put('/applications/:email', async (req, res) => {
            const email = req.params.email;
            const applications = req.body;
            const filter = { email: email };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    email: applications.email,
                    amount: applications.amount,
                    interest: applications.interest,
                    tenure: applications.tenure,
                    monthlyPayment: applications.monthlyPayment
                },
            };
            const result = await applicationCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my node Loan Application server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});
