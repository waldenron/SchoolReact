export const cleanText = (text) => {
    if (text != null) {
        text = text.toLowerCase();
        text = text.replace(/ /g, "");
        text = text.replace(/-/g, "");
        text = text.replace(/\"/g, "");
        text = text.replace(/\'/g, "");
        return text;
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