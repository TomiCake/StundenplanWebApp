import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import PrintIcon from '@material-ui/icons/Print';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Grow from '@material-ui/core/Grow';
import { Checkbox, ListItemIcon, FormGroup, Typography, FormLabel, Input, FormHelperText } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PrintProvider from './PrintProvider';
import green from '@material-ui/core/colors/green';
import UserSelection from './UserSelection';

const styles = theme => ({
    wrapper: {
        display: 'flex',
        overflowY: 'hidden',
        [theme.breakpoints.down('sm')]: {
            display: 'block'
        }
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    preview: {
        flex: 1,
        backgroundColor: theme.palette.grey[300],
        position: 'relative',
    },
    printPreview: {
        padding: theme.spacing.unit * 3,
        overflowY: 'auto',
        height: '100%',
        boxSizing: 'border-box',
    },
    pageA4: {
        height: 800,
        width: `${800 * 1 / Math.sqrt(2)}px`,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    toast: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: green[600],
        padding: theme.spacing.unit,
        zIndex: 1,
    },
});

class PrintDialog extends React.PureComponent {
    state = {
        format: 'A4',
        orientation: 'vertical',
        openPrint: false,
        substitutions: true,
    };

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState(state => ({ [name]: value || !state[name] }));
    };

    onPrint = () => {
        this.setState({ openPrint: true });
    }
    handlePrintClose = () => {
        this.setState({ openPrint: false });
        this.props.onClose();
    }

    render() {
        const { open, onClose, classes } = this.props;
        return (
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
                TransitionComponent={Grow}
            >
                <div className={classes.wrapper}>
                    <div className={classes.root}>
                        <DialogTitle>
                            <ListItemIcon>
                                <PrintIcon></PrintIcon>
                            </ListItemIcon>
                            Drucken
                        </DialogTitle>
                        <DialogContent>
                            <form className={classes.root} autoComplete="off">
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="orientation">Layout</InputLabel>
                                    <Select
                                        value={this.state.orientation}
                                        onChange={this.handleChange}
                                        inputProps={{
                                            name: 'orientation',
                                            id: 'orientation',
                                        }}
                                    >
                                        <MenuItem value="horizontal">Horizontal</MenuItem>
                                        <MenuItem value="vertical">Vertikal</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <FormGroup>

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.background}
                                                    onChange={this.handleChange}
                                                    name="background" />
                                            }
                                            label="Hintergrund anzeigen"
                                        />
                                    </FormGroup>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="type">Typ</InputLabel>
                                    <Select
                                        value={this.state.type}
                                        onChange={this.handleChange}
                                        input={<Input name="type" id="type" />}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'room'}>Räume</MenuItem>
                                        <MenuItem value={'teacher'}>Lehrer</MenuItem>
                                        <MenuItem value={'class'}>Klasse</MenuItem>
                                    </Select>
                                    <FormHelperText>Some important helper text</FormHelperText>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <FormLabel>Entitäten</FormLabel>
                                    <UserSelection
                                        value={this.state.selected}
                                        name="selected"
                                        onChange={this.handleChange}
                                        selectedType={this.state.type} />
                                </FormControl>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose} color="secondary">
                                Abbrechen
                            </Button>
                            <Button onClick={this.onPrint} color="primary">
                                Drucken
                            </Button>
                        </DialogActions>
                    </div>
                    <div className={classes.preview}>
                        <Typography className={classes.toast}>
                            Es werden nicht alle Seiten angezeigt!
                        </Typography>
                        <div className={classes.printPreview}>
                            <PrintProvider
                                open={open}
                                background={this.state.background}
                                horizontal={this.state.orientation === 'horizontal'}
                                openPrint={this.state.openPrint}
                                onPrintClose={this.handlePrintClose}
                                substitutions={false}
                            >
                                {this.state.selected && this.state.selected.map(entry => {
                                    return (
                                        <page key={entry.id} id={entry.id} type={entry.type}></page>
                                    )
                                })}
                            </PrintProvider>
                        </div>
                    </div>
                </div>
            </Dialog>
        )
    }
}


export default withStyles(styles)(PrintDialog);