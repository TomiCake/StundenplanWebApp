import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import makeGetSearchResult from '../../Selector/search';
import SearchItem from './SearchItem';
import VList from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import makeStyles from '@material-ui/styles/makeStyles';
import useKeyPress from '../../Common/hooks/useKeyDown';
import { setTimeTable, addTimeTable } from '../actions';

const useStyles = makeStyles(theme => ({
    overflow: {
        overflowY: 'auto',
        flex: 1,
    },
}));

const SearchResult = ({ results, onClick, addTimeTable, setTimeTable }) => {
    const classes = useStyles();
    const [selected, setSelected] = useState(0);
    const small = useSelector(state => state.browser.lessThan.medium);
    useKeyPress(e => {
        if (e.keyCode === 38 || e.key === 'ArrowUp') {
            setSelected(Math.max(0, selected - 1));
        }
        if (e.keyCode === 40 || e.key === 'ArrowDown') {
            setSelected(Math.min(results.length - 1, selected + 1));
        }
        if (e.charCode === 13 || e.key === 'Enter') {
            onClick(results[selected]);
        }
    });

    function handleClick(mode) {    
        return (object) => {
            onClick(object);
            if (mode === 'add') {
                addTimeTable(object);
            } else if (mode === 'set') {
                setTimeTable(object);
            }
        }
    }

    useEffect(() => {
        setSelected(0);
    }, [results]);

    return (
        <div className={classes.overflow}>
            <AutoSizer>
                {({ width, height }) => (
                    <VList
                        rowCount={results.length}
                        rowHeight={({ index }) => (results[index].secondary ? 61 : 48)}
                        rowRenderer={({ index, key, style }) => {
                            const object = results[index];

                            return (
                                <SearchItem
                                    key={key}
                                    object={object}
                                    onClick={handleClick('set')}
                                    onContextMenu={handleClick('add')}
                                    selected={!small && selected === index}
                                    style={style}
                                />
                            );
                        }}
                        scrollToIndex={0}
                        width={width}
                        height={Math.min(results.length * 61, height - 2)}
                    />
                )}
            </AutoSizer>
        </div>
    );
};

const makeMapStateToProps = () => {
    const getSearchResult = makeGetSearchResult();
    return (state, { filter, value }) => ({
        results: getSearchResult(state, { filter, value }),
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        setTimeTable: (obj) => dispatch(setTimeTable(obj.type, obj.id)),
        addTimeTable: (obj) => dispatch(addTimeTable(obj.type, obj.id)),

    };
};

export default connect(makeMapStateToProps, mapDispatchToProps)(SearchResult);
