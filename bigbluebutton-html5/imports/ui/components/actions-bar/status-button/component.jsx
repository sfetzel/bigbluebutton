import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Styled from './styles';
import BBBMenu from '/imports/ui/components/common/menu/component';

const messages = defineMessages({
  disableAnimationsLabel: {
    id: 'app.actionsBar.statusButton.disableAnimationsLabel',
    description: 'label for option to disable status/emoji animations',
  },
  enableAnimationsLabel: {
    id: 'app.actionsBar.statusButton.enableAnimationsLabel',
    description: 'label for option to enable status/emoji animations',
  },
  // The following messages have been taken from user-list-item component
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
  normalizeEmojiName: PropTypes.func.isRequired,
  isMeteorConnected: PropTypes.bool,
  usersArray: PropTypes.arrayOf(PropTypes.shape({
    emoji: PropTypes.string,
    name: PropTypes.string.isRequired,
  })),
};

const defaultProps = {
  usersArray: [],
  isMeteorConnected: false,
};

class StatusButton extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      enableAnimations: true,
    };

    this.getActionsList = this.getActionsList.bind(this);
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
    const { enableAnimations } = this.state;

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
        this.handleClose();
      },
      icon: 'clear_status',
    });

    const changeAnimationLabel = enableAnimations
      ? messages.enableAnimationsLabel : messages.disableAnimationsLabel;
    availableActions.push({
      allowed: true,
      key: 'enableAnimations',
      label: intl.formatMessage(changeAnimationLabel),
      onClick: () => {
        this.setState({ enableAnimations: !enableAnimations });
        this.handleClose();
      },
    });

    return availableActions;
  }

  render() {
    const {
      currentUser,
      usersArray,
      normalizeEmojiName,
      intl,
    } = this.props;
    const { selected, enableAnimations } = this.state;
    const label = intl.formatMessage(messages.statusTriggerLabel);

    const actions = this.getActionsList();
    const isStatusEmpty = currentUser.emoji === 'none';

    return (
      <div>
        { enableAnimations
          ? (
            <>
              {usersArray ? usersArray.map((user) => (
                <Styled.Smiley key={user.userId + user.emoji}>
                  { user.emoji !== 'none' ? user.name : '' }
                  <Styled.SmileyIcon iconName={normalizeEmojiName(user.emoji)} />
                </Styled.Smiley>
              ))
                : ''}
            </>
          )
          : null}
        <BBBMenu
          trigger={(
            <Styled.EmojiStatusButton
              circle
              size="lg"
              hideLabel
              color={!isStatusEmpty ? 'primary' : 'default'}
              label={label}
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
StatusButton.defaultProps = defaultProps;

export default injectIntl(StatusButton);
