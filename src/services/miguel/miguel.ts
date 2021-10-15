import moment from 'moment'

const dob = moment('2021-10-25')
const isBorn = moment().isAfter(dob)

export function miguelFacts() {
    let facts = `👶🏻 - Miguel facts:`
    facts += `${!isBorn ? pregnancy() : ''}`
    facts += `${age()}`

    return facts
}

function pregnancy() {
    const udm = moment('2021-01-25')
    const weeks = moment().diff(udm, 'weeks')
    const andDays = moment().diff(udm, 'days') % 7
    return `\nEle está com ${weeks} semanas ${andDays > 0 ? `e ${andDays} dias` : ''} (${moment().diff(udm, 'months', true).toPrecision(2)} meses)`
}

function age() {
    if (isBorn) return `Ele tem ${dob.fromNow(true)}`
    else return `\nEle chega ${dob.fromNow()}!`
}
