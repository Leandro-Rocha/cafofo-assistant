import { MissingEnvironmentProperty } from "./exceptions"


export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


export function requireEnv(environmentProperty: string) {
    const propertyValue = process.env?.[environmentProperty]
    if (!propertyValue) throw new MissingEnvironmentProperty(environmentProperty)
    return propertyValue
}