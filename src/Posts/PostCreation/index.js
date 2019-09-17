import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import StockPhotoSelector from './StockPhotoSelector';
import PhotoModeSelector from './PhotoModeSelector';
import PhotoUpload from './PhotoUpload';
import Post from './Post';
import PostMeta from './PostMeta';
import { grey } from '@material-ui/core/colors';

const styles = theme => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        justifyContent: 'center',
        backgroundColor: grey[100],
    },
    fullHeight: {
        flex: 1,
        padding: theme.spacing(2),
        height: '100%',
        overflow: 'auto',
    },
});

class TextMobileStepper extends React.Component {
    state = {
        activeStep: 0,
    };

    handleNext = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep - 1,
        }));
    };

    onUpload = url => {
        this.setState(prevState => ({
            image: url,
            activeStep: prevState.activeStep + 1,
        }));
    };

    onPhotoModeSelect = mode => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep + 1 + (mode === 'no'),
            photoMode: mode,
        }));
    };

    render() {
        const { classes, theme } = this.props;
        const { activeStep, photoMode, image } = this.state;
        const maxSteps = 4;

        return (
            <div className={classes.root}>
                <div className={classes.fullHeight}>
                    {activeStep === 0 && <PhotoModeSelector onPhotoModeSelect={this.onPhotoModeSelect} />}
                    {activeStep === 1 && photoMode === 'stock' && <StockPhotoSelector onUpload={this.onUpload} />}
                    {activeStep === 1 && photoMode === 'upload' && (
                        <PhotoUpload onUpload={this.onUpload} image={image} />
                    )}
                    {activeStep === 2 && <Post image={image} />}
                    {activeStep === 3 && <PostMeta />}
                </div>

                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    className={classes.mobileStepper}
                    nextButton={
                        <Button size="small" onClick={this.handleNext} disabled={activeStep >= maxSteps - 1}>
                            Weiter
                            <KeyboardArrowRight />
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                            <KeyboardArrowLeft />
                            Zurück
                        </Button>
                    }
                />
            </div>
        );
    }
}

TextMobileStepper.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TextMobileStepper);
