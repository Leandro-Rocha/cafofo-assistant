import { MissingEnvironmentProperty } from "./exceptions"


export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


export function requireEnv(environmentProperty: string, defaultValue?: string) {

    const environment = process.env.ENV
    const propertyValue =
        process.env?.[`${environment}_${environmentProperty}`] ||
        process.env?.[environmentProperty]

    if (propertyValue) return propertyValue
    if (defaultValue) return defaultValue

    throw new MissingEnvironmentProperty(environmentProperty)

}