import axios from 'axios'

const URL = 'https://api.hgbrasil.com/weather?woeid=455827'
const key = 'febb2c91'

export async function getForecast() {
    const data = (await axios.get(URL, { params: { key } })).data
    const results = data.results

    const [day, month, year] = (results.date as string).split('/')

    const weather: Weather = {
        date: `${year}-${month}-${day}`,
        time: results.time,
        temp: results.temp,
        description: results.description,
        condition: results.condition_slug,
        icon: conditionMap.get(results.condition_slug)!,
        forecast: [],
    }

    ;(results.forecast as any[]).forEach((result) => {
        const date: string = result.date
        const [forecastDay, forecastMonth] = date.split('/')

        const forecast: Forecast = {
            date: `${year}-${forecastMonth}-${forecastDay}`,
            description: result.description,
            weekday: result.weekday,
            min: result.min,
            max: result.max,
            condition: result.condition,
            icon: conditionMap.get(result.condition)!,
        }

        weather.forecast.push(forecast)
    })

    return weather
}

type Weather = {
    date: string
    time: string
    temp: number
    description: string
    condition: string
    icon: string
    forecast: Forecast[]
}

type Forecast = {
    date: string
    weekday: string
    min: number
    max: number
    description: string
    condition: string
    icon: string
}
// ;('âī¸đ¤ī¸âđĨī¸âī¸đĻī¸đ§ī¸đŠī¸đ¨ī¸âī¸đ§')

const conditionMap = new Map<string, string>([
    ['storm', 'đ§ī¸'],
    ['snow', 'âī¸'],
    ['snow', 'âī¸'],
    ['rain', 'đ§ī¸'],
    ['fog', 'đĢī¸'],
    ['clear_day', 'âī¸'],
    ['cloud', 'âī¸'],
    ['cloudly_day', 'â'],
    ['cloudly_night', 'â'],
])
