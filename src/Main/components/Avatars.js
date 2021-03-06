import React from 'react';
import { Avatar } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import ClassIcon from '@material-ui/icons/Group';
import RoomIcon from '@material-ui/icons/Room';
import SubjectIcon from '@material-ui/icons/Book';
import moment from 'moment';
import createStore from '../../store';
import { makeGetEffectiveAvatar } from '../../Selector/avatars';
import { connect } from 'react-redux';
const { store } = createStore();

export const checkAvatars = (upns, loadAvatars) => {
    const { avatars } = store.getState();
    const r = upns.filter((upn) => {
        if (!upn || !avatars) return false;
        const avatar = avatars[upn];
        return !avatar || moment(avatar.expires).isBefore(moment())
    });
    for (let i = 0; i < r.length; i += 10) {
        loadAvatars(r.slice(i, i + 10));
    }
};

export const ObjectIcon = ({ type, upn, size, profilePicSize, outline, ...other }) => {
    if (type === 'class') {
        return <ClassIcon {...other} />;
    }
    if (type === 'subject') {
        return <SubjectIcon {...other} />;
    }
    if (type === 'room' || type === 'all') {
        return <RoomIcon {...other} />;
    }
    return <ProfilePicture {...({ upn, size, profilePicSize, outline, ...other })} />;
}



const ProfilePictureComponent = ({ avatar, size = 24, profilePicSize, outline = false, dispatch, ...other }) =>
    (avatar && avatar.img
        ? <Avatar src={"data:image/jpg;base64," + avatar.img}
            {...(size && { style: { height: profilePicSize || size, width: profilePicSize || size } })}
            {...other}
             />
        : outline ?
            <Avatar {...(size && { style: { height: size, width: size } })} {...other}>
                <PersonIcon />
            </Avatar>
            :
            <PersonIcon {...(size && { style: { height: size, width: size } })} {...other}/>
    );

const makeMapStateToProps = () => {
    const getEffectiveAvatar = makeGetEffectiveAvatar();
    return (state, props) => ({
        avatar: getEffectiveAvatar(state, props),
    });
}

export const ProfilePicture = connect(makeMapStateToProps, null)(ProfilePictureComponent);