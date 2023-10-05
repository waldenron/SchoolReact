const instCode = "1";

export const fetchData = async (API_URL, transformFunction, sortFunction, headers = []) => {
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

        const response = await fetch(`${apiUrl}${API_URL}`, {
            method: 'GET',
            headers: fetchHeaders
        });

        if (response.status === 404) {
            throw new Error('Resource not found'); // Specific error for NotFound
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await response.json();

        // If a transformFunction is provided, transform the data.
        if (transformFunction) data = data.map(transformFunction);

        // If a sortFunction is provided, sort the data.
        if (sortFunction) data = data.sort(sortFunction);

        return { data, error: "none" };

    } catch (error) {
        console.error('Fetch error:', error);
        // throw error; // or handle error as appropriate
        return { data: null, error };
    }
}
