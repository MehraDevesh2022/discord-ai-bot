# Unleashing the Power of GPT-3 for a Smarter Discord Chatbot
![MasterHead](/utils/gif.gif) < br >

HI! In this project, we will be building a **Discord**. Chatbot that utilizes **OpenAI's GPT-3** language model to generate human-like responses to user input. This bot can be integrated into any Discord server to add a technical and intelligent conversational element to the community..

##  Prerequisites

-   A Discord account and server where the bot will be hosted
-   A OpenAI API key with access to GPT-3
-   Node.js and npm installed on your machine

## Create a new Node.js project
1.  Open your terminal and navigate to the directory where you want to create your project.
2.  Run the command `npm init` to initialize a new Node.js project.
3.  Install the following libraries by running the following commands:

```markdown
npm install discord.js
npm install openai
 npm install dotenv
```

##  Create a `.env` file
1.  Create a new file in your project directory called `.env`.
2.  Add the following lines to the file, replacing the placeholders with your own values:

```markdown
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
 OPENAI_KEY=YOUR_OPENAI_API_KEY
```
## Discord Bot Setup
-  Create a Discord account and create a server where the bot will be hosted.
- Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.

![MasterHead](./gif/me.gif)<br>

- You can change your avatar however you like

![MasterHead](./gif/me.gif)<br>

-  Create a new bot for the application by clicking on the **Add Bot** button.

![MasterHead](./gif/me.gif)<br>

- Under the **Build-A-Bot** section, you should see the option to reveal your hidden token. Click **Copy** to copy your token and store it in `.env` file.

![MasterHead](./gif/me.gif)<br>

- In the `.env` file, add the following line `DISCORD_TOKEN  = YOUR_DISCORD_BOT_TOKEN` and replace `YOUR_DISCORD_BOT_TOKEN` with the token of your bot.
-  Now scroll down and enable the **Message Content Intent**

![MasterHead](./gif/me.gif)<br>

Next On the left hand side, click **OAuth2** and you should be redirected to the OAuth2 menu as seen below:

![MasterHead](./gif/me.gif)<br>

- Place your Client ID in the URL below in place of **Client_Id** and paste it in your browser's address bar.
   https://discord.com/oauth2/authorize?scope=bot&permissions=&client_id=YOUR_CLIENT_ID
- This link, containing your **Client Id**, will redirect you to a dialog box to authorize your bot to join a server of your choice. Select the server you want your bot to join, then click on the Authorize button.
- After successful captcha verification, your chatbot is now connected to your server, but it's currently offline and not responding to any commands.

##  Create an OpenAI API Key
-  Log in to the [OpenAI Console](https://beta.openai.com/account/api-keys) using your OpenAI account.
- Click on the **Create API Key** button to create a new API key.
- Click on the **Copy** button to copy the API key. Keep this key safe as it will be used later in the code.

## Create the code for the chatbot
1.  Create a new file in your project directory called `index.js`.
2. First, we are going to import the necessary modules for our project. We will be using the `discord.js` library to interact with the Discord API, and the `openai` library to interact with the OpenAI API. We will also be using the `dotenv` library to securely store our API keys.
3.  Add the following code to the file, replacing the placeholders with your own values: 

```javascript
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: 
    [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});
const { Configuration, OpenAIApi } = require("openai");

// Create new OpenAI Configuration object with API key
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});

// Initialize OpenAIApi object with Configuration
const openai = new OpenAIApi(configuration);
```
4. This code is used to set up the Discord bot and the OpenAI API.
5. First, we import the `dotenv` package, which allows us to access environment variables stored in a `.env` file. We then use the `config()` function to read the variables in the file.
6. Next, we will create a variable `prompt` that will hold the conversation context for our chatbot. The variable will be updated every time a user sends a message to the chatbot.
7. Next, we import the `discord.js` package, which is the library used to interact with the Discord API. We also import the `Client` class and the `GatewayIntentBits` enum from the package. We create an instance of the `Client` class, passing in an options object that specifies the intents we want to use. These intents determine the type of events that the bot will listen for. In this case, we are using `Guilds`, `GuildMessages`, and `MessageContent` intents.
8. After that, we import the `Configuration` and `OpenAIApi` classes from the `openai` package. We use the `Configuration` class to set up the API with our API key, which is stored in the `.env` file and accessed via the `process.env.OPENAI_KEY` variable. We then create an instance of the `OpenAIApi` class and pass in the configuration object. This allows us to use the OpenAI API in our code and make requests to the API.
9. Next, we will create a variable `prompt` that will hold the conversation context for our chatbot. The variable will be updated every time a user sends a message to the chatbot.

```javascript
let prompt = ` X is a chatbot that answers technical questions.\n
You: What is the latest version of Javascript?\n\
 X : The latest version of JavaScript is ES2022.\n\n\
You: What is the difference between a variable and a constant?\n\
X  :  A variable is a data container that can hold different values, while a constant is a variable whose value cannot be changed.\n\
You :  What is the syntax for an if-else statement in JavaScript?\n\
 X : The syntax for an if-else statement in JavaScript is: if(condition){//code to execute if true} else{//code to execute if false}.\n\
`;
```
10. We will then create an event listener that will listen for new messages in the Discord server. When a new message is received, the event listener will be triggered and the message will be processed.

```javascript
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
```
11. Here, we are checking if the message is from a bot. If it is, we return and do not process the message. If not, we add the user's message to the `prompt` variable and call the OpenAI API using the `openai.createCompletion()` function. We pass in several parameters such as the model we want to use, the conversation context in the `prompt` variable, and parameters such as the *maximum number of tokens*, *temperature*, and *penalties*.
12. The API returns a response, which we then use to reply to the user's message. We use the `message.reply()` function to send the response back to the user. We also update the `prompt` variable with the bot's response. 
13. Finally, we use the `client.login()` function to log in to our Discord bot using the token we stored in our `.env` file.

     And that's it! With these steps, you should now have a working chatbot powered by OpenAI's GPT-3 model running on your Discord server. You can continue to customize and improve the chatbot by experimenting with different models, parameters, and conversation context. 


## Conclusion
By following these steps, you now have a functional Discord chatbot powered by OpenAI's GPT-3 language model. This bot can be integrated into any Discord server to add a fun and intelligent conversational element to the community.

Note that OpenAI's GPT-3 is a paid service so you may want to explore the pricing plans and test the model with the free trials before using it in production.





