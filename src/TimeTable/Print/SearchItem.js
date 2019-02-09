import React from 'react';
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Checkbox } from '@material-ui/core';
import { ObjectIcon } from '../../Main/components/Avatars';


class SearchItem extends React.PureComponent {

    handleToggle = () => {
        this.props.onToggle(this.props);
    }

    render() {
        const { type, upn, text, secondary, progress } = this.props;
        return (
            <ListItem
                dense
                button
                onClick={this.handleClick}
            // {...(i === 0 && { className: classes.listItemSelected })}
            >
                <ListItemIcon>
                    <ObjectIcon
                        type={type}
                        upn={upn}
                    />
                </ListItemIcon>
                <ListItemText inset primary={text} secondary={secondary + " " + progress + '%'} />
                <ListItemSecondaryAction>
                    <Checkbox
                        onChange={this.handleToggle}
                        checked={this.props.checked}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}
export default SearchItem;