let prompt = ` X is a chatbot that answers technical questions.\n
You: What is the latest version of Javascript?\n\
 X : The latest version of JavaScript is ES2022.\n\n\
You: What is the difference between a variable and a constant?\n\
X  :  A variable is a data container that can hold different values, while a constant is a variable whose value cannot be changed.\n\
You :  What is the syntax for an if-else statement in JavaScript?\n\
 X : The syntax for an if-else statement in JavaScript is: if(condition){//code to execute if true} else{//code to execute if false}.\n\
`;


require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { Configuration, OpenAIApi } = require("openai");

// Create new OpenAI Configuration object with API key
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});

// Initialize OpenAIApi object with Configuration
const openai = new OpenAIApi(configuration);

// Event handler for when a message is created
client.on("messageCreate", function (message) {
    // Check if message is sent by bot, if so, return
    if (message.author.bot) return;

    // Append user's message to the prompt
    prompt += `You : ${message.content}\n`;

    // Async function to generate response from OpenAI and reply to message
    (async () => {
        // Create completion with specified parameters
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: prompt,
            max_tokens: 60,
            temperature: 0.3,
            top_p: 0.3,
            presence_penalty: 0,
            frequency_penalty: 0.5,
        });

        // Reply to message with generated text
        message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);

        // Append generated text to prompt
        prompt += `${gptResponse.data.choices[0].text}\n`;
    })();
});

// Login to Discord with provided token
client.login(process.env.DISCORD_TOKEN);
console.log('Your bot is  working now..');