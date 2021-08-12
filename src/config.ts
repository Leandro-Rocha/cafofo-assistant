import dotenv from "dotenv";
import consoleStamp from 'console-stamp'

dotenv.config()
consoleStamp(console, { format: ':date(yyyy-mm-dd HH:MM:ss) :label(7)', level: process.env.LOG_LEVEL })