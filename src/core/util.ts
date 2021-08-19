import { MissingEnvironmentProperty } from "./exceptions"



export function requireEnv(environmentProperty: string) {
    const propertyValue = process.env?.[environmentProperty]
    if (!propertyValue) throw new MissingEnvironmentProperty(environmentProperty)
    return propertyValue
}