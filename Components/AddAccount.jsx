const { React, getModule } = require('powercord/webpack');
const { Modal } = require('powercord/components/modal');
const { FormTitle, Card, Button } = require('powercord/components');
const { close } = require('powercord/modal');
const { TextInput } = require('powercord/components/settings');

module.exports = class SwitchaccModal extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			account: this.addAccount(),
		};
	}

	render() {
		console.log(this.state.account);
		return (
			<Modal className='acc-switch-modal'>
				<Modal.Header>
					<FormTitle tag='h3'>Add Account</FormTitle>
				</Modal.Header>
				<Modal.Content>
					{this.state.account && (
						<Card>
							<TextInput value={this.state.account.name} onChange={value => this.editAccount('name', value)}>
								Name:
							</TextInput>
							<TextInput value={this.state.account.pfp} onChange={value => this.editAccount('name', value)}>
								Profile:
							</TextInput>
							<TextInput value={this.state.account.token} onChange={value => this.editAccount('name', value)}>
								Token:
							</TextInput>
						</Card>
					)}
				</Modal.Content>
				<Modal.Footer>
					<Button
						onClick={() => {
							this.saveAccount(this.state.account);
							close();
						}}
					>
						Save
					</Button>
					<Button onClick={close}>Back</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	getCurrentUser() {
		return getModule(['getCurrentUser'], false).getCurrentUser();
	}

	editAccount(modify, value) {
		const account = { ...this.state.account };
		account[modify] = value;
		this.setState({ account });
	}

	saveAccount(account) {
		const accounts = this.props.getSetting('accounts', []);
		accounts.push(account);
		this.props.setSetting('accounts', accounts);
	}

	addAccount() {
		const { getToken } = getModule(['getToken'], false);

		const account = { name: this.getCurrentUser().tag, token: getToken(), id: this.getCurrentUser().id, pfp: this.getCurrentUser().getAvatarURL() };
		return account;
	}
};
