import flags from "./flags.json"

export default function getFlagPath(country:String){
    for(let i = 0; i < flags.length; i++){
        if(flags[i].name == country){
            const flagFileName = flags[i].code
            const localUri = `../assets/flag_svgs/${flagFileName}.svg`
            return localUri
        }
    }
    return false
}