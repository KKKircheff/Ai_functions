import {ChatGroq} from '@langchain/groq';
import {HumanMessage, SystemMessage} from '@langchain/core/messages';
import {StringOutputParser} from '@langchain/core/output_parsers';
import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve();
const projectRoot = path.resolve(__dirname, '../../');
const envPath = path.join(projectRoot, '.env');
dotenv.config({path: envPath});

const {GROQ_API_KEY} = process.env;

const groqConfig = {
    apiKey: GROQ_API_KEY,
    model: 'mixtral-8x7b-32768',
    temperature: 0,
};

const model = new ChatGroq(groqConfig);

const parser = new StringOutputParser();

const messages = [
    new SystemMessage('Translate the following from English into Italian'),
    new HumanMessage('hi!'),
];

const chain = model.pipe(parser);
const rMessage = await chain.invoke(messages);
console.log(rMessage);
