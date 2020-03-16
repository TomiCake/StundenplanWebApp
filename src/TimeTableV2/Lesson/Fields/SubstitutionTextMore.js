import React from 'react';
import { makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';


const useStyles = makeStyles(theme => ({
    root: {
        color: grey[600],
        fontSize: theme.typography.pxToRem(10),
    }
}), { name: "SubstitutionTextMore" });

export default function SubstitutionTextMore({ substitutionText, specificSubstitutionType }) {
    const classes = useStyles();

    const texts = [substitutionText, specificSubstitutionType && specificSubstitutionType.name]
        .sort((t1, t2) => (t1 ? t1.length : Infinity) - (t2 ? t2.length : Infinity));

    // use the text that is shorter

    const textMore = texts[1];
    if (!textMore) {
        return null;
    }
    return (
        <div className={classes.root}>
            ({textMore})
        </div>
    )
}