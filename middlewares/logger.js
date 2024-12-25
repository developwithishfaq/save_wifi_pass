import fs from 'fs'
import path  from 'path'

export function logRequest(req,res,next) {
    const timestamp = new Date().toISOString()
    // const endpoint = `${req.method} ${req.url}`
    // const ip = req.ip || req.connection.remoteAddress
    const headers = JSON.stringify(req.headers)

    const logMessage = `${timestamp} ${headers}\n`;

    const logFilePath = path.join(__dirname,'logs','app.log')
    if(!fs.existsSync(logFilePath)){
        fs.mkdirSync(logFilePath)
    }
    fs.appendFile(logFilePath,logMessage,(err)=>{
        console.log("Error In Logs",err)
    })
    next()
}