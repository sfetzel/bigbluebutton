import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Styled from './styles';
import Icon from '/imports/ui/components/common/icon/component';
import BBBMenu from '/imports/ui/components/common/menu/component';

// Messages taken from user-list-item component
const messages = defineMessages({
  statusTriggerLabel: {
    id: 'app.actionsBar.emojiMenu.statusTriggerLabel',
    description: 'label for option to show emoji menu',
  },
  ClearStatusLabel: {
    id: 'app.userList.menu.clearStatus.label',
    description: 'Clear the emoji status of this user',
  },
});

const propTypes = {
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  getEmojiList: PropTypes.func.isRequired,
  setEmojiStatus: PropTypes.func.isRequired,
  isMeteorConnected: PropTypes.bool.isRequired,
  usersArray: PropTypes.arrayOf({
    emoji: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
  }).isRequired,
  normalizeEmojiName: PropTypes.func.isRequired,
};

class StatusButton extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isActionsOpen: false,
      selected: false,
    };

    this.getActionsList = this.getActionsList.bind(this);
    this.resetMenuState = this.resetMenuState.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ selected: null });
  }

  /**
   * Creates a list of actions for the status button.
   * Contains for each emoji an entry, to set the current status to the emoji.
   * Also contains an entry to reset the status.
   * @returns a list for a BBBMenu.actions property
   */
  getActionsList() {
    const {
      getEmojiList, currentUser, setEmojiStatus, isMeteorConnected, intl,
    } = this.props;

    const emojiList = getEmojiList();
    const statuses = Object.keys(emojiList);
    const availableActions = [];

    statuses.forEach((s) => {
      availableActions.push({
        allowed: isMeteorConnected,
        key: s,
        label: intl.formatMessage({ id: `app.actionsBar.emojiMenu.${s}Label` }),
        onClick: () => {
          setEmojiStatus(currentUser.userId, s);
          this.resetMenuState();
          this.handleClose();
        },
        icon: emojiList[s],
        dataTest: s,
      });
    });

    availableActions.push({
      allowed: isMeteorConnected,
      key: 'clearStatus',
      label: intl.formatMessage(messages.ClearStatusLabel),
      onClick: () => {
        setEmojiStatus(currentUser.userId, 'none');
        this.resetMenuState();
        this.handleClose();
      },
      icon: 'clear_status',
    });

    return availableActions;
  }

  resetMenuState() {
    return this.setState({
      isActionsOpen: false,
      selected: false,
    });
  }

  render() {
    const {
      currentUser,
      usersArray,
      normalizeEmojiName,
      intl,
    } = this.props;
    const { isActionsOpen, selected } = this.state;
    const label = intl.formatMessage(messages.statusTriggerLabel);

    const actions = this.getActionsList();
    const isStatusEmpty = currentUser.emoji === 'none';

    return (
      <div>
        <div style={{ position: 'absolute' }}>
          {usersArray ? usersArray.map((user) => <Styled.Smiley key={user.userId + user.emoji}><Icon iconName={normalizeEmojiName(user.emoji)} /></Styled.Smiley>) : ''}
        </div>
        <BBBMenu
          trigger={(
            <Styled.EmojiStatusButton
              circle
              size="lg"
              hideLabel
              color={!isStatusEmpty ? 'primary' : 'default'}
              label={label}
              isActionsOpen={isActionsOpen}
              selected={selected === true}
              tabIndex={-1}
              role="button"
              icon={!isStatusEmpty ? normalizeEmojiName(currentUser.emoji) : 'happy'}
              onClick={() => {}}
            />
          )}
          actions={actions}
        />

      </div>
    );
  }
}

StatusButton.propTypes = propTypes;

export default injectIntl(StatusButton);
