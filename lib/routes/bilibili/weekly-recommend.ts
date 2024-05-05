import { Route } from '@/types';
import got from '@/utils/got';
import utils from './utils';

export const route: Route = {
    path: '/weekly/:disableEmbed?',
    categories: ['social-media'],
    example: '/bilibili/weekly',
    parameters: { disableEmbed: '默认为开启内嵌视频, 任意值为关闭' },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: 'B 站每周必看',
    maintainers: ['ttttmr'],
    handler,
};

async function handler(ctx) {
    const disableEmbed = ctx.req.param('disableEmbed');

    const status_response = await got({
        method: 'get',
        url: 'https://app.bilibili.com/x/v2/show/popular/selected/series?type=weekly_selected',
        headers: {
            Referer: 'https://www.bilibili.com/h5/weekly-recommend',
        },
    });
    const weekly_number = status_response.data.data[0].number;
    const weekly_name = status_response.data.data[0].name;

    const response = await got({
        method: 'get',
        url: `https://app.bilibili.com/x/v2/show/popular/selected?type=weekly_selected&number=${weekly_number}`,
        headers: {
            Referer: `https://www.bilibili.com/h5/weekly-recommend?num=${weekly_number}&navhide=1`,
        },
    });
    const data = response.data.data.list;

    return {
        title: 'B站每周必看',
        link: 'https://www.bilibili.com/blackboard/html5mobileplayer.html?aid=${item.param}&hasMuteButton=0',
        description: 'B站每周必看',
        item: data.map((item) => ({
            title: item.title,
            // description: `${weekly_name} ${item.title}<br>${item.rcmd_reason}<br>${!disableEmbed ? `${utils.iframe(item.param)}` : ''}<img src="${item.cover}">`,
            description: `
                ${weekly_name} ${item.title}<br>
                ${item.rcmd_reason}<br>
                ${disableEmbed ? '' : utils.iframe(item.param)}<img src="${item.cover}"><br>
                >>open
                <button id="test1" onclick="document.getElementsByClassName('mplayer-icon-widescreen')[0].click();">点我3</button>
            `,
            link: `https://www.bilibili.com/blackboard/html5mobileplayer.html?aid=${item.param}&hasMuteButton=0`,
        })),
    };
}
