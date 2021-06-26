const { React, getModule } = require('powercord/webpack');
const { Modal } = require('powercord/components/modal');
const { FormTitle, Card, Button, Text, Icon, Tooltip } = require('powercord/components');
const { open } = require('powercord/modal');
const AddAccountModal = require('./AddAccount');
const EditAccountModal = require('./EditAccount');

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
			<Modal className='acc-switch-modal'>
				<Modal.Header>
					<FormTitle tag='h3'>Accounts</FormTitle>
				</Modal.Header>
				<Modal.Content>
					{this.state.accounts?.map((account, idx) => (
						<Card>
							<div
								className={['account', this.state.selected === account.token && 'selected-account'].filter(Boolean).join(' ')}
								onClick={e => {
									if (e.target.type == 'button' || e.target.parentElement.parentElement?.parentElement.type === 'button') return;
									let selected = this.state.selected;
									selected = account.token;
									this.setState({ selected });
								}}
							>
								<img src={account.pfp} />
								<div className='account-details'>
							        <div class='accountName'>{account.name}
										<Tooltip text='Edit' position='top' color='black'>
											<Icon
												name='Pencil'
												onClick={() =>
													open(() =>
														React.createElement(EditAccountModal, {
															account: { ...account, idx },
															getSetting: this.props.getSetting,
															setSetting: this.props.setSetting,
														})
													)
												}
											/>
										</Tooltip>
									</div>
									<div className='Token'>
										<Text className='tokenText'>Token:</Text>
										<Text className='tokenValue'>{account.token}</Text>
									</div>
								</div>
								<div className='account-buttons'>
									<Button onClick={() => this.removeAccount(idx)} color={Button.Colors.RED} size={Button.Sizes.SMALL}>
										X
									</Button>
								</div>
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

	removeAccount(account) {
		const accounts = [...this.state.accounts];
		accounts.splice(account, 1);
		this.setState({ accounts });
		this.props.setSetting('accounts', accounts);
	}

	loginTo(account) {
		if (!account) return;
		if (getModule(['getToken'], false).getToken() === account) return;
		const { loginToken } = getModule(['loginToken'], false);
		loginToken(account);
	}
};
