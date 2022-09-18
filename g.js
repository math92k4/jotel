// REGEX
const REGEX_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/;
const REGEX_NAME = /^[A-Za-z]{2,20}$/;
const REGEX_SERIAL = /^[1-9][0-9]*$/;

// Functions
export function IsValidName(name) {
    if (REGEX_NAME.test(name)) return true;
    return false;
}

export function IsValidPassword(password) {
    if (REGEX_PASSWORD.test(password)) return true;
    return false;
}

export function IsValidSerial(serial) {
    if (serial.match(REGEX_SERIAL)) return true;
    return false;
}

export function CleanString(str) {
    if (!str) return false;
    const noDblSpaces = str.replace(/\s+/g, ' ').trim();
    const noLineBreaks = noDblSpaces.replace(/[\r\n]/gm, '').trim();
    return noLineBreaks;
}
export function IsValidText(text) {
    if (text.length <= 150 && text.length >= 2) return true;
    return false;
}

export function epochToTime(iat) {
    const now = Math.round(Date.now() / 1000);
    const diff = now - iat;
    if (diff >= 31536000) return Math.round(diff / 31536000) + 'y';
    else if (diff >= 86400) return Math.round(diff / 86400) + 'd';
    else if (diff >= 3600) return Math.round(diff / 3600) + 'h';
    else if (diff >= 60) return Math.round(diff / 60) + 'm';
    else return diff + 's';
}

// Options
export const CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: true,
    maxAge: 172800,
    path: '/',
};

// DBCONF
export const dbConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};
