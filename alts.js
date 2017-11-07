const axios = require("axios");

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const currentDateTime = () => (`**${new Date().toLocaleString()}**`)

const percentChange = (a, b) => (100 * (b - a) / a).toFixed(3);

const sendApiRequest = async (timeout = 0) => {
	await wait(timeout);
	const { data: { result } } = await axios.get("https://bittrex.com/api/v2.0/pub/Markets/GetMarketSummaries");
	const sortedData = {};
	for(const i in result) sortedData[result[i].Market.MarketName] = { volume: result[i].Summary.BaseVolume, price: result[i].Summary.Last };
	return sortedData;
};
const bittrexAltAlerts = async () => {
	async function tenMin() {
		const returnedData = await sendApiRequest();
		const tickers = Object.keys(returnedData);

		const volumeIncDec = [];
		const priceIncrease = [];
		const priceDecrease = [];

		const after10MinData = await sendApiRequest(600000);
		for(const index in tickers) {
			const volumeChange = percentChange(returnedData[tickers[index]].volume, after10MinData[tickers[index]].volume);
			const priceChange = percentChange(returnedData[tickers[index]].price, after10MinData[tickers[index]].price);
			const currentTicker = tickers[index].split("-")[0];

			if(priceChange > 3 && volumeChange > 3) priceIncrease.push(`${tickers[index]} - Price Up **${priceChange}**% - Volume Up **${volumeChange}**% // Last Price = ${after10MinData[tickers[index]].price} ${currentTicker} = $${parseFloat(after10MinData[tickers[index]].price * after10MinData[`USDT-${currentTicker}`].price).toFixed(3)}`);
			else if(priceChange < -5) priceDecrease.push(`${tickers[index]} - Price Down **${priceChange}**% - Volume Change **${volumeChange}**% // Last Price = ${after10MinData[tickers[index]].price} ${currentTicker} = $${parseFloat(after10MinData[tickers[index]].price * after10MinData[`USDT-${currentTicker}`].price).toFixed(3)}`);
			else if(volumeChange > 10 || volumeChange < -10) volumeIncDec.push(`${tickers[index]} - Price Change **${priceChange}**% - Volume ${volumeChange > 10 ? "Up" : "Down"} **${volumeChange}**% // Last Price = ${after10MinData[tickers[index]].price} ${currentTicker} = $${parseFloat(after10MinData[tickers[index]].price * after10MinData[`USDT-${currentTicker}`].price).toFixed(3)}`);
		}

		if(priceIncrease.length) console.log(`⏰ ${currentDateTime()}\n⚡ Flash Pumps (last 10m):\n${priceIncrease.join("\n")}`);
		if(priceDecrease.length) console.log(`⏰ ${currentDateTime()}\n🌩 Flash Dumps (last 10m):\n${priceDecrease.join("\n")}`);
		if(volumeIncDec.length) console.log(`⏰ ${currentDateTime()}\n📊 Volume Alerts (last 10m):\n${volumeIncDec.join("\n")}`);


		tenMin();
	}

	async function twentyMin() {
		const returnedData = await sendApiRequest();
		const tickers = Object.keys(returnedData);

		const volumeIncDec = [];
		const priceIncrease = [];
		const priceDecrease = [];

		const after20minData = await sendApiRequest(1200000);
		for(const index in tickers) {
			const volumeChange = percentChange(returnedData[tickers[index]].volume, after20minData[tickers[index]].volume);
			const priceChange = percentChange(returnedData[tickers[index]].price, after20minData[tickers[index]].price);
			const currentTicker = tickers[index].split("-")[0];

			if(priceChange > 5 && volumeChange > 5) priceIncrease.push(`${tickers[index]} - Price Up **${priceChange}**% - Volume Up **${volumeChange}**% // Last Price = ${after20minData[tickers[index]].price} ${currentTicker} = $${parseFloat(after20minData[tickers[index]].price * after20minData[`USDT-${currentTicker}`].price).toFixed(3)}`);
			else if(priceChange < -5) priceDecrease.push(`${tickers[index]} - Price Down **${priceChange}**% - Volume Change **${volumeChange}**% // Last Price = ${after20minData[tickers[index]].price} ${currentTicker} = $${parseFloat(after20minData[tickers[index]].price * after20minData[`USDT-${currentTicker}`].price).toFixed(3)}`);
			else if(volumeChange > 10 || volumeChange < -10) volumeIncDec.push(`${tickers[index]} - Price Change **${priceChange}**% - Volume ${volumeChange > 10 ? "Up" : "Down"} **${volumeChange}**% // Last Price = ${after20minData[tickers[index]].price} ${currentTicker} = $${parseFloat(after20minData[tickers[index]].price * after20minData[`USDT-${currentTicker}`].price).toFixed(3)}`);
		}

		if(priceIncrease.length) console.log(`⏰ ${currentDateTime()}\n📈 Current Pumps (last 20m):\n${priceIncrease.join("\n")}`);
		if(priceDecrease.length) console.log(`⏰ ${currentDateTime()}\n📉 Current Dumps (last 20m):\n${priceDecrease.join("\n")}`);
		if(volumeIncDec.length) console.log(`⏰ ${currentDateTime()}\n📊 Volume Alerts (last 20m):\n${volumeIncDec.join("\n")}`);

		twentyMin();
	}
	async function fourHour() {
		const returnedData = await sendApiRequest();
		const tickers = Object.keys(returnedData);

		const priceIncrease = [];
		const priceDecrease = [];

		const afterFourHourData = await sendApiRequest(14400000);
		for(const index in tickers) {
			const volumeChange = percentChange(returnedData[tickers[index]].volume, afterFourHourData[tickers[index]].volume);
			const priceChange = percentChange(returnedData[tickers[index]].price, afterFourHourData[tickers[index]].price);
			const currentTicker = tickers[index].split("-")[0];

			if(priceChange > 10 && volumeChange > 10) priceIncrease.push(`${tickers[index]} - Price Up **${priceChange}**% - Volume Up **${volumeChange}**% // Last Price = ${afterFourHourData[tickers[index]].price} ${currentTicker} = $${parseFloat(afterFourHourData[tickers[index]].price * afterFourHourData[`USDT-${currentTicker}`].price).toFixed(3)}`);
			else if(priceChange < -10) priceDecrease.push(`${tickers[index]} - Price Down **${priceChange}**% - Volume Change **${volumeChange}**% // Last Price = ${afterFourHourData[tickers[index]].price} ${currentTicker} = $${parseFloat(afterFourHourData[tickers[index]].price * afterFourHourData[`USDT-${currentTicker}`].price).toFixed(3)}`);
		}

		if(priceIncrease.length) console.log(`⏰ ${currentDateTime()}\n🐢 Slow Pumps (last 4h):\n${priceIncrease.join("\n")}`);
		if(priceDecrease.length) console.log(`⏰ ${currentDateTime()}\n🐌 Slow Dumps (last 4h):\n${priceDecrease.join("\n")}`);


		fourHour();
	}

	tenMin();
	twentyMin();
	fourHour();
};
