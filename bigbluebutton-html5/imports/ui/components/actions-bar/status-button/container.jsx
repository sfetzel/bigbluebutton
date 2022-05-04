import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import UserListService from '/imports/ui/components/user-list/service';
import StatusButton from './component';
import Auth from '/imports/ui/services/auth';
import { withUsersConsumer } from '/imports/ui/components/components-data/users-context/context';

const StatusButtonContainer = (props) => {
  const { users } = props;

  const {
    normalizeEmojiName,
    getEmojiList,
    setEmojiStatus,
  } = UserListService;

  const currentUser = users ? users[Auth.meetingID][Auth.userID] : null;
  const usersArray = users ? Object.values(users[Auth.meetingID]) : null;

  return (
    <StatusButton {
    ...{
      currentUser,
      normalizeEmojiName,
      usersArray,
      getEmojiList,
      setEmojiStatus,
      ...props,
    }
  }
    />
  );
};

export default withUsersConsumer(
  withTracker(({ users }) => ({
    users,
  }))(StatusButtonContainer),
);
