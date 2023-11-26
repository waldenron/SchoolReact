import { HDate } from 'hebcal';

const getGregorianMonthRange = (month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month
    return { startDate, endDate };
};

const getHebrewMonthsForRange = (month, year) => {

    const { startDate, endDate } = getGregorianMonthRange(month, year);

    const startHebrewMonth = new HDate(startDate).getMonthName('h');
    const endHebrewMonth = new HDate(endDate).getMonthName('h');

    return startHebrewMonth === endHebrewMonth ? startHebrewMonth : `${startHebrewMonth} - ${endHebrewMonth}`;
};

const getHebrewDay = (date) => {
    const hebrewLetters = [
        'א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'ז\'', 'ח\'', 'ט\'',
        'י\'', 'י"א', 'י"ב', 'י"ג', 'י"ד', 'ט"ו', 'ט"ז', 'י"ז', 'י"ח', 'י"ט',
        'כ\'', 'כ"א', 'כ"ב', 'כ"ג', 'כ"ד', 'כ"ה', 'כ"ו', 'כ"ז', 'כ"ח', 'כ"ט',
        'ל\''
    ];
    const hebrewDate = new HDate(date);
    // const formattedHebrewDate = hebrewDate.toString('h'); // Format as per your preference
    return `${hebrewLetters[hebrewDate.getDate() - 1]}`; // Day of the Hebrew month
}

const getHebrewJewishMonth = (date) => {

    const hebrewDate = new HDate(date);
    return hebrewDate.getMonthName('h'); // Hebrew month name
}

const getHebrewYearLetters = (year) => {
    const hebrewLetterMapping = {
        'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6,
        'ז': 7, 'ח': 8, 'ט': 9, 'י': 10, 'כ': 20, 'ך': 20,
        'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50, 'ס': 60,
        'ע': 70, 'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90, 'ק': 100,
        'ר': 200, 'ש': 300, 'ת': 400
    };
    // Function to find the appropriate Hebrew letter
    const findHebrewLetter = (value) => {
        return Object.keys(hebrewLetterMapping).find(key => hebrewLetterMapping[key] === value);
    };

    let hebrewYear = "";
    if (year > 5000) year -= 5000; // Remove the 5000 years added to the year

    // Hundreds
    while (year >= 100) {
        let value = Math.floor(year / 100) * 100;
        if (value >= 400) value = 400;
        else if (value >= 300) value = 300;
        else if (value >= 200) value = 200;

        hebrewYear += findHebrewLetter(value);
        year -= value;
    }
    // Tens
    if (year >= 10) {
        const value = Math.floor(year / 10) * 10;
        hebrewYear += findHebrewLetter(value);
        year -= value;
    }

    // Singles
    if (year > 0) hebrewYear += findHebrewLetter(year);

    // Replace with final forms if the last letter is מ,נ,פ,צ,כ
    const finalLetters = { 'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ' };
    const lastLetter = hebrewYear.slice(-1);
    if (finalLetters[lastLetter]) {
        hebrewYear = hebrewYear.slice(0, -1) + finalLetters[lastLetter];
    }

    // Add a geresh before the last letter
    if (hebrewYear.length > 1) {
        hebrewYear = hebrewYear.slice(0, -1) + "\"" + hebrewYear.slice(-1);
    }
    return hebrewYear;
};

const getHebrewJewishYear = (date) => {
    const hebrewDate = new HDate(date);
    const year = hebrewDate.getFullYear();
    return getHebrewYearLetters(year);
};

const monthMapping = {
    'ינואר': 1, 'פברואר': 2, 'מרץ': 3, 'אפריל': 4, 'מאי': 5, 'יוני': 6,
    'יולי': 7, 'אוגוסט': 8, 'ספטמבר': 9, 'אוקטובר': 10, 'נובמבר': 11, 'דצמבר': 12
};

const getHebrewDayOfWeek = (date) => {
    const dayOfWeekMapping = {
        1: 'ראשון', 2: 'שני', 3: 'שלישי', 4: 'רביעי', 5: 'חמישי', 6: 'שישי', 7: 'שבת',
        Sunday: 'ראשון', Monday: 'שני', Tuesday: 'שלישי', Wednesday: 'רביעי', Thursday: 'חמישי', Friday: 'שישי', Saturday: 'שבת'
    };
    return dayOfWeekMapping[date.getDay() - 1];
}

const getHebrewGregorianMonth = (monthName) => {
    return monthMapping[monthName]; // Get the month number from the mapping
}
const getHebrewGregorianMonthByNum = (monthNum) => {
    // Find the Hebrew month name by searching through the mapping
    for (const [key, value] of Object.entries(monthMapping)) {
        if (value === monthNum) {
            return key;
        }
    }
    return null; // Return null if the month number is not found
};

export const getHebrewLongDayName = (dayName) => {
    const dayNameMapping = {
        'Sunday': 'ראשון', 'א': 'ראשון', '1': 'ראשון',
        'Monday': 'שני', 'ב': 'שני', '2': 'שני',
        'Tuesday': 'שלישי', 'ג': 'שלישי', '3': 'שלישי',
        'Wednesday': 'רביעי', 'ד': 'רביעי', '4': 'רביעי',
        'Thursday': 'חמישי', 'ה': 'חמישי', '5': 'חמישי',
        'Friday': 'שישי', 'ו': 'שישי', '6': 'שישי',
        'Saturday': 'שבת', 'ש': 'שבת', '7': 'שבת'
    };
    dayName = dayName.replace(/'/g, "").replace(/׳/g, ""); // Remove the apostrophe
    return dayNameMapping[dayName]; // Get the day name from the mapping
}

export function toHebrewDate(date, format = "dd MM yyyy", isHeb = true) {
    if (typeof date === "string") date = new Date(date);

    let formattedDate = format;
    if (format.includes('dddd')) formattedDate = formattedDate.replace('dddd', getHebrewDayOfWeek(date));
    else if (format.includes('dd')) formattedDate = formattedDate.replace('dd', getHebrewDay(date));

    if (format.includes('MMMM')) formattedDate = formattedDate.replace('MMMM',
        isHeb ? getHebrewMonthsForRange(date.getMonth() + 1, date.getFullYear()) : getHebrewGregorianMonthByNum(date.getMonth() + 1));
    if (format.includes('MM')) formattedDate = formattedDate.replace('MM', getHebrewJewishMonth(date));

    if (format.includes('yyyy')) formattedDate = formattedDate.replace('yyyy', getHebrewJewishYear(date));
    else if (format.includes('yy')) formattedDate = formattedDate.replace('yy', getHebrewJewishYear(date).slice(-2)); // last two digits of the year

    return formattedDate;
}