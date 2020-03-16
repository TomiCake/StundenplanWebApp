import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import blue from '@material-ui/core/colors/blue';
import { indigo, blueGrey, grey, lime } from '@material-ui/core/colors';
export default themeType =>
    createMuiTheme({
        typography: {
            fontFamily: `Roboto, system, -apple-system, system-ui, BlinkMacSystemFont, "Helvetica Neue", "Lucida Grande", "Segoe UI", "Ubuntu", "Cantarell", "Fira Sans", sans-serif`,
            useNextVariants: true,
            fontSize: 14,
        },
        palette: {
            type: themeType,
            primary: blue,
            
        },
        overrides: {
           
        },
        lesson: {
            primary: {
                background: indigo[50],
                colorBar: grey[400],
            },
            secondary: {
                background: grey[200],
                colorBar: grey[500],
            },
        },
    });
