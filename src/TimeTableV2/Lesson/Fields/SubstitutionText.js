import React from 'react';
import { makeStyles, Tooltip, Typography } from '@material-ui/core';
import useSpecificSubsitutionType from '../useSpecificSubsitutionType';


const useStyles = makeStyles(theme => ({
    root: {
        color: props => props.color,
        fontSize: theme.typography.pxToRem(11),
        fontWeight: 600,
    }
}), { name: "SubstitutionText" });

export default function SubstitutionText({ substitutionText, specificSubstitutionType }) {
    const styles = useSpecificSubsitutionType(specificSubstitutionType);
    const classes = useStyles(styles);

    const texts = [substitutionText, specificSubstitutionType && specificSubstitutionType.name]
        .sort((t1, t2) => (t1 ? t1.length : Infinity) - (t2 ? t2.length : Infinity));

    // use the text that is shorter
    
    const textMain = texts[0];

    return (
        <Typography className={classes.root} variant="subtitle2" noWrap>
            {textMain}
        </Typography>
    )
}