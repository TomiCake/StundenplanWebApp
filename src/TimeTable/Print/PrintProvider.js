import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TimeTableContainer from '../components/container';
import { classNames } from '../../Common/const';
import './print.css';

const styles = theme => ({
    more: {
        backgroundColor: 'white',
        padding: 8,
        pointerEvents: 'none',
        marginBottom: 8,
        filter: 'blur(2px)'
    },
    layout: {
        backgroundColor: 'white',
        padding: 8,
        pointerEvents: 'none',
        marginBottom: 8,
        overflow: 'hidden',
        '& *': {
            transition: theme.transitions.create('background')
        }
    },
    noBackground: {
        '& *': {
            background: 'none',
        }
    },

})

class PrintProvider extends React.Component {
    state = {};

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.open) {
            return false;
        }
        return this.props.horizontal !== nextProps.horizontal
            || this.props.substitutions !== nextProps.substitutions
            || this.props.children !== nextProps.children
            || this.props.openPrint !== nextProps.openPrint
            || this.props.background !== nextProps.background
            || this.state.pageStyles !== nextState.pageStyles;
    };


    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    componentDidUpdate(prevProps) {
        if (this.props.horizontal !== prevProps.horizontal
            || this.props.substitutions !== prevProps.substitutions
            || this.props.background !== prevProps.background) {
            this.handleResize();
        }
        if (this.props.openPrint !== prevProps.openPrint && this.props.openPrint) {
            this.print();
        }
    }

    print() {
        const node = document.body.appendChild(this.refs.page);
        const pageLayout = `@page { size: ${this.props.horizontal ? 'landscape' : 'portrait'};}`;
        const layout = document.createElement('style');
        layout.innerHTML = pageLayout;
        document.body.appendChild(layout);
        window.print();
        this.props.onPrintClose();
        layout.remove();
        node.remove();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = (event) => {
        if (!this.refs.page) {
            return;
        }
        const { horizontal } = this.props;
        const clientWidth = this.refs.page.clientWidth;
        const height = clientWidth * (horizontal ? 1 / Math.sqrt(2) : Math.sqrt(2));
        this.setState({
            pageStyles: { height },
        });
    }


    render() {
        const { pageStyles } = this.state;
        const { classes, background, openPrint } = this.props;
        const childArray = React.Children.toArray(this.props.children);
        const children = openPrint ? childArray : childArray.slice(0, 3);
        const hasMore = childArray.length > 3;
        return (
            <div ref="page" className={classNames("print-page")}>
                {React.Children.map(children, (child, index) => {
                    if (child.type !== 'page') {
                        throw Error('children is not a page');
                    }
                    const { id, type } = child.props;
                    const more = hasMore && !openPrint && index === children.length - 1;
                    return (
                        <div
                            className={classNames(classes.layout, "print-page-layout", !background && classes.noBackground, more && classes.more)}
                            key={index} style={pageStyles}>
                            <TimeTableContainer
                                {...(!this.props.substitutions && { date: null, noSubstitutions: true })}
                                print
                                id={id}
                                type={type}
                                small={false}
                            />
                        </div>

                    );
                })}

            </div>
        )
    }
}



export default withStyles(styles)(PrintProvider);