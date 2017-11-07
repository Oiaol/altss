const axios = require("axios");

const Discord = require("discord.js");

const client = new Discord.Client();

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
client.on("ready", () => {
	const guild = client.guilds.get('id')
	const channel = guild.channels.get('id')
	
	const wholeFunction = async (pricChange, volChange, pricText, pricDecText, volText, delay) => {
		const apiData = await sendApiRequest();
		const tickers = Object.keys(apiData);

		const volumeIncDec = [];
		const priceIncrease = [];
		const priceDecrease = [];

		const afterDelayData = await sendApiRequest(delay);
		tickers.forEach((ticker) => {
			const apiTicker = apiData[ticker] || {};
			const delayTicker = afterDelayData[ticker] || {};
		  
			const apiTickerVolume = apiTicker.volume;
			const apiTickerPrice = apiTicker.price;
			const delayTickerVolume = delayTicker.volume;
			const delayTickerPrice = delayTicker.price;
		  
			let volumeChange;
			let priceChange;
		  
			if (apiTickerVolume && delayTickerVolume) volumeChange = percentChange(apiTickerVolume, delayTickerVolume);
			
			if (apiTickerPrice && delayTickerPrice) priceChange = percentChange(apiTickerPrice, delayTickerPrice);
		  
		  	if(priceChange > pricChange && volumeChange > volChange) priceIncrease.push(`${ticker} - Price Up **${priceChange}**% - Volume Up **${volumeChange}**% // Last Price = ${delayTickerPrice} ${ticker.split('-')[0]} = $${parseFloat(afterDelayData[tickers[index]].price * afterDelayData[`USDT-${ticker.split('-')[0]}`].price).toFixed(3)}`);
			else if(priceChange < -pricChange) priceDecrease.push(`${ticker} - Price Down **${priceChange}**% - Volume Change **${volumeChange}**% // Last Price = ${delayTickerPrice} ${ticker.split('-')[0]} = $${parseFloat(delayTickerPrice * afterDelayData[`USDT-${ticker.split('-')[0]}`].price).toFixed(3)}`);
			else if(volumeChange > volChange || volumeChange < -volChange) volumeIncDec.push(`${ticker} - Price Change **${priceChange}**% - Volume ${volumeChange > volChange ? "Up" : "Down"} **${volumeChange}**% // Last Price = ${delayTickerPrice} ${ticker.split('-')[0]} = $${parseFloat(delayTickerPrice * afterDelayData[`USDT-${ticker.split('-')[0]}`].price).toFixed(3)}`);
		  });
		if(priceIncrease.length) channel.send(`⏰ ${currentDateTime()}\n${pricText}\n${priceIncrease.join("\n")}`, { split: true });
		
		if(priceDecrease.length) channel.send(`⏰ ${currentDateTime()}\n${pricDecText}\n${priceDecrease.join("\n")}`, { split: true });
		
		if(volumeIncDec.length) channel.send(`⏰ ${currentDateTime()}\n${volText}\n${volumeIncDec.join("\n")}`, { split: true });
		
		setTimeout(wholeFunction, 2000, pricChange, volChange, pricText, pricDecText, volText, delay, delay2);
	};
	wholeFunction(5, 7, "⚡ Flash Pumps (last 10m):", "🌩 Flash Dumps (last 10m):", "📊 Volume Alerts (last 10m):", 600000); // 10 min
	wholeFunction(5, 10, "📈 Current Pumps (last 20m):", "📉 Current Dumps (last 20m):", "📊 Volume Alerts (last 20m):", 1200000); // 20 min
	wholeFunction(10, 10, "🐢 Slow Pumps (last 4h):", "🐌 Slow Dumps (last 4h):", "📊 Volume Alerts (last 4h):", 14400000); // 4 hour
});
