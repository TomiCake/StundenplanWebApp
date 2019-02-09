import React from 'react';
import { withStyles, List } from '@material-ui/core';
import { connect } from 'react-redux';
import SearchItem from './SearchItem';
import makeGetSelectionList from '../../Selector/print';

const styles = theme => ({

});

class UserSelection extends React.Component {

    timeout = 0;
    toFetch = [];

    handleToggle = ({ checked, id }) => {
        let value = this.props.value;
        if (value.find(entry => entry.id === id)) {
            value = value.filter(entry => entry.id !== id);
        } else {
            value = [...value, {...this.props.selectionList.find(entry => entry.id === id)}]
        }
        this.props.onChange({
            target: {
                name: this.props.name,
                value: value,
            }
        });
    }

    onFetch = () => {
        const entry = this.props.value.find(entry => entry.progress !== 100);
        if (entry) {
            this.props.fetchTimetable(entry);
            
        } else {
            clearInterval(this.timeout);
        }
    }

    componentDidMount() {
        const value = this.props.selectionList.map(entry => ({
            ...entry,
        }));
        this.props.onChange({
            target: {
                name: this.props.name,
                value,
            }
        })
        if (this.timeout) {
            clearInterval(this.timeout);
        }
        this.timeout = setInterval(this.onFetch, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timeout);
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectionList !== prevProps.selectionList) {
            this.props.onChange({
                target: {
                    name: this.props.name,
                    value: this.props.selectionList.map(entry => ({
                        ...entry,
                    })),
                }
            })
            if (this.timeout) {
                clearInterval(this.timeout);
            }
            this.timeout = setInterval(this.onFetch, 1000);
        }
    }


    render() {
        const { classes, selectionList } = this.props;
        return (
            <List dense className={classes.root}>
                {selectionList.map(entry => (
                    <SearchItem
                        key={entry.id}
                        onToggle={this.handleToggle}
                        id={entry.id}
                        type={entry.type}
                        upn={entry.upn}
                        text={entry.text}
                        secondary={entry.secondary}
                        progress={entry.progress}
                        checked={this.props.value && Boolean(this.props.value.find(entity => entity.id === entry.id))}
                    ></SearchItem>
                ))}
            </List>
        );
    }
}
const makeMapStateToProps = () => {
    const getSelectionList = makeGetSelectionList();
    return (state, props) => ({
        selectionList: getSelectionList(state, props),
    });
}

const mapDispatchToProps = dispatch => ({
    fetchTimetable: ({ id, type }) => dispatch({ type: 'FETCH_TIMETABLE', payload: { id, type } })
})


export default withStyles(styles)(connect(makeMapStateToProps, mapDispatchToProps)(UserSelection));