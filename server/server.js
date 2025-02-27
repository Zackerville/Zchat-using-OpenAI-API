// import express from 'express';
// import * as dotenv from 'dotenv'
// import axios from 'axios';
// import cors from 'cors'
// import {Configuration, OpenAIApi} from 'openai'

// dotenv.config();

// const axiosInstance = axios.create({
//     baseURL: "https://api.openai.com/v1",
//   });
  

// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// }); 

// const openai = new OpenAIApi(configuration);

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get('/', async (req, res) => {
//     res.status(200).send({
//         message: "Hello World!",
//     })
// })

// app.post('/', async (req, res) => {
//     try
//     {
//         const prompt = req.body.prompt;
//         const response = await openai.createCompletion({
//             model: "gpt-4",
//             prompt: `${prompt}`,
//             temperature: 0, // Higher values means the model will take more risks.
//             max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
//             top_p: 1, // alternative to sampling with temperature, called nucleus sampling
//             frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
//             presence_penalty: 0,
//         });

//         res.status(200).send({
//             bot: response.data.choices[0].text
//         })
//     }
//     catch (error)
//     {
//         console.log(error);
//         res.status(500).send({error})
//     }
// })

// app.listen(5000, () => console.log('Server is running on http://localhost:5000'));



import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
console.log("API Key:", process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  console.error("Error: Missing OpenAI API Key in .env file");
  process.exit(1);
}

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({ message: "Hello World!" });
});

app.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).send({ error: "Invalid prompt. Please provide a valid string." });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0125",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error during OpenAI API call:", error.message);
    res.status(500).send({
      error: error.response?.data || "An internal server error occurred.",
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
