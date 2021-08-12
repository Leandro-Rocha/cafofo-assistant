import axios from 'axios'

export interface CalendarEvent {
    summary: string
    start: EventDateAndTime,
    end: EventDateAndTime,
}

interface ApiDateAndTime {
    date?: string,
    dateTime?: string,
    timeZone?: string
}

interface EventDateAndTime {
    date: string,
    time?: string,
    timeZone?: string
}


function parseDateTime(startEnd: ApiDateAndTime): { date: string, time: string } {

    let parsedDate
    let parsedTime

    if (startEnd.dateTime) {
        const dateTime = new Date(startEnd.dateTime)

        parsedDate = `${dateTime.getFullYear()}-${(dateTime.getMonth() + 1).toLocaleString('pt-BR', { minimumIntegerDigits: 2 })}-${dateTime.getDate().toLocaleString('pt-BR', { minimumIntegerDigits: 2 })}`
        parsedTime = `${dateTime.getHours().toLocaleString('pt-BR', { minimumIntegerDigits: 2 })}:${dateTime.getMinutes().toLocaleString('pt-BR', { minimumIntegerDigits: 2 })}`

        return {
            date: parsedDate,
            time: parsedTime
        }
    }
    else {
        parsedDate = startEnd.date
        parsedTime = ''

        return {
            date: parsedDate!,
            time: parsedTime
        }
    }
}


function parseCalendarEvent(event: CalendarEvent): CalendarEvent {

    return {
        summary: event.summary,
        start: parseDateTime(event.start),
        end: parseDateTime(event.end)
    }
}

export namespace Calendar {

    export async function events() {
        const eventsCall = await axios.get('http://localhost:21991/events')
        const events = eventsCall.data.data.items

        const parsedEvents: CalendarEvent[] = events.map((e: any) => parseCalendarEvent(e))

        return parsedEvents.map(e =>
            `${e.start.date}${e.start.time ? ' (🕑 ' + e.start.time + ')' : ''} \n${e.summary} \n`)
            .join('\n')

    }
}


