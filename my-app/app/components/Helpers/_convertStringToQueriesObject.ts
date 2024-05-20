export const convertStringToQueriesObject = (
    searchParams: URLSearchParams | null
) => {
    let selectedQueries: Record<string, string[]> = {};

    if (searchParams) {
        searchParams.forEach((values, key) => {
            const queries = values.split(",");
            if (selectedQueries[key]) {
                selectedQueries[key].push(...queries);
            } else {
                selectedQueries[key] = queries;
            }
        });
    }

    return selectedQueries;
};


