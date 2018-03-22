import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import ProfilePicture from './ProfilePicture';

export default class WGDrawer extends React.Component {
  render() {
    return (
      <div>
        <Drawer
          open={this.props.open}
          docked={false}
          onRequestChange={(open) => this.props.close(open)}
        >
          <ProfilePicture />
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
        </Drawer>
      </div>
    );
  }
}