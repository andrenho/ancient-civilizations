export function iterateEnumValues(enumName: any) : number[] {
    return Object.keys(enumName).filter(key => isNaN(Number(enumName[key]))).map(value => Number(value));
}