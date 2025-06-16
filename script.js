document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the market.html page by checking for specific elements or a body class
    // Add a class "market-page" to the body of market.html for robust targeting
    if (document.body.classList.contains('market-page')) {
        updateMarketData(); // Initial load when page loads

        const refreshButton = document.getElementById('refresh-market-data');
        if (refreshButton) {
            refreshButton.addEventListener('click', updateMarketData);
        }
    }
});

// Function to simulate market data update
// In a real application, this would fetch data from an API
function updateMarketData() {
    const djiaValue = document.getElementById('djia-value');
    const djiaChange = document.getElementById('djia-change');
    const sp500Value = document.getElementById('sp500-value');
    const sp500Change = document.getElementById('sp500-change');
    const nasdaqValue = document.getElementById('nasdaq-value');
    const nasdaqChange = document.getElementById('nasdaq-change');
    const ftse100Value = document.getElementById('ftse100-value');
    const ftse100Change = document.getElementById('ftse100-change');
    const updateTimeSpan = document.getElementById('update-time');

    // Ensure elements exist before trying to update them
    if (!djiaValue || !sp500Value || !nasdaqValue || !ftse100Value || !updateTimeSpan) {
        console.warn("Market data elements not found. Are you on market.html?");
        return;
    }

    // --- Simulated Data Generation ---
    const generateRandomChange = (currentValue) => {
        // Generate a random percentage change between -0.5% and +0.5%
        const percentChange = (Math.random() * 1 - 0.5).toFixed(2); // e.g., -0.50 to +0.50
        const absoluteChange = (currentValue * (percentChange / 100)).toFixed(2);
        const newValue = (parseFloat(currentValue) + parseFloat(absoluteChange)).toFixed(2);
        return {
            newValue: parseFloat(newValue),
            absoluteChange: parseFloat(absoluteChange),
            percentChange: parseFloat(percentChange)
        };
    };

    const updateIndexDisplay = (valueElement, changeElement, currentValue) => {
        const data = generateRandomChange(currentValue);
        valueElement.textContent = parseFloat(data.newValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        const changeText = `${data.absoluteChange > 0 ? '+' : ''}${parseFloat(data.absoluteChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${data.percentChange > 0 ? '+' : ''}${data.percentChange}%)`;
        changeElement.textContent = changeText;
        
        // Apply color based on change (positive/negative)
        changeElement.classList.remove('positive', 'negative');
        if (data.absoluteChange > 0) {
            changeElement.classList.add('positive');
        } else if (data.absoluteChange < 0) {
            changeElement.classList.add('negative');
        }
    };

    // Get current values from the DOM to make simulated changes relative
    const currentDJIA = parseFloat(djiaValue.textContent.replace(/,/g, ''));
    const currentSP500 = parseFloat(sp500Value.textContent.replace(/,/g, ''));
    const currentNASDAQ = parseFloat(nasdaqValue.textContent.replace(/,/g, ''));
    const currentFTSE100 = parseFloat(ftse100Value.textContent.replace(/,/g, ''));

    // Update each index
    updateIndexDisplay(djiaValue, djiaChange, currentDJIA);
    updateIndexDisplay(sp500Value, sp500Change, currentSP500);
    updateIndexDisplay(nasdaqValue, nasdaqChange, currentNASDAQ);
    updateIndexDisplay(ftse100Value, ftse100Change, currentFTSE100);

    // Update timestamp
    const now = new Date();
    updateTimeSpan.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    console.log("Market data refreshed (simulated).");

    /*
    // --- CONCEPT FOR REAL API INTEGRATION (Requires an API Key and Backend Proxy for Production) ---
    // This section is commented out because direct client-side API calls to financial data
    // APIs often lead to CORS issues and, more critically, expose your API key to the public.
    // For a production environment, you would typically use a server-side proxy to fetch data.

    // Example using a hypothetical API (e.g., Alpha Vantage, IEX Cloud, Finnhub, etc.)
    // You would sign up for an account with a financial data provider to get an API key.

    // const API_KEY = 'YOUR_ACTUAL_API_KEY'; // REPLACE THIS WITH YOUR REAL API KEY
    // const SYMBOLS = ['^DJI', 'SPY', 'QQQ', '^FTSE']; // Example symbols for indices or ETFs

    // const fetchRealMarketData = async (symbol, valueElement, changeElement) => {
    //     try {
    //         // In a real scenario, you'd call YOUR OWN BACKEND endpoint here, e.g.:
    //         // const response = await fetch(`/api/market-data?symbol=${symbol}`);
    //         // Your backend would then call the external API (e.g., Alpha Vantage) securely.

    //         // For a very simple client-side example (may have CORS issues/expose key):
    //         // const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
    //         // const data = await response.json();

    //         // console.log(`Data for ${symbol}:`, data); // Inspect the data structure

    //         // You would then parse the actual data returned by the API
    //         // This is highly dependent on the API's response structure.
    //         // Example for Alpha Vantage Global Quote:
    //         // if (data && data['Global Quote']) {
    //         //     const quote = data['Global Quote'];
    //         //     const price = parseFloat(quote['05. price']).toFixed(2);
    //         //     const change = parseFloat(quote['09. change']).toFixed(2);
    //         //     const changePercent = parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2);

    //         //     valueElement.textContent = parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    //         //     const changeText = `${change > 0 ? '+' : ''}${parseFloat(change).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${changePercent > 0 ? '+' : ''}${changePercent}%)`;
    //         //     changeElement.textContent = changeText;

    //         //     changeElement.classList.remove('positive', 'negative');
    //         //     if (change > 0) {
    //         //         changeElement.classList.add('positive');
    //         //     } else if (change < 0) {
    //         //         changeElement.classList.add('negative');
    //         //     }
    //         // } else {
    //         //     console.error(`Could not get data for ${symbol}. API response:`, data);
    //         // }

    //     } catch (error) {
    //         console.error(`Error fetching real data for ${symbol}:`, error);
    //         // Optionally update UI to show error (e.g., "Data N/A")
    //     }
    // };

    // // Call the real data fetcher for each index
    // fetchRealMarketData('^DJI', djiaValue, djiaChange);
    // fetchRealMarketData('SPY', sp500Value, sp500Change); // Using SPY (S&P 500 ETF) as ^GSPC might be limited
    // fetchRealMarketData('QQQ', nasdaqValue, nasdaqChange); // Using QQQ (Nasdaq 100 ETF) as ^IXIC might be limited
    // fetchRealMarketData('^FTSE', ftse100Value, ftse100Change);

    // updateTimeSpan.textContent = new Date().toLocaleTimeString('en-GB');
    */
}

// Add a class to the body of market.html to easily target it with JavaScript
if (window.location.pathname.includes('market.html')) {
    document.body.classList.add('market-page');
}