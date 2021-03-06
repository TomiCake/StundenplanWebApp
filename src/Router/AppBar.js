import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBarComponent from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Apps';
import { connect } from 'react-redux';
import ArrowBack from '@material-ui/icons/ArrowBack';

import UserSettingsMenu from '../Main/components/UserSettingsMenu';
import indigo from '@material-ui/core/colors/indigo';
import { toggleDrawer } from '../Main/actions';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';

var MainAppBar = process.env.REACT_APP_MODE === 'tv'
    ? require("../Main/components/TvAppBar").default
    : require("../Main/components/AppBar").default;


const styles = theme => ({
    appBar: {
        backgroundColor: indigo[600],
        paddingLeft: 10,
        paddingRight: 10,
        zIndex: theme.zIndex.modal,
    },
    toolbar: {
        minHeight: 64,
        justifyContent: 'space-between',
    },
    title: {
        width: '100%',
    },
    drawer: {
        marginRight: 20,
    }
});

class AppBar extends React.Component {
    handleDrawerToggle = () => {
        this.props.toggleDrawer();
    };

    render() {
        const { classes, location, history } = this.props;
        const content = (
            <UserSettingsMenu />
        );
        const appBarStyles = location.pathname === '/' ? { boxShadow: 'none' } : null;
        if (location.pathname.match(/posts\/.*/g)) {
            var state = {
                back: true,
                title: "Post editieren",
            }
        }
        return (
            <div>
                <AppBarComponent className={classes.appBar} style={appBarStyles}>
                    <Toolbar disableGutters variant="dense" className={classes.toolbar}>
                        {process.env.REACT_APP_MODE !== 'tv'
                            &&
                            state && state.back ?
                            <IconButton
                                color="inherit"
                                aria-label="go back"
                                className={classes.drawer}
                                onClick={history.goBack}>
                                <ArrowBack />
                            </IconButton>
                            : <IconButton
                                color="inherit"
                                className={classes.drawer}
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                        }
                        {state && state.title && 
                            <Typography variant="h6" color="inherit" className={classes.title}>
                                {state.title}
                            </Typography>
                        }
                        <Switch>
                            <Route path="/" exact render={() => <MainAppBar>{content}</MainAppBar>} />
                            <Route render={() => <div>{content}</div>} />
                        </Switch>
                    </Toolbar>
                </AppBarComponent>

                <div className={classes.toolbar} />
            </div>
        );
    }
}
AppBar.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        small: state.browser.lessThan.medium,
        large: state.browser.greaterThan.medium,
    };
};

const mapDispatchToProps = dispatch => ({
    toggleDrawer: () => dispatch(toggleDrawer()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AppBar)));