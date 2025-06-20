document.addEventListener('DOMContentLoaded', () => {
    // Tu clave API de Financial Modeling Prep (FMP)
    const FMP_API_KEY = "nK7ZO4aVrrmKFhpqJEIFsLV77xx6Kd8x"; 

    const stockItems = document.querySelectorAll('.stock-item');
    const updateTimeSpan = document.getElementById('update-time');
    const refreshButton = document.getElementById('refresh-market-data');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');

    // List of stock symbols to fetch (extracted from data-symbol attributes in HTML)
    // Important: FMP uses uppercase symbols. Ensure your data-symbol in HTML is uppercase.
    const stockSymbols = Array.from(stockItems).map(item => item.dataset.symbol);

    // Function to fetch End-of-Day (EOD) data for a single stock from FMP
    async function fetchEODData(symbol) {
        // FMP's historical data endpoint for daily prices
        // We request 2 data points to easily get yesterday's and the day before's close for change calculation
        const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${FMP_API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // If response is not OK, try to read the error message from the body
                const errorData = await response.json();
                let errorMsg = `HTTP error! status: ${response.status}`;
                if (errorData && errorData.error) {
                    errorMsg += `: ${errorData.error}`;
                } else if (errorData && errorData.note) { // FMP sometimes uses 'note' for limit messages
                    errorMsg += `: ${errorData.note}`;
                }
                throw new Error(errorMsg);
            }
            const data = await response.json();

            // FMP returns an object with a 'historical' array
            if (data && data.historical && data.historical.length >= 2) {
                // The most recent day is at index 0. The day before is at index 1.
                const todayData = data.historical[0]; 
                const yesterdayData = data.historical[1]; 

                const price = parseFloat(todayData.close).toFixed(2);
                // Calculate change from yesterday's close to today's close
                const change = (todayData.close - yesterdayData.close).toFixed(2);
                const changePercent = ((change / yesterdayData.close) * 100).toFixed(2);

                const stockElement = document.querySelector(`.stock-item[data-symbol="${symbol}"]`);
                if (stockElement) {
                    stockElement.querySelector('.price').textContent = `${price}€`;

                    const changeElement = stockElement.querySelector('.change');
                    changeElement.textContent = `${change} (${changePercent}%)`;
                    changeElement.classList.remove('positive-change', 'negative-change'); // Clear previous classes
                    if (parseFloat(change) > 0) {
                        changeElement.classList.add('positive-change');
                    } else if (parseFloat(change) < 0) {
                        changeElement.classList.add('negative-change');
                    }
                }
                return { symbol, success: true };
            } else {
                // Handle cases where data structure is not as expected or not enough historical data
                console.warn(`No valid historical data (or less than 2 days) for ${symbol} from FMP:`, data);
                return { symbol, success: false, message: `No historical data available for ${symbol} or insufficient data points.` };
            }
        } catch (error) {
            console.error(`Error fetching FMP EOD data for ${symbol}:`, error);
            return { symbol, success: false, message: error.message };
        }
    }

    // Function to update all stocks
    async function updateAllStocks() {
        loadingMessage.style.display = 'block'; // Show loading message
        errorMessage.textContent = ''; // Clear previous error
        errorMessage.style.display = 'none';

        const fetchedResults = [];
        // FMP free tier limit is 250 requests/day.
        // For 60 stocks, 60 requests are well within the limit for one daily update.
        // We'll add a small delay to avoid too many simultaneous requests which can sometimes cause network issues,
        // but it won't be as long as the Alpha Vantage one.
        for (const symbol of stockSymbols) {
            const result = await fetchEODData(symbol);
            fetchedResults.push(result);
            // Small delay to be polite to the API and prevent network congestion
            await new Promise(resolve => setTimeout(resolve, 100)); // 100 ms delay between each stock fetch
        }

        loadingMessage.style.display = 'none'; // Hide loading message

        const failedFetches = fetchedResults.filter(r => !r.success);
        if (failedFetches.length > 0) {
            const symbolsFailed = failedFetches.map(f => f.symbol).join(', ');
            errorMessage.textContent = `Error al actualizar algunas acciones. Es posible que se haya alcanzado el límite de solicitudes de la API o que haya otros problemas.`;
            errorMessage.style.display = 'block';
        }

        const now = new Date();
        updateTimeSpan.textContent = now.toLocaleString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Initial load of data when the page loads
    updateAllStocks();

    // Attach event listener to the refresh button
    refreshButton.addEventListener('click', updateAllStocks);

    // Optional: Auto-refresh. Consider setting this to a longer interval for EOD data, e.g., once a day.
    // setInterval(updateAllStocks, 24 * 60 * 60 * 1000); // Refresh every 24 hours (for EOD data)
});
