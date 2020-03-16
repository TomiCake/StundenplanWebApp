import React from 'react';
import { makeStyles } from '@material-ui/styles';
import StudentView from './Fields/Views/StudentView';
import { useMediaQuery } from '@material-ui/core';
import TeacherView from './Fields/Views/TeacherView';
import RoomView from './Fields/Views/RoomView';
import SubstitutionTextMore from './Fields/SubstitutionTextMore';

const useStyles = makeStyles(theme => ({
    split: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    root: {
        width: '100%',
        overflow: 'hidden',
        paddingTop: theme.spacing(.5),
        paddingBottom: theme.spacing(.5),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    left: {
        float: 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    right: {
        float: 'right',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
        textAlign: 'right',
    }
}), { name: 'LessonContent' });

export default function LessonContent({ lesson }) {
    const profile = lesson.profile;
    const small = useMediaQuery('(max-width:600px)');
    const View = {
        'student': StudentView,
        'class': StudentView,
        'teacher': TeacherView,
        'room': RoomView,
    }[profile.type];
    const { left, right } = View(lesson);
    const { substitutionText, specificSubstitutionType } = lesson;

    const classes = useStyles();

    if (small) {
        return (
            <div className={classes.root}>
                {left}
                {right}
                <SubstitutionTextMore
                    substitutionText={substitutionText}
                    specificSubstitutionType={specificSubstitutionType}
                ></SubstitutionTextMore>
            </div>
        )
    }

    return (
        <div className={classes.root}>
            <div className={classes.split}>
                <div className={classes.left}>
                    {left}
                </div>
                <div className={classes.right}>
                    {right}
                </div>

            </div>
            <SubstitutionTextMore
                substitutionText={substitutionText}
                specificSubstitutionType={specificSubstitutionType}
            ></SubstitutionTextMore>
        </div>
    )
}