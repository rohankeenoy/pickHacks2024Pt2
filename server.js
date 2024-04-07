const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db.js');
const urlsPP = require('./models/urlsPP.js');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const openAI = require("openai")

// Importing and setting up the OpenAI API client
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



connectDB();

const Url = mongoose.model('Url', urlsPP);


app.use(bodyParser.json());
app.use(cors());

// Test endpoint
app.get('/', (req, res) => {
    res.send("Your server is running!");
});

/****************POST****************** */
// This endpoint is for the chrome extension instance
// this end point is for the chrome instance


app.post('/ce', async (req, res) => {

    try {
        // Extract data from the request body
        const { user, url, pp } = req.body;

        ///// MODEL CODE ///////
       


// Use a model from OpenAI (assuming "text-embedding-ada-002" exists for this example)
const modelName = 'gpt-3.5-turbo';

async function main() {
    console.log("Welcome to Chatbot! Type 'quit' to exit.");

    let userInput = "Respond with First Party Collection/Use, Third Party Sharing/Collection,User Choice/Control,  User Access/ Edit and Deletion, Data Retention, Data Security, Policy Change, Do Not Track, International and Specific Audiences, or Other and nothing else.Given the following information: ", pp;
    while (userInput.toLowerCase() !== "quit") {
        //userInput = prompt("You: ");

        if (userInput.toLowerCase() !== "quit") {
            const response = await getCompletion(userInput); // Pass userInput as an argument
            console.log('Chatbot: ${response}');
        }
    }
}

async function getCompletion(prompt) {
    try {
        const completion = await openai.complete({
            engine: modelName,
            messages: [
                { role: 'system', content: prompt },
               
            ]
        });
        
        const responseData = JSON.parse(completion.choices[0].message.json());
        return responseData.content;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

main();
        
        ////// MODEL CODE END ///////
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Error saving url and pp to the database.');
    }
});



// model logic for calling the model 
// after the string is returned from model. IT MUST ADD TO CORRECT 
// USER URL PREDICTION INSTANCE




//gets for website to use
app.get('/getUserData', async (req, res) => {
    try {
        
        const { user } = req.query;

        if (!user) {
            return res.status(400).send('User parameter is required.');
        }
        const userData = await Url.find({ user: user });

        if (!userData || userData.length === 0) {
            return res.status(404).send('No data found for this user.');
        }
        const responseData = userData.map(entry => ({
            url: entry.url
            //predictions: entry.predictions
        }));

        // Send the response containing URL and predictions for the user
        res.send(responseData);
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// for every unique url return predictions, for showing histogram 
app.get('/getAllUserData', async (req, res) => {
    try {
        const uniqueUrls = await Url.distinct('url');
        const predictionsData = [];
        for (const url of uniqueUrls) {
            const predictions = await Url.find({ url }, 'predictions');
            if (predictions.length > 0) {
                predictionsData.push({ url, predictions });
            }
        }

        // Send the predictionsData array as the response
        res.send(predictionsData);
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
