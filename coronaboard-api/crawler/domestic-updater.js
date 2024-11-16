const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { format, utcToZonedTime } = require('date-fns-tz');
const DomesticCrawler = require('./domestic-crawler');

async function crawlAndUpdateDomestic(outputPath, apiClient) {
    let prevData = {};
    const domesticStatPath = path.join(outputPath, 'domestic-stat.json');
    try {
        prevData = JSON.parse(fs.readFileSync(domesticStatPath, 'utf-8'));
    } catch (e) {
        console.log('previous domesticStat not found');
    }

    const domesticCrawler = new DomesticCrawler();

    const now = new Date();
    const timeZone = 'Asia/Seoul';
    const crawledDate = format(utcToZonedTime(now, timeZone), 'yyyy-MM-dd');

    const newData = {
        crawledDate,
        domesticStat: await domesticCrawler.crawlStat(),
    };

    if (_.isEqual(newData, prevData)) {
        console.log('domesticStat has not been changed');
        return;
    }

    fs.writeFileSync(domesticStatPath, JSON.stringify(newData));

    const newDomesticStat = newData.domesticStat;
    const {
        confirmed,
        released,
        death,
        tested,
        testing,
        negative,
    } = newDomesticStat.basicStats;

    await apiClient.upsertGlobalStat({
        cc: 'KR',
        date: crawledDate,
        confirmed,
        released,
        death,
        tested,
        testing,
        negative,
    });

    const { byAge, bySex } = newDomesticStat;
    const value = JSON.stringify({ byAge, bySex });
    await apiClient.upsertKeyValue('byAgeAndSex', value);

    console.log('domesticStat updated successfully');
}

module.exports = { crawlAndUpdateDomestic };