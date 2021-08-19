import axios from 'axios'
import moment, { Moment } from 'moment'
import { MissingEnvironmentProperty } from '../../core/exceptions'

if (!process.env.CALENDAR_ID) throw new MissingEnvironmentProperty('CALENDAR_ID')
const CALENDAR_ID = process.env.CALENDAR_ID

if (!process.env.API_KEY) throw new MissingEnvironmentProperty('API_KEY')
const API_KEY = process.env.API_KEY

if (!process.env.CALENDAR_SERVICE_ADDRESS) throw new MissingEnvironmentProperty('CALENDAR_SERVICE_ADDRESS')
const CALENDAR_SERVICE_ADDRESS = process.env.CALENDAR_SERVICE_ADDRESS

if (!process.env.ACCESS_TOKEN) throw new MissingEnvironmentProperty('ACCESS_TOKEN')
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

// From Google
interface ApiCalendarEvent {
    summary: string
    start: ApiDateAndTime,
    end: ApiDateAndTime,
}

// From Google
interface ApiDateAndTime {
    date?: string,
    dateTime?: string,
    timeZone?: string
}

// Internal use
export interface CalendarEvent {
    summary: string,
    start: { moment: Moment, hasTime: boolean },
    end: { moment: Moment, hasTime: boolean },
}

function parseDateTime(startEnd: ApiDateAndTime): { moment: Moment, hasTime: boolean } {
    return {
        moment: moment(startEnd.dateTime || startEnd.date),
        hasTime: startEnd.dateTime != undefined
    }
}

function parseCalendarEvent(event: ApiCalendarEvent): CalendarEvent {

    return {
        summary: event.summary,
        start: parseDateTime(event.start),
        end: parseDateTime(event.end)
    }
}


export async function listNextEvents(maxResults = 10): Promise<CalendarEvent[]> {
    const eventsCall = await axios.get(`${CALENDAR_SERVICE_ADDRESS}${CALENDAR_ID}/events?key=${API_KEY}`,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                Accept: 'application/json'
            },
            params: {
                maxResults,
                timeMin: (new Date()).toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            }
        })

    const events = eventsCall.data.items
    return events.map((e: any) => parseCalendarEvent(e))
}

export function groupByDay(events: CalendarEvent[]): { [key: string]: CalendarEvent[] } {
    return events.reduce((acc: any, event) => {
        const index = event.start.moment.format('YYYY-MM-DD')

        if (!acc[index]) acc[index] = [];
        acc[index].push(event);

        return acc;
    }, {})
}

