import axios from 'axios'
import moment, { Moment } from 'moment'
import { requireEnv } from '../../core/util'
import { getGoogleAccessToken } from '../../modules/google/auth'

const CALENDAR_SERVICE_ADDRESS = requireEnv('CALENDAR_SERVICE_ADDRESS')
const CALENDAR_ID = requireEnv('CALENDAR_ID')
const API_KEY = requireEnv('GOOGLE_API_KEY')

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

    console.debug(`Listing next ${maxResults} events`)
    const eventsCall = await axios.get(`${CALENDAR_SERVICE_ADDRESS}${CALENDAR_ID}/events?key=${API_KEY}`,
        {
            headers: {
                Authorization: `Bearer ${(await getGoogleAccessToken()).access_token}`,
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

