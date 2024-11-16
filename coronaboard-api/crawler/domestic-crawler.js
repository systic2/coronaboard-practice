const _ = require('lodash');
const axios = require('axios');
const cheerio = require('cheerio');

class DomesticCrawler {
    constructor() {
        this.client = axios.create({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36'
            },
        });
    }

    async crawlStat() {
        const url = 'https://yjiq150.github.io/coronaboard-crawling-sample/clone/ncov/';
        const resp = await this.client.get(url);
        const $ = cheerio.load(resp.data);

        return {
            basicStats: this._extractBasicStats($),
            byAge: this._extractByAge($),
            bySex: this._extractBySex($),
        };
    }

    _extractBasicStats($) {
        let result = null;
        const titles = $('h5.s_title_in3');
        titles.each((i, el) => {
            const titleTextEl = $(el).contents().toArray().filter((x) => x.type === 'text');
            
            if ($(titleTextEl).text().trim() === '누적 검사현황') {
                const tableEl = $(el).next();
                if (!tableEl) {
                    throw new Error('table not found');
                }
                const cellEls = tableEl.find('tbody tr td');
                const values = cellEls.toArray().map(node => this._normalize($(node).text()));

                result = {
                    confirmed: values[3],
                    released: values[1],
                    death: values[2],
                    tested: values[5],
                    testing: values[6],
                    negative: values[4],
                };
            }
        });

        if (result == null) {
            throw new Error('Data not found');
        }

        return result;
    }
    _extractByAge($) {
        const mapping = {
            '80 이상': '80',
            '70-79': '70',
            '60-69': '60',
            '50-59': '50',
            '40-49': '40',
            '30-39': '30',
            '20-29': '20',
            '10-19': '10',
            '0-9': '0',
        };

        return this._extractDataWithMapping(mapping, $);
    }
    _extractBySex($) {
        const mapping = {
            남성: 'male',
            여성: 'female',
        };

        return this._extractDataWithMapping(mapping, $);
    }

    _extractDataWithMapping(mapping, $) {
        const result = {};

        $('.data_table table').each((i, el) => {
            $(el).find('tbody tr').each((j, row) => {
                const cols = $(row).children();
                _.forEach(mapping, (fieldName, firstColumnText) => {
                    if ($(cols.get(0)).text() === firstColumnText) {
                        result[fieldName] = {
                            confirmed: this._normalize($(cols.get(1)).text()),
                            death: this._normalize($(cols.get(2)).text()),
                        };
                    }
                });
            });
        });

        if (_.isEmpty(result)) {
            throw new Error('data not found');
        }

        return result;
    }

    _normalize(numberText) {
        const matches = /[0-9,]+/.exec(numberText);
        const absValue = matches[0];
        return parseInt(absValue.replace(/[\s,]*/g, ''));
    }
}

module.exports = DomesticCrawler;