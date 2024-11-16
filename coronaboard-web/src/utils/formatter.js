import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const numberFormatter = new Intl.NumberFormat('ko-KR');

export function numberWithCommas(x) {
    return numberFormatter.format(x);
}

export function formatDiff(cur, prev) {
    const diff = cur - prev;

    if (diff === undefined || isNaN(diff) || diff === 0) {
        return '(-)';
    }

    if (diff > 0) {
        return `(+${numberWithCommas(diff)})`;
    } else {
        return `(${numberWithCommas(diff)})`;
    }
}

export function formatDiffForTable(cur, prevOptional) {
    const prev = prevOptional || 0;
    const diff = cur - prev;

    if (diff === 0) {
        return '';
    }

    return formatDiff(cur, prev);
}

export function convertToMonthDay(dateString) {
    return format(parseISO(dateString), 'M.d');
}

export function numberWithUnitFormatter(value) {
    if (value >= 100000000) {
        return (value / 100000000).toFixed(1) + '억';
    } else if (value >= 10000) {
        return (value / 10000).toFixed(1) + '만';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + '천';
    } else if (value >= 100) {
        return value.toFixed(1) + '백';
    } else {
        return value;
    }
}