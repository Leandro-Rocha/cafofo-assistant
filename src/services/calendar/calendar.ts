import axios from 'axios'
import moment, { Moment } from 'moment'
import { requireProperty } from 'profile-env'
import { getGoogleAccessToken } from '../../modules/google/auth'

const CALENDAR_SERVICE_ADDRESS = requireProperty('CALENDAR_SERVICE_ADDRESS')
const CALENDAR_ID = requireProperty('CALENDAR_ID')
const API_KEY = requireProperty('GOOGLE_API_KEY')

// From Google
interface ApiCalendarEvent {
    summary: string
    start: ApiDateAndTime
    end: ApiDateAndTime
}

// From Google
interface ApiDateAndTime {
    date?: string
    dateTime?: string
    timeZone?: string
}

// Internal use
export interface CalendarEvent {
    summary: string
    start: { moment: Moment; hasTime: boolean }
    end: { moment: Moment; hasTime: boolean }
}

function parseDateTime(startEnd: ApiDateAndTime): { moment: Moment; hasTime: boolean } {
    return {
        moment: moment(startEnd.dateTime || startEnd.date),
        hasTime: startEnd.dateTime !== undefined,
    }
}

function parseCalendarEvent(event: ApiCalendarEvent): CalendarEvent {
    return {
        summary: event.summary,
        start: parseDateTime(event.start),
        end: parseDateTime(event.end),
    }
}

export function daysFromNow(day: string) {
    const momentDay = moment(day)
    if (momentDay.isSame(moment(), 'day')) return 'hoje'
    if (momentDay.isSame(moment().add(1, 'day'), 'day')) return 'amanhã'
    return momentDay.from(moment().startOf('day'))
}

export async function listNextEvents(maxResults = 10): Promise<CalendarEvent[]> {
    console.debug(`Listing next ${maxResults} events`)
    const eventsCall = await axios.get(`${CALENDAR_SERVICE_ADDRESS}${CALENDAR_ID}/events?key=${API_KEY}`, {
        headers: {
            Authorization: `Bearer ${(await getGoogleAccessToken()).access_token}`,
            Accept: 'application/json',
        },
        params: {
            maxResults,
            timeMin: new Date().toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        },
    })

    const events = eventsCall.data.items
    return events.map((e: any) => parseCalendarEvent(e))
}

export function groupByDay(events: CalendarEvent[]): { [key: string]: CalendarEvent[] } {
    return events.reduce((acc: any, event) => {
        const index = event.start.moment.format('YYYY-MM-DD')

        if (!acc[index]) acc[index] = []
        acc[index].push(event)

        return acc
    }, {})
}

export const showEventWithTime = (event: CalendarEvent) => `  ${event.start.hasTime ? event.start.moment.format('HH:mm - ') : ''}${event.summary}`

export async function eventsOverview() {
    const events = await listNextEvents()
    const todayEvents = events.filter((event) => event.start.moment.isSame(moment().add(0, 'days'), 'day'))
    const tomorrowEvents = events.filter((event) => event.start.moment.isSame(moment().add(1, 'days'), 'day'))

    const todayEventsFormatted = `Para hoje: ` + (todayEvents.length > 0 ? `\n${todayEvents.map(showEventWithTime).join('\n')}` : `Nada 😎`) + '\n\n'

    const tomorrowEventsFormatted = `Para amanhã: ` + (tomorrowEvents.length > 0 ? `\n   ${tomorrowEvents.map(showEventWithTime).join('\n')}` : `Nada 😎`)

    return todayEventsFormatted + tomorrowEventsFormatted
}
