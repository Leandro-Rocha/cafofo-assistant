import moment from "moment"

export function miguelFacts() {
    const udm = moment('2021-01-25')
    const weeks = moment().diff(udm, 'weeks')
    const andDays = moment().diff(udm, 'days') % 7
    const facts = `👶🏻 - O Miguel está com ${weeks} semanas ${andDays > 0 ? `e ${andDays} dias` : ''} (${moment().diff(udm, 'months', true).toPrecision(2)} meses)`

    return facts
}