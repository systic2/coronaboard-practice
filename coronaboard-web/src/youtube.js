const axios = require('axios')
const TimeAgo = require('javascript-time-ago');
const ko = require('javascript-time-ago/locale/ko');
TimeAgo.addLocale(ko);
const timeAgoKorean = new TimeAgo('ko-KR');

const apiKey = 'AIzaSyAqoMT5310B1QOfGGoOX5vrda-j21kcWbM';

function truncateText(text, maxLength) {
    if (!text) {
        return '';
    }

    if (text.length > maxLength) {
        return text.substr(0, maxLength) + '...';
    } else {
        return text;
    }
}

function convertModel(item) {
    const { id, snippet, statistics } = item;
    return {
        videoUrl: 'https://www.youtube.com/watch?v=' + id,
        publishedAt: timeAgoKorean.format(Date.parse(snippet.publishedAt)),
        channelTitle: snippet.channelTitle,
        thumbnail: snippet.thumbnails ? snippet.thumbnails.medium.url : '',
        description: truncateText(snippet.description, 80),

        viewCount: parseInt(statistics.viewCount),
    };
}

async function getYouTubeVideosByKeyword(keyword) {
    const searchResponse = await axios.get(
        'https://content.googleapis.com/youtube/v3/search',
        {
            params: {
                key: apiKey,
                q: keyword,
                type: 'video',
                part: 'id',
                maxResults: 3,
            },
        },
    );

    const ids = searchResponse.data.items.map(x => x.id.videoId);
    const detailResponse = await axios.get(
        'https://content.googleapis.com/youtube/v3/videos',
        {
            params: {
                key: apiKey,
                id: ids.join(','),
                order: 'relevance',
                part: 'snippet,statistics',
            },
        },
    );

    return detailResponse.data.items.map(convertModel)
}

module.exports = {
    getYouTubeVideosByKeyword,
}