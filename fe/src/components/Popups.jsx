import React from 'react';
import { MainButton, XButton } from './Buttons';


class UploadPopup extends React.Component {
    constructor() {
        super();

        this.state = {
            map: null,
            errorMessage: null
        };

        this.background = <div className='fixed top-0 left-0 h-[100%] w-[100%] bg-black overflow-hidden opacity-80'></div>;
    }

    onFileChange = (e) => {
        // If there's a file, update the file selected
        if(e.target.files && e.target.files.length > 0) {
            this.setState({
                map: e.target.files[0]
            });
        }
        // Otherwise, remove the selected file
        else {
            this.setState({
                map: null
            });
        }
    }

    upload = () => {
        if (!this.state.map) {
            this.showErrorMessage('Please select a file to upload first.');
            return;
        }
        let fr = new FileReader();
        fr.onload = (e) => {
            this.props.onSubmit(e.target.result);
        };
        fr.readAsText(this.state.map);
    }

    showErrorMessage = (errorMessage) => {
        this.setState({
            errorMessage: errorMessage
        });
    }

    handleKeyPress = (event) => {
        event.preventDefault();
        if (event.key === 'Escape') {
            this.props.onClose();
        }
        else if (event.key === 'Enter') {
            this.upload();
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress, false);
    }

    render() {
        return (
            <>
                <div className='fixed top-0 left-0 h-[100%] w-[100%] bg-black overflow-hidden opacity-80' onMouseDown={this.props.onClose}></div>
                <div className='absolute bg-gray-300 w-[400px] top-[calc(50%-100px)] left-[calc(50%-200px)] rounded-lg border-solid border-[4px] border-gray-600'>
                    <XButton onClick={this.props.onClose} className='absolute right-[7px] top-[7px] rounded-[15px] hover:bg-gray-400'></XButton>
                    <h2 className='mt-[20px]'>Want to Upload a Map?</h2>
                    <input className='mt-[20px] mb-[15px]' type="file" onChange={e => this.onFileChange(e)} />
                    {this.state.errorMessage ? <p className='text-[12px] text-red-500 mb-[10px]'>{this.state.errorMessage}</p> : null}
                    <MainButton onClick={this.upload}>Upload Map</MainButton>
                    <p className='text-[12px] p-[10px]'>Note: Uploading a map from file will replace your current map.</p>
                </div>
            </>  
        );
    }
};

class ConfirmPopup extends React.Component {
    constructor() {
        super();

        this.state = {
            map: null,
            errorMessage: null
        };
    }

    onFileChange = (e) => {
        // If there's a file, update the file selected
        if(e.target.files && e.target.files.length > 0) {
            this.setState({
                map: e.target.files[0]
            });
        }
        // Otherwise, remove the selected file
        else {
            this.setState({
                map: null
            });
        }
    }

    upload = () => {
        if (!this.state.map) {
            this.showErrorMessage('Please select a file to upload first.');
            return;
        }
        let fr = new FileReader();
        fr.onload = (e) => {
            this.props.onSubmit(e.target.result);
        };
        fr.readAsText(this.state.map);
    }

    showErrorMessage = (errorMessage) => {
        this.setState({
            errorMessage: errorMessage
        });
    }
 
    handleKeyPress = (event) => {
        event.preventDefault();
        if (event.key === 'Escape') {
            this.props.onClose();
        }
        else if (event.key === 'Enter') {
            this.props.onSubmit();
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress, false);
    }

    render() {
        return (
            <>
                <div className='fixed top-0 left-0 h-[100%] w-[100%] bg-black overflow-hidden opacity-80' onMouseDown={this.props.onClose}></div>
                <div className='absolute bg-gray-300 w-[400px] top-[calc(50%-100px)] left-[calc(50%-200px)] rounded-lg border-solid border-[4px] border-gray-600 backdrop-brightness-200'>
                    <XButton onClick={this.props.onClose} className='absolute right-[7px] top-[7px] rounded-[15px] hover:bg-gray-400'></XButton>
                    <h2 className='mt-[20px]'>Clear map?</h2>
                    <p className='text-[12px] p-[10px]'>Are you sure you want to clear the current map? This will clear the history as well, so you will not be able to retrieve the map unless you have it saved.</p>
                    <MainButton type={'red'} styles='inline m-[10px] mr-[10px] bg-black' onClick={this.props.onSubmit}>Clear Map</MainButton>
                    <MainButton styles='inline m-[10px]' onClick={this.props.onClose}>Cancel</MainButton>
                </div>
            </>  
        );
    }
};

export { UploadPopup, ConfirmPopup };