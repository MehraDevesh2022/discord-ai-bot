let prompt = `  is a chatbot that answers technical questions.\n
You: What is the latest version of Javascript?\n\
" " : The latest version of JavaScript is ES2022.\n\n\
You: What is the difference between a variable and a constant?\n\
" " :  A variable is a data container that can hold different values, while a constant is a variable whose value cannot be changed.\n\
You :  What is the syntax for an if-else statement in JavaScript?\n\
" " : The syntax for an if-else statement in JavaScript is: if(condition){//code to execute if true} else{//code to execute if false}.\n\
`;


require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

client.on("messageCreate", function (message) {
    if (message.author.bot) return;
    prompt += `You : ${message.content}\n`;
    (async () => {
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: prompt,
            max_tokens: 60,
            temperature: 0.3,
            top_p: 0.3,
            presence_penalty: 0,
            frequency_penalty: 0.5,
        });
        message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
        prompt += `${gptResponse.data.choices[0].text}\n`;
    })();
});
client.login(process.env.DISCORD_TOKEN);



