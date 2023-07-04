const verticalRotationString=(s: string)=> {
    return s.split('').join('\r\n')
}

const verticalRotationEnString=(s: string)=> {
    return s.split(' ').join('\r\n')
}

export {
    verticalRotationString,
    verticalRotationEnString
}