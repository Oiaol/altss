const axios = require("axios");

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const currentDateTime = () => `**${new Date().toLocaleString()}**`;

const percentChange = (a, b) => (100 * (b - a) / a).toFixed(3);

const sendApiRequest = async (timeout = 0) => {
	await wait(timeout);
	const { data: { result } } = await axios.get("https://bittrex.com/api/v2.0/pub/Markets/GetMarketSummaries");
	const sortedData = {};
	for(const i in result) sortedData[result[i].Market.MarketName] = { volume: result[i].Summary.BaseVolume, price: result[i].Summary.Last };
	return sortedData;
};

const wholeFunction = async (pricChange, volChange, pricText, pricDecText, volText, delay = 0) => {
	const apiData = await sendApiRequest();
	const tickers = Object.keys(apiData);

	const volumeIncDec = [];
	const priceIncrease = [];
	const priceDecrease = [];

	const afterDelayData = await sendApiRequest(delay);

	for(const index in tickers) {
		const volumeChange = percentChange(apiData[tickers[index]].volume, afterDelayData[tickers[index]].volume);
		const priceChange = percentChange(apiData[tickers[index]].price, afterDelayData[tickers[index]].price);

		const currentTicker = tickers[index].split("-")[0];

		if(priceChange > pricChange && volumeChange > volChange) priceIncrease.push(`${tickers[index]} - Price Up **${priceChange}**% - Volume Up **${volumeChange}**% // Last Price = ${afterDelayData[tickers[index]].price} ${currentTicker} = $${parseFloat(afterDelayData[tickers[index]].price * afterDelayData[`USDT-${currentTicker}`].price).toFixed(3)}`);
		else if(priceChange < -pricChange) priceDecrease.push(`${tickers[index]} - Price Down **${priceChange}**% - Volume Change **${volumeChange}**% // Last Price = ${afterDelayData[tickers[index]].price} ${currentTicker} = $${parseFloat(afterDelayData[tickers[index]].price * afterDelayData[`USDT-${currentTicker}`].price).toFixed(3)}`);
		else if(volumeChange > volChange || volumeChange < -volChange) volumeIncDec.push(`${tickers[index]} - Price Change **${priceChange}**% - Volume ${volumeChange > volChange ? "Up" : "Down"} **${volumeChange}**% // Last Price = ${afterDelayData[tickers[index]].price} ${currentTicker} = $${parseFloat(afterDelayData[tickers[index]].price * afterDelayData[`USDT-${currentTicker}`].price).toFixed(3)}`);
	}

	if(priceIncrease.length) console.log(`⏰ ${currentDateTime()}\n${pricText}\n${priceIncrease.join("\n")}`);
	if(priceDecrease.length) console.log(`⏰ ${currentDateTime()}\n${pricDecText}\n${priceDecrease.join("\n")}`);
	if(volumeIncDec.length) console.log(`⏰ ${currentDateTime()}\n${volText}\n${volumeIncDec.join("\n")}`);

	setTimeout(wholeFunction, 1000);
};

wholeFunction(5, 7, "⚡ Flash Pumps (last 10m):", "🌩 Flash Dumps (last 10m):", "📊 Volume Alerts (last 10m):", 600000); // 10 min
wholeFunction(5, 10, "📈 Current Pumps (last 20m):", "📉 Current Dumps (last 20m):", "📊 Volume Alerts (last 20m):", 1200000); // 20 min
wholeFunction(10, 10, "🐢 Slow Pumps (last 4h):", "🐌 Slow Dumps (last 4h):", "📊 Volume Alerts (last 4h):", 14400000); // 4 hour
