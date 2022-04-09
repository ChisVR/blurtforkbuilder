const regex = {
    // sanitize: /^https:\/\/emb\.d\.tube\/#!\/([a-zA-Z0-9-.\/]+)$/,
    // main: /https:\/\/(?:emb\.)?(?:d\.tube\/#!\/(?:v\/)?)([a-zA-Z0-9\-.\/]*)/,
    // contentId: /(?:d\.tube\/#!\/(?:v\/)?([a-zA-Z0-9\-.\/]*))+/,
    anchor: /^https:\/\/anchor\.fm\/.*\/embed\/episodes\/.*/
};

export default regex;
export const sandboxConfig = {
    useSandbox: true,
    sandboxAttributes: ['allow-scripts', 'allow-same-origin'],
};

export function genIframeMd(idx, authorId, chapterTitle, chapterId, w, h) {
    const anchorURL = `https://anchor.fm/${authorId}/embed/episodes/${chapterTitle}/${chapterId}`;
    return (
        <div key={`anchor-fm-${chapterId}-${idx}`} className="videoWrapper">
            <iframe
                title="Anchor Fm embedded player"
                key={idx}
                src={anchorURL}
                width={w}
                height={h}
                frameBorder="0"
                allowFullScreen
                sandbox={
                    sandboxConfig.useSandbox
                        ? sandboxConfig.sandboxAttributes
                            ? sandboxConfig.sandboxAttributes.join(' ')
                            : true
                        : ''
                }
            />
        </div>
    );
}

// <iframe title="DTube embedded player" src="https://emb.d.tube/#!/lemwong/QmQqxBCkoVusMRwP6D9oBMRQdASFzABdKQxE7xLysfmsR6" width="640" height="360" frameborder="0" allowfullscreen=""></iframe>
export function validateIframeUrl(url) {
    const match = url.match(regex.anchor);

    if (match) {
        return url;
    }

    return false;
}

// export function normalizeEmbedUrl(url) {
//     const match = url.match(regex.contentId);

//     if (match && match.length >= 2) {
//         return `https://emb.d.tube/#!/${match[1]}`;
//     }

//     return false;
// }

function extractMetadata(data) {
    if (!data) return null;

    const authorId = data.replace('https://anchor.fm/', '').split('/')[0];

    const episodeTitle = data.replace('https://anchor.fm/', '').split('/')[3];
    const episodeId = data.replace('https://anchor.fm/', '').split('/')[4];

    const m = data.match(regex.anchor);
    if (!m || m.length < 2) return null;

    return {
        authorId,
        episodeId,
        episodeTitle,
        url: data,
    };
}

export function embedNode(child, links /* images */) {
    try {
        const { data } = child;
        const anchorfm = extractMetadata(data);
        if (!anchorfm) return child;

        child.data = data.replace(anchorfm.url, `~~~ embed:${anchorfm.authorId} dtube ~~~`);

        // if (links) links.add(dtube.canonical);
    } catch (error) {
        console.log(error);
    }

    return child;
}
