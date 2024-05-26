import dotenv from 'dotenv';
import path from 'path';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from 'zod';

const __dirname = path.resolve();
const projectRoot = path.resolve(__dirname, '../../');
const envPath = path.join(projectRoot, '.env');
dotenv.config({ path: envPath });

const { GROQ_API_KEY } = process.env;

const groqConfig = {
    apiKey: GROQ_API_KEY,
    // model: 'mixtral-8x7b-32768',
    model: 'llama3-70b-8192'
};
const model = new ChatGroq(groqConfig);

const languageSchema = z.object({
    language: z.string()
});

const zTestOpbject = z.object({
    name: z.string(),
    age: z.number(),
    city: z.string(),
    languages: z.array(languageSchema)
});

const testObject = {
    name: 'Van Der Vaart',
    age: 32,
    city: 'Софиа',
    languages: [
        { language: 'Онглийски' },
        { language: 'Изпански' },
        { language: 'Роски' },
    ]
};

const strObject = JSON.stringify(testObject, null, 2);

const promptTmpl = new PromptTemplate({
    inputVariables: ["language", "object"],
    template: "Please check the values of the following object for typos. The language is {language}. Return only corrected json object as response:\n \ \n {object}",
});

const formattedPromptTmpl = await promptTmpl.format({
    language: "Български",
    object: strObject,
});

console.log("formattedPrompt: ", formattedPromptTmpl);


const structuredLlm = model.withStructuredOutput(zTestOpbject);

const response = await structuredLlm.invoke(formattedPromptTmpl);
console.log('Response: ', response);

