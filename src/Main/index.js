import React, {
    Component
} from "react";
import {
    connect
} from "react-redux";
import Snackbar from 'material-ui/Snackbar';
import {
    clearErrors,
    checkCounter,
    setNotification,
    showError,
    setMyTimetable,
    counterChanged,
    sendLoginStatistic
} from "./actions"
import TimeTable from "../TimeTable"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from './components/AppBar';
import Theme from '../Common/theme';
import ReactInterval from 'react-interval';
import { connectToServiceWorker } from '../Common/firebase';
import PrintProvider from 'react-easy-print';


class Main extends Component {

    constructor(props) {
        super(props);
        props.checkCounter();
        this.props.setMyTimetable();
        this.props.sendLoginStatistic();
        props.needsUpdate && props.counterChanged(true);
        if (this.props.notificationToken) {
            connectToServiceWorker(this.props.setNotification, this.props.notificationToken);
        }
    }

    componentWillUpdate(nextProps) {
        if (this.props.needsUpdate !== nextProps.needsUpdate) {
            nextProps.counterChanged(nextProps.needsUpdate);
        }
    }

    componentWillMount() {
        if (this.props.notificationToken && navigator.serviceWorker) {
        }
    }


    render() {
        return (
            <PrintProvider>
                <MuiThemeProvider muiTheme={Theme}>
                    <div style={{ flexDirection: 'column', display: 'flex', height: '100%' }}>
                        <AppBar />
                        <TimeTable />
                        <Snackbar
                            open={!!this.props.error}
                            message={"Fehler: " + this.props.error}
                            autoHideDuration={15000}
                            contentStyle={{
                                color: 'red'
                            }}
                            onRequestClose={this.props.clearErrors} />
                        <ReactInterval timeout={60 * 1000} enabled={true} callback={this.props.checkCounter} />
                    </div>
                </MuiThemeProvider>
            </PrintProvider>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMyTimetable: () => { dispatch(setMyTimetable()) },
        sendLoginStatistic: () => { dispatch(sendLoginStatistic()) },
        counterChanged: (changed) => dispatch(counterChanged(changed)),
        checkCounter: () => { dispatch(checkCounter()); },
        clearErrors: () => { dispatch(clearErrors()); },
        showError: (text) => { dispatch(showError(text)); },
        setNotification: (token) => { dispatch(setNotification(token)); }
    };
};

const mapStateToProps = state => {
    return {
        loading: state.user.loading,
        needsUpdate: state.user.counterChanged,
        type: state.user.type,
        id: state.user.id,
        error: state.error.error,
        notificationToken: state.user.notificationToken
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);