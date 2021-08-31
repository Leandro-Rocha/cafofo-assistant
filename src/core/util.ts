import { MissingEnvironmentProperty } from "./exceptions"


export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


export function getProperty(environmentProperty: string, defaultValue?: string) {
    const environment = process.env.ENV

    const propertyValue =
        process.env?.[`${environment}_${environmentProperty}`] ||
        process.env?.[environmentProperty]

    return propertyValue || defaultValue
}

export function requireProperty(environmentProperty: string, defaultValue?: string) {
    const propertyValue = getProperty(environmentProperty, defaultValue)

    if (propertyValue) return propertyValue

    throw new MissingEnvironmentProperty(environmentProperty)
}