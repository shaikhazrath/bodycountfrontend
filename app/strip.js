export function stripIndents(value) {
    if (typeof value !== 'string') {
        const processedString = value.reduce((acc, curr, i) => {
            acc += curr + (arguments[i + 1] ?? '');
            return acc;
        }, '');

        return _stripIndents(processedString);
    }

    return _stripIndents(value);
}

function _stripIndents(value) {
    return value
        .replace(/```json\s*/g, '')   // Remove the opening "```json"
        .replace(/```/g, '')          // Remove the closing "```"
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trimStart()
        .replace(/[\r\n]$/, '');
}


