import React from 'react';
import { makeStyles } from '@material-ui/core';
import GridCell from '../GridCell';
import { classNames } from '../../../Common/const';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(.5),
        display: 'flex',
        overflow: 'hidden',
    }
}), { name: "ThemedGridCell" });

export default function ThemedGridCell({ children, className, ...other }) {
    const classes = useStyles();
    return (
        <GridCell {...other} className={classNames(classes.root, className)}>
            {children}
        </GridCell>
    )
}