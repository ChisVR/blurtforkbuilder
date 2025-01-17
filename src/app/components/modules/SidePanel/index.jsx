import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import CloseButton from 'app/components/elements/CloseButton';
import Icon from 'app/components/elements/Icon';
import { Link } from 'react-router';

const SidePanel = ({
    alignment,
    visible,
    hideSidePanel,
    username,
    walletUrl,
}) => {
    if (process.env.BROWSER) {
        visible && document.addEventListener('click', hideSidePanel);
        !visible && document.removeEventListener('click', hideSidePanel);
    }

    const loggedIn =
        username === undefined
            ? 'show-for-small-only'
            : 'SidePanel__hide-signup';

    const makeLink = (i, ix, arr) => {
        // A link is internal if it begins with a slash
        const isExternal = !i.link.match(/^\//) || i.isExternal;
        if (isExternal) {
            const cn = ix === arr.length - 1 ? 'last' : null;
            return (
                <li key={i.value} className={cn}>
                    <a
                        href={i.link}
                        target={i.internal ? null : '_blank'}
                        rel="noopener noreferrer"
                    >
                        {i.label}&nbsp;
                        <Icon name="extlink" />
                    </a>
                </li>
            );
        } else {
            const cn = ix === arr.length - 1 ? 'last' : null;
            return (
                <li key={i.value} className={cn}>
                    <Link to={i.link}>{i.label}</Link>
                </li>
            );
        }
    };

    const sidePanelLinks = {
        internal: [
            {
                value: 'welcome',
                label: tt('navigation.welcome'),
                link: 'https://wallet.blurt.one/welcome',
            },
            {
                value: 'faq',
                label: tt('navigation.faq'),
                link: 'https://wallet.blurt.one/faq.html',
            },
            {
                value: 'tags',
                label: tt('navigation.explore'),
                link: '/tags',
            },
            {
                value: 'dapps',
                label: 'Dapps',
                link: '/dapps',
            },
            {
                value: 'change_password',
                label: tt('navigation.change_account_password'),
                link: `${walletUrl}/change_password`,
            },
            {
                value: 'account_recovery_tools',
                label: tt('navigation.account_recovery_tools'),
                link: 'https://recovery.blurtwallet.com',
            },
            {
                value: 'vote_for_witnesses',
                label: tt('navigation.vote_for_witnesses'),
                link: `${walletUrl}/~witnesses`,
            },
        ],
        exchanges: [
            {
                value: 'probit',
                label: 'Probit',
                link: 'https://www.probit.com/app/exchange/BLURT-BTC/r/54051558',
            },
            {
                value: 'ionomy',
                label: 'Ionomy',
                link: 'https://exchange.ionomy.com/en/markets/btc-blurt',
            },
            {
                value: 'robiniaswap',
                label: 'Robinia Swap',
                link: 'https://robiniaswap.com/',
            },
            {
                value: 'beldex',
                label: 'Beldex',
                link: 'https://www.beldex.io/tradeAdvance?pair=BLURT_BTC',
            },
            {
                value: 'stex',
                label: 'Stex',
                link: 'https://app.stex.com/en/trade/pair/BTC/BLURT/1D',
            },
            {
                value: 'hive-engine',
                label: 'Hive Engine',
                link: 'https://hive-engine.com/?p=market&t=SWAP.BLURT',
            },
            // {
            //     value: 'steem-engine',
            //     label: 'Steem Engine',
            //     link: 'https://steem-engine.net/?p=market&t=BLURT',
            // },
            {
                value: 'leodex',
                label: 'Leodex',
                link: 'https://leodex.io/market/SWAP.BLURT',
            },
            {
                value: 'tribaldex',
                label: 'Tribaldex',
                link: 'https://tribaldex.com/trade/SWAP.BLURT',
            },
        ],
        external: [
            {
                value: 'gitlab',
                label: 'GitLab',
                link: 'https://gitlab.com/blurt/blurt/',
            },
            {
                value: 'chat',
                label: tt('navigation.chat'),
                link: 'https://discord.blurt.world/',
            },
        ],
        block_explorers: [
            {
                value: 'blurt_explorer',
                label: 'Blurt Explorer',
                link: 'https://blocks.blurtwallet.com',
            },
            {
                value: 'ecosynthesizer',
                label: 'Ecosynthesizer',
                link: 'https://ecosynthesizer.com/blurt/',
            },
            // {
            //     value: 'api_docs',
            //     label: tt('navigation.api_docs'),
            //     link: 'https://developers.steem.io/',
            // },
        ],
        organizational: [
            // {
            //     value: 'bluepaper',
            //     label: tt('navigation.bluepaper'),
            //     link: 'https://steem.io/steem-bluepaper.pdf',
            // },
            // {
            //     value: 'smt_whitepaper',
            //     label: tt('navigation.smt_whitepaper'),
            //     link: 'https://smt.steem.io/',
            // },
            // {
            //     value: 'whitepaper',
            //     label: tt('navigation.whitepaper'),
            //     link: 'https://steem.io/SteemWhitePaper.pdf',
            // },
            {
                value: 'about',
                label: tt('navigation.about'),
                link: '/about.html',
                internal: true,
            },
        ],
        legal: [
            {
                value: 'privacy',
                label: tt('navigation.privacy_policy'),
                link: '/privacy.html',
            },
            {
                value: 'tos',
                label: tt('navigation.terms_of_service'),
                link: '/tos.html',
            },
        ],
        extras: [
            {
                value: 'login',
                label: tt('g.sign_in'),
                link: '/login.html',
            },
            {
                value: 'signup',
                label: tt('g.sign_up'),
                link: 'https://signup.blurtwallet.com',
            },
            {
                value: 'post',
                label: tt('g.post'),
                link: '/submit.html',
            },
        ],
        swag: [
            {
                value: 'logo-merch',
                label: 'Logo Merch',
                link: 'https://www.redbubble.com/shop/ap/51822392',
            },
            {
                value: 'text-merch',
                label: 'Text Merch',
                link: 'https://www.redbubble.com/shop/ap/51897803',
            },
        ],
    };

    return (
        <div className="SidePanel">
            <div className={(visible ? 'visible ' : '') + alignment}>
                <CloseButton onClick={hideSidePanel} />
                <ul className={`vertical menu ${loggedIn}`}>
                    {sidePanelLinks.extras.map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    {sidePanelLinks.internal.map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    {sidePanelLinks.external.map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">Block Explorers</a>
                    </li>
                    {sidePanelLinks.block_explorers.map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">
                            {tt('navigation.third_party_exchanges')}
                        </a>
                    </li>
                    {sidePanelLinks.exchanges.map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">
                            {tt('navigation.blurt_swag')}
                        </a>
                    </li>
                    {sidePanelLinks.swag.map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    {sidePanelLinks.organizational.map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    {sidePanelLinks.legal.map(makeLink)}
                </ul>
            </div>
        </div>
    );
};

SidePanel.propTypes = {
    alignment: PropTypes.oneOf(['left', 'right']).isRequired,
    visible: PropTypes.bool.isRequired,
    hideSidePanel: PropTypes.func.isRequired,
    username: PropTypes.string,
};

SidePanel.defaultProps = {
    username: undefined,
};

export default connect(
    (state, ownProps) => {
        const walletUrl = state.app.get('walletUrl');
        return {
            walletUrl,
            ...ownProps,
        };
    },
    (dispatch) => ({})
)(SidePanel);
