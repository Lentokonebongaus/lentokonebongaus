import flags from "./flags.json"

export default function getFlagEmoji(country: String) {
    for (let i = 0; i < flags.length; i++) {
        if (flags[i].name == country) {
            return flags[i].emoji
        }
    }
    return false
}