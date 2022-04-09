const regex = {
    // sanitize: /^https:\/\/w\.soundcloud\.com\/player\/.*?url=(.+?)&.*/i,
    // sanitize: /^https:\/\/anchor\.fm\/\w*\/embed\/episodes\/.*/i,
    sanitize: /^https:\/\/anchor\.fm\/.*\/embed\/episodes\/.*/,
};

export default regex;
export const sandboxConfig = {
    useSandbox: true,
    sandboxAttributes: ['allow-scripts', 'allow-same-origin', 'allow-popups'],
};

{/* <iframe src="https://anchor.fm/famigliacurione/embed/episodes/Self-Empowerment---Are-You-Living-According-to-Your-Beliefs-e1fnib0/a-a7iuu5t" height="102px" width="400px" frameborder="0" scrolling="no"></iframe> */}

export function validateAnchorFmIframeUrl(url) {
    const match = url.match(regex.sanitize);

    if (!match || match.length !== 2) {
        return false;
    }

    // return url;
    return `${match[0]}`;
    // return `https://w.soundcloud.com/player/?url=${match[1]}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true`;
}

export function genAnchorFmIframeMd(url) {
    return (
        <div key={`anchor-fm`} className="videoWrapper">
            <iframe
                title="Anchor Fm Embedded Player"
                key={idx}
                src={url}
                width="400"
                height="102"
                frameBorder="0"
                allowFullScreen
                allow="fullscreen"
                scrolling="no"
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

// export function extractMetadata(data) {
//     if (!data) return null;

//     const match = data.match(regex.sanitize);
//     const url = match ? match[0] : null;
//     if (!url) return null;
//     const fullId = match[1];
//     const id = fullId.split('/').pop();

//     return {
//         id,
//         fullId,
//         url
//     };
// }

// export function preprocessHtml(child) {
//     try {
//         if (typeof child === 'string') {
//             // If typeof child is a string, this means we are trying to process the HTML
//             // to replace the image/anchor tag created by 3Speak dApp
//             const anchorfm = extractMetadata(child);
//             if (anchorfm) {
//                 child = child.replace(
//                     regex.htmlReplacement,
//                     `~~~ embed:${threespeak.fullId} threespeak ~~~`
//                 );
//             }
//         }
//     } catch (error) {
//         console.log(error);
//     }

//     return child;
// }
