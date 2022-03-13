import * as config from 'config';
import * as blurtjs from '@blurtfoundation/blurtjs';
import { Http } from 'node-https';

/**
 * Load special posts - including notices,contests, featured, and promoted.
 *
 * @returns {promise} resolves to object of {featured_posts:[], promoted_posts:[], notices:[], contests: []}
 */
async function loadSpecialPosts() {
    const emptySpecialPosts = {
        featured_posts: [],
        promoted_posts: [],
        notices: [],
        contests: [],
    };

    if(!config.special_posts_url) {
        return emptySpecialPosts;
    }

    try {
        const http = new Http();
        const postsResult = await http.get(config.special_posts_url);
        if(postsResult.data) {
            return postsResult.data;
        }
        console.error('Could not load special posts', postsResult.data);
        return emptySpecialPosts;
    } catch(e) {
        console.error('Could not load special posts', e);
        return emptySpecialPosts;
    }
}

/**
 * [async] Get special posts - including notices, featured, and promoted.
 *
 * @returns {object} object of {featured_posts:[], promoted_posts:[], notices:[]}
 */
// eslint-disable-next-line import/prefer-default-export
export async function specialPosts() {
    console.info('Loading special posts');

    const postData = await loadSpecialPosts();

    console.log('Post data', postData);

    const loadedPostData = {
        featured_posts: [],
        promoted_posts: [],
        notices: [],
        contests: [],
    };

    postData.featured_posts.forEach(async (url) => {
        const [username, postId] = url.split('@')[1].split('/');
        const post = await blurtjs.api.getContentAsync(username, postId);
        post.special = true;
        loadedPostData.featured_posts.push(post);
    });

    postData.promoted_posts.forEach(async (url) => {
        const [username, postId] = url.split('@')[1].split('/');
        const post = await blurtjs.api.getContentAsync(username, postId);
        post.special = true;
        loadedPostData.promoted_posts.push(post);
    });

    postData.notices.forEach(async (notice) => {
        if (notice.permalink) {
            const [username, postId] = notice.permalink
                .split('@')[1]
                .split('/');
            const post = await blurtjs.api.getContentAsync(username, postId);
            loadedPostData.notices.push({ ...notice, ...post });
        } else {
            loadedPostData.notices.push(notice);
        }
    });

    if (postData.contests) {
        postData.contests.forEach(async (contest) => {
            if (contest.permalink) {
                const [username, postId] = contest.permalink
                    .split('@')[1]
                    .split('/');
                const post = await blurtjs.api.getContentAsync(username, postId);
                loadedPostData.contests.push({ ...contest, ...post });
            } else {
                loadedPostData.contests.push(contest);
            }
        });
    }

    console.info(
        `Loaded special posts: featured: ${loadedPostData.featured_posts.length}, 
        promoted: ${loadedPostData.promoted_posts.length}, notices: ${loadedPostData.notices.length}, contest: ${loadedPostData.contests.length}`
    );

    return loadedPostData;
}
