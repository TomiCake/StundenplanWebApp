import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { grey, indigo } from '@material-ui/core/colors';
import { darken } from '@material-ui/core/styles';
import useSpecificSubsitutionType from './useSpecificSubsitutionType';
import classNames from 'classnames';

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            flexGrow: 1,
            backgroundColor: props =>
                props.backgroundColor || theme.lesson.secondary.background,
            paddingRight: theme.spacing(0.5),
        },
        colorBar: {
            width: 3,
            marginRight: theme.spacing(0.5),
            flexShrink: 0,
            backgroundColor: props => props.color || theme.lesson.secondary.colorBar,
        },
    }),
    { name: 'Lesson' }
);

export default React.forwardRef(function Lesson({ children, specificSubstitutionType, className, ...other }) {
    const styles = useSpecificSubsitutionType(specificSubstitutionType);
    const classes = useStyles(styles);

    return (
        <div {...other} className={classNames(className, classes.root)}>
            <div className={classes.colorBar}></div>
            {children}
        </div>
    );
});
