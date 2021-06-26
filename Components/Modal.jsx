const { React, getModule } = require('powercord/webpack');
const { Modal } = require('powercord/components/modal');
const { FormTitle, Card, Button, Text } = require('powercord/components');
const { open } = require('powercord/modal');
const AddAccountModal = require('./AddAccount');

module.exports = class SwitchaccModal extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			accounts: props.getSetting('accounts', []),
			selected: null,
		};
	}

	render() {
		return (
			<Modal className="acc-switch-modal">
				<Modal.Header>
					<FormTitle tag="h3">Accounts</FormTitle>
				</Modal.Header>
				<Modal.Content>
					{this.state.accounts?.map(account => (
						<Card>
							<div
								className={['account', this.state.selected === account.token && 'selected-account'].filter(Boolean).join(' ')}
								onClick={() => {
									let selected = this.state.selected;
									selected = account.token;
									this.setState({ selected });
								}}
							>
								<div className="account-details">
									<img src={account.pfp} />
									<Text>{account.name}</Text>
								</div>
								<Text>Token:</Text>
								<Text>{account.token}</Text>
							</div>
						</Card>
					))}
				</Modal.Content>
				<Modal.Footer>
					<Button color={this.state.selected ? Button.Colors.BRAND : Button.Colors.GREY} onClick={() => this.loginTo(this.state.selected)}>
						Switch
					</Button>
					<Button
						onClick={() => {
							if (this.state.accounts?.filter(acc => acc.token === getModule(['getToken'], false).getToken()).length > 0) return;
							open(() => React.createElement(AddAccountModal, { getSetting: this.props.getSetting, setSetting: this.props.setSetting }));
						}}
					>
						Add current account
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	getCurrentUser() {
		return getModule(['getCurrentUser'], false).getCurrentUser();
	}

	loginTo(account) {
		if (!account) return;
		if (getModule(['getToken'], false).getToken() === account) return;
		const { loginToken } = getModule(['loginToken'], false);
		loginToken(account);
	}
};
