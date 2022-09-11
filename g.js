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
