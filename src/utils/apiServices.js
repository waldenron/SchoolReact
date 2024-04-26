const instCode = "1";

export const fetchData = async (API_URL, transformFunction, sortFunction, headers = [], bodyItems = {}, curMethod = "GET") => {
    try {
        const apiUrl = process.env.REACT_APP_API_URL;

        //Base headers
        let fetchHeaders = {
            'Content-Type': 'application/json',
            'InstCode': instCode
        };

        // Additional headers provided to the function
        headers.forEach(header => {
            fetchHeaders[header.name] = header.value;
        });

        const isBodyEmpty = bodyItems && Object.keys(bodyItems).length === 0;
        const response = await fetch(`${apiUrl}${API_URL}`, {
            method: curMethod,
            headers: fetchHeaders,
            ...(isBodyEmpty ? {} : { body: JSON.stringify(bodyItems) }) // Spread the body property if not empty
        });
        
        if (response.status === 404) {
            return { data: null, error: 'Resource not found' };
        } else if (response.status === 204) {
            return { data: null, error: 'No content' };
        } else if (!response.ok) {
            const error = await response.json();
            return { data: null, error: error?.Message ? error.Message : 'Network response was not ok' };
        }

        let data = await response.json();

        // If a transformFunction is provided, transform the data.
        if (transformFunction) data = data.map(transformFunction);

        // If a sortFunction is provided, sort the data.
        if (sortFunction) data = data.sort(sortFunction);

        return { data, error: null };

    } catch (error) {
        console.error('Fetch error:', error);
        // throw error; // or handle error as appropriate
        return { data: null, error };
    }
}

export const getHomePageUrl = async () => {
    const { data: fetchedData, error } = await fetchData('/api/InstDetails');
    return fetchedData.homePageUrl;
};
export const getPageHeader = async ({ pageName }) => {
    const additionalHeaders = pageName ? [{ name: 'PageName', value: pageName }] : [];
    const { data: fetchedData, error } = await fetchData('/api/PageHeader', null, null, additionalHeaders);

    return fetchedData.pageHeader;
};
export const getInstUtils = async () => {
    const { data: fetchedData, error } = await fetchData('/api/InstUtils');
    return fetchedData;
};
export const getInstParams = async () => {
    const { data: fetchedData, error } = await fetchData('/api/InstParams');
    return fetchedData;
};