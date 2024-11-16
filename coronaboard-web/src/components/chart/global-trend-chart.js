import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import {
    convertToMonthDay,
    numberWithUnitFormatter,
} from '../../utils/formatter';
import { Echart } from '../echart';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { colors } from '../../config';

export function GlobalTrendChart(props) {
    const { countryByCc } = props;
    const defaultSelectedItem = {
        value: 'global',
        label: '전 세계',
    };

    const [chartData, setChartData] = useState(null);
    const [dataType, setDataType] = useState('acc');
    const [selectedItem, setSelectedItem] = useState(defaultSelectedItem);
    const countryCodes = Object.keys(countryByCc);
    useEffect(() => {
        async function fetchDataWithCc(cc) {
            const response = await axios.get(`/generated/${cc}.json`);
            setChartData(response.data);
        }
        fetchDataWithCc(selectedItem.value);
    }, [selectedItem]);

    if (!chartData) {
        return <div>Loading...</div>;
    }

    const chartOption = generateChartOption(chartData, dataType);
    const selectOption = [
        defaultSelectedItem,
        ...countryCodes.map((cc) => ({
            value: cc,
            label: countryByCc[cc].title_ko,
        })),
    ];

    return (
        <Card>
            <Card.Body>
                <Echart
                    wrapperCss={css`
                        width: 100%;
                        height: 400px;
                    `}
                    option={chartOption}
                />
                <div className="d-flex justify-content-center">
                    <ButtonGroup
                        size='sm'
                        css={css`
                            padding: 0 10px;
                            `}
                    >
                        <Button
                        variant="outline-primary"
                        active={dataType === 'acc'}
                        onClick={() => setDataType('acc')}
                        >
                            누적
                        </Button>
                        <Button
                        variant='outline-primary'
                        active={dataType === 'daily'}
                        onClick={() => setDataType('daily')}
                        >
                            일별
                        </Button>

                    </ButtonGroup>
                    <Select
                    styles={{
                        container: (provided) => ({
                            ...provided,
                            width: '160px',
                        }),
                        menu: (provided) => ({
                            ...provided,
                            width: '160px',
                        }),
                    }}
                    value={selectedItem}
                    onChange={(selected => {setSelectedItem(selected);})}
                    options={selectOption}
                />
                </div>
            </Card.Body>
        </Card>
    )
}

function generateChartOption(data, dataType) {
    const seriesAccList = [
        {
            name: '누적확진',
            type: 'line',
            data: data.confirmedAcc,
            color: colors.confirmed,
        },
        {
            name: '누적사망',
            type: 'line',
            data: data.deathAcc,
            color: colors.death,
        },
        {
            name: '누적격리해제',
            type: 'line',
            data: data.releasedAcc,
            color: colors.released,
        },
    ];

    const seriesDailyList = [
        {
            name: '확진',
            type: 'bar',
            data: data.confirmed,
            color: colors.confirmed,
        },
        {
            name: '사망',
            type: 'bar',
            data: data.death,
            color: colors.death,
        },
        {
            name: '격리해제',
            type: 'bar',
            data: data.released,
            color: colors.released,
        },
    ];

    let legendData;
    let series;
    let dataZoomStart;

    if (dataType === 'acc') {
        legendData = seriesAccList.map((x) => x.name);
        series = seriesAccList;
        dataZoomStart = 30;
    } else if (dataType === 'daily') {
        legendData = seriesDailyList.map((x) => x.name);
        series = seriesDailyList;
        dataZoomStart = 85;
    } else {
        throw new Error(`Not supported dataType: ${dataType}`);
    }

    return {
        animation: false,
        title: {
            text: '전 세계 코로나(COVID-19) 추이',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: legendData,
            bottom: 50,
        },
        grid: {
            top: 70,
            left: 40,
            right: 10,
            bottom: 100,
        },
        dataZoom: [
            {
                type:'slider',
                show: true,
                start: dataZoomStart,
                end: 100,
            },
        ],
        xAxis: {
            data: data.date.map(convertToMonthDay),
        },
        yAxis: {
            axisLabel: {
                rotate: 50,
                formatter: numberWithUnitFormatter,
            },
        },
        series,
    };
}