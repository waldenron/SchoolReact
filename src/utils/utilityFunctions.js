export const cleanText = (text) => {
    if (text != null) {
        text = text.toLowerCase();

        //replace commas to spaces
        text = text.replace(/,/g, " ");

        // Replace specific Hebrew final letters with their non-final forms
        text = text.replace(/ך/g, 'כ');
        text = text.replace(/ם/g, 'מ');
        text = text.replace(/ן/g, 'נ');
        text = text.replace(/ף/g, 'פ');
        text = text.replace(/ץ/g, 'צ');

        // Replace ת as the last letter in text or in word to ה
        text = text.replace(/ת( |$)/g, "ה$1");

        //text = text.replace(/ /g, "");//need space for the split

        text = text.replace(/-/g, "");
        text = text.replace(/\"/g, "");
        text = text.replace(/\'/g, "");

        return text.trim();
    }
    return "";
}
export function whatsappStrToHtmlTags(strWhatsApp, isReplaceLine = true) {
    // Convert Bold
    if (!strWhatsApp) return "";

    let regexMatches = /(\*)([^*]+?)(\*)/g;
    strWhatsApp = strWhatsApp.replace(regexMatches, '<b>$2</b>');

    // Convert Italic
    regexMatches = /(_)([^_]+?)(_)/g;
    strWhatsApp = strWhatsApp.replace(regexMatches, '<i>$2</i>');

    // Convert Strikethrough
    regexMatches = /(~)([^~]+?)(~)/g;
    strWhatsApp = strWhatsApp.replace(regexMatches, '<del>$2</del>');

    // Convert Newline
    if (isReplaceLine) {
        strWhatsApp = strWhatsApp.replace(/\n/g, '<br>');
    }

    return strWhatsApp;
}
export function toArchiveText(text) {
    return `- <span class="fst-italic">${text}</span>`;
}

export function cssStringToObject(cssString) {
    const style = {};
    const stylesArray = cssString.split(";");
    stylesArray.forEach(item => {
        const [property, value] = item.split(":");
        if (property && value) {
            const formattedProperty = property.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            style[formattedProperty] = value.trim();
        }
    });
    return style;
}

export function toPageTitle(text) {
    //remove the HTML tags from the text
    return text.replace(/<[^>]*>/g, "");
}

export function getNameById(items, id) {
    const item = items.find(t => t.id === id);
    return item ? item.name : null;
}

export function setWithExpiry(key, value, timeToLiveMinutes) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + timeToLiveMinutes * 60 * 1000,
    }
    localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }

    return item.value;
}
export function toDate(date, format = "dd/MM/yyyy") {
    if (typeof date === "string") date = new Date(date);

    const day = date.getDate();
    const month = date.getMonth() + 1; // January is 0
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const twoDigit = n => n < 10 ? '0' + n : n.toString();

    let formattedDate = format;
    if (format.includes('dd')) formattedDate = formattedDate.replace('dd', twoDigit(day));
    else if (format.includes('d')) formattedDate = formattedDate.replace('d', day);

    if (format.includes('MM')) formattedDate = formattedDate.replace('MM', twoDigit(month));
    else if (format.includes('M')) formattedDate = formattedDate.replace('M', month);

    if (format.includes('yyyy')) formattedDate = formattedDate.replace('yyyy', year.toString());
    else if (format.includes('yy')) formattedDate = formattedDate.replace('yy', year.toString().slice(-2)); // last two digits of the year

    if (format.includes('mm')) formattedDate = formattedDate.replace('mm', twoDigit(minutes));
    else if (format.includes('m')) formattedDate = formattedDate.replace('m', minutes);

    if (format.includes('HH')) formattedDate = formattedDate.replace('HH', twoDigit(hours));
    else if (format.includes('H')) formattedDate = formattedDate.replace('H', hours);

    return formattedDate;
}

export function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export const getNextDateForWeekDay = (dayNumber) => {
    // returns the next occurrence of a specific day of the week
    const now = new Date();
    const resultDate = new Date(now.getTime());
    // Adjust dayNumber to match JavaScript's day index (where Sunday is 0)
    const adjustedDayNumber = (dayNumber - 1) % 7;

    // Calculate days to add
    const daysToAdd = (adjustedDayNumber + 7 - now.getDay()) % 7;
    resultDate.setDate(now.getDate() + (daysToAdd === 0 ? 7 : daysToAdd));

    return resultDate;
};

export const addTimeToDate = (date, time) => {
    // adds the time to a date
    const timeParts = time.split(':');
    date.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), 0, 0);
    return date;
};

export function lastDayOfStudyYear() {
    //sep-dec last day of aug next year, Otherwise, current year
    const date = new Date();
    if (date.getMonth() >= 8) return new Date(date.getFullYear() + 1, 7, 31);
    else return new Date(date.getFullYear(), 7, 31);
}