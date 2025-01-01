import fs from "fs"


const fileName = "fail_data.text"
export async function saveFailedBufferData(items){
    // const filePath = `D:/Javascript Projects/WifiPass1/backend/data/${fileName}`
    const filePath = `app/data/${fileName}`
    console.log("File Path",filePath)
    if(!fs.existsSync(filePath)){
        fs.writeFile(filePath,"",{flag:"w"},()=>{})
    }
    var text = ""
    const fileText = fs.readFileSync(filePath,'utf-8')
    if(fileText.trim().length!=0){
        text += `\n`
    }
    text += JSON.stringify(items)
    fs.appendFile(
        filePath,
        text,
        (err)=>{
    })
}