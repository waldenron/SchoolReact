
const instCode = "2";

export const fetchData = async (API_URL, transformFunction, sortFunction) => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'InstCode': instCode
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await response.json();

        // If a transformFunction is provided, transform the data.
        if (transformFunction) {
            data = data.map(transformFunction);
        }

        // If a sortFunction is provided, sort the data.
        return sortFunction ? data.sort(sortFunction) : data;

    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // or handle error as appropriate
    }
}
