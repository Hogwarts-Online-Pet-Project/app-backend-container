import express from 'express'
import helmet from 'helmet'
import { config } from 'dotenv'
import { notFound, errorHandler, everything } from './api/middlewares.js'
import api from './api/index.js'
import cors from 'cors'
import fileUpload from 'express-fileupload'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env.APP_ROOT = __dirname

config()

const app = express()

app.use(helmet(
    {

    }
))

var allowedOrigins = ['http://localhost:5173', 'http://localhost:8080'];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     },
//     // credentials: true
// }));

app.use(express.json());

app.use(express.static(join(__dirname, "dist")));

app.get('/', (req, res) => {
    res.json({
        message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
    });
});


app.use(everything);
app.use(fileUpload());
app.use('/api/v1', api);
app.set('case sensitive routing', false);
app.use(notFound);
app.use(errorHandler);


app.listen(process.env.PORT || 7485, () => {
    console.log(`[+] APP on ${process.env.PORT || 7485}`);
})
