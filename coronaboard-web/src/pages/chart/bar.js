import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from "react-bootstrap";
import { Echart } from "../../components/echart";
import { css } from "@emotion/react";

export default function BarChart() {
    const labelOptions = {
        show: true,
        position: 'top',
    };

    const series = [
        {
            name: '확진',
            type: 'bar',
            color: '#e2431e',
            label: labelOptions,
            data: [743, 556, 485, 454, 602],
        },
    ];

    const chartOption = {
        title: {
            text: '대한민국 코로나 19 추이',
            left: 'center',
        },
        legend: {
            data: series.map(x => x.name),
            bottom: 20,
        },
        xAxis: {
            data: ['6.5', '6.6', '6.7', '6.8', '6.9'],
        },
        yAxis: {},
        tooltip: {
            trigger: 'axis',
        },
        series,
        animation: false,
    };

    return (
        <Container>
            <Echart
                wrapperCss={css`
                    width: 100%;
                    height: 400px;
                `}
                option={chartOption}
            />
        </Container>
    )
}