const { Plugin } = require('powercord/entities');
const { getModule, getModuleByDisplayName, React, ReactDOM } = require('powercord/webpack');
const { Tooltip } = require('powercord/components');
const { inject, uninject } = require('powercord/injector');
const { open } = require('powercord/modal');
const SwitchIcon = require('./Components/svg');
const Modal = require('./Components/Modal');

module.exports = class AccSwitcher extends Plugin {
	startPlugin() {
		this.loadStylesheet('style.css');
		const classes = getModule(['iconWrapper', 'clickable'], false);
		const HeaderBarContainer = getModuleByDisplayName('HeaderBarContainer', false);
		inject('switch-acc-button', HeaderBarContainer.prototype, 'renderLoggedIn', (args, res) => {
			const SwitchButton = React.createElement(
				Tooltip,
				{ text: 'Switch Account', position: 'bottom' },
				React.createElement(
					'div',
					{ className: ['switch-acc-button', classes.iconWrapper, classes.clickable].join(' ') },
					React.createElement(SwitchIcon, {
						className: ['switch-acc-button', classes.icon].join(' '),
						onClick: () => open(() => React.createElement(Modal, { getSetting: this.settings.get, setSetting: this.settings.set })),
					})
				)
			);

			if (!res.props.toolbar) {
				res.props.toolbar = SwitchButton;
			} else {
				res.props.toolbar.props.children.push(SwitchButton);
			}

			return res;
		});
	}

	pluginWillUnload() {
		uninject('switch-acc-button');
	}
};
