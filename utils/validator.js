


export function checkErrorsInWifiPassBody(items){
    const errors = []
    items.forEach((item,index)=>{
        if(!item.name || typeof item.name !== 'string'){
            errors.push(`Index=${index}, Something Wrong With Name Field`)
        }
        if(!item.password || typeof item.password!=='string'){
            errors.push(`Index=${index}, Something Wrong With password Field`)
        }
        if(typeof item.lat !== 'number' || isNaN(item.lat)){
            errors.push(`Index=${index}, Something Wrong With lat Field`)
        }
        if(typeof item.lng !== 'number' || isNaN(item.lng)){
            errors.push(`Index=${index}, Something Wrong With Lng Field`)
        }
    })
    return errors
}