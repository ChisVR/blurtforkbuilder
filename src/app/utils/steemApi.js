/* eslint-disable no-undef */
import { api } from '@blurtfoundation/blurtjs';
import axios from 'axios';
import { Client } from '@busyorg/busyjs';
import fetch from 'cross-fetch';

import stateCleaner from 'app/redux/stateCleaner';

export async function getStateAsync(url) {
    // strip off query string
    // eslint-disable-next-line prefer-destructuring
    url = url.split('?')[0];

    // strip off leading and trailing slashes
    if (url.length > 0 && url[0] == '/') url = url.substring(1, url.length);
    if (url.length > 0 && url[url.length - 1] == '/') {
        url = url.substring(0, url.length - 1);
    }

    // blank URL defaults to `trending`
    if (url === '') url = 'hot';

    // curation and author rewards pages are alias of `transfers`
    if (url.indexOf('/curation-rewards') !== -1) {
        url = url.replace('/curation-rewards', '/transfers');
    }
    if (url.indexOf('/author-rewards') !== -1) {
        url = url.replace('/author-rewards', '/transfers');
    }

    const raw = await api.getStateAsync(url);
    const chainProperties = await getChainProperties();
    if (chainProperties) {
        raw.props.operation_flat_fee = parseFloat(
            chainProperties.operation_flat_fee
        );
        raw.props.bandwidth_kbytes_fee = parseFloat(
            chainProperties.bandwidth_kbytes_fee
        );
    }

    await axios
        .get($STM_Config.price_info_url, { timeout: 3000 })
        .then((response) => {
            if (response.status === 200) {
                raw.props.price_per_blurt = Number(
                    response.data.price_usd
                ).toFixed(8);
            }
        })
        .catch((error) => {
            console.error(error);
        });

    await axios
        .get('https://blurt-coal.tekraze.com', {
            timeout: 3000,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then((response) => {
            const map = new Map();
            if (response.status === 200) {
                // eslint-disable-next-line no-restricted-syntax
                for (const data of response.data) {
                    map.set(data.name, data);
                }
                raw.blacklist = map;
            }
        })
        .catch((error) => {
            console.warn(error);
        });

    await fetch(
        'https://gitlab.com/blurt/openblurt/condenser-pinned/-/raw/master/dapps.json'
    )
        .then((response) => response.json())
        .then((data) => {
            if (data) raw.dapps = data;
        })
        .catch((err) => {
            console.warn('Cors Blocked for DApps', err);
        });

    const promotedMembersListURL = 'https://raw.githubusercontent.com/balvinder294/blurtlatam-pinned/main/verified.json';

    await axios
        .get(promotedMembersListURL, {
            timeout: 3000
        })
        .then((response) => {
            const map = new Map();
            if (response.status === 200) {
                // eslint-disable-next-line no-restricted-syntax
                for (const data of response.data) {
                    map.set(data.name, data);
                }
                raw.promoted_members = map;
            }
        })
        .catch((error) => {
            console.warn(error);
        });

    const rewardFund = await getRewardFund();
    if (rewardFund) {
        raw.reward_fund = rewardFund;
    }
    const blurtConfig = await getConfig();
    if (blurtConfig) {
        raw.blurt_config = blurtConfig;
    }

    const cleansed = stateCleaner(raw);
    return cleansed;
}

function getChainProperties() {
    return new Promise((resolve) => {
        api.getChainProperties((err, result) => {
            if (result) {
                resolve(result);
            } else {
                resolve({});
            }
        });
    });
}

function getRewardFund() {
    return new Promise((resolve) => {
        api.getRewardFund('post', (err, result) => {
            if (result) {
                resolve(result);
            } else {
                resolve({});
            }
        });
    });
}

function getConfig() {
    return new Promise((resolve) => {
        api.getConfig((err, result) => {
            if (result) {
                resolve(result);
            } else {
                resolve({});
            }
        });
    });
}

export async function callNotificationsApi(account) {
    console.log('call notifications api', account);
    return new Promise((resolve, reject) => {
        const client = new Client('wss://notifications.blurt.world');
        client.call('get_notifications', [account], (err, result) => {
            if (err !== null) reject(err);
            resolve(result);
        });
    });
}
