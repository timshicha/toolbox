import React from 'react';


class UploadPopup extends React.Component {
    constructor() {
        super();

        this.state = {
            map: null
        };
    }

    onFileChange = (e) => {
        this.setState({
            map: e.target.files[0]
        });
    }

    upload = () => {
        console.log(this.state.map);
        let fr = new FileReader();
        fr.onload = (e) => {
            this.props.onSubmit(e.target.result);
        };
        fr.readAsText(this.state.map);
    }

    render() {
        return (
            <>
                <div className='absolute bg-gray-300 w-[400px] h-[200px] top-[calc(50%-100px)] left-[calc(50%-200px)] rounded-lg border-solid border-[4px] border-gray-600'>
                    <input type="file" onChange={e => this.onFileChange(e)}/>
                    <button onClick={this.upload}>Upload</button>
                </div>
            </>  
        );
    }
};

export { UploadPopup };