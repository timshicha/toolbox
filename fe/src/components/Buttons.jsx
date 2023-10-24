import React, { useEffect } from 'react';
import xImg from '../assets/images/x.svg';

class LogicGateButton extends React.Component {

    constructor({ image, size = "50px", onClick, className }) {
        super();
        this.image = image;
        this.size = size;
        this.onClick = onClick;
        this.className = className

        this.defaultColor = 'bg-gray-300';
        this.selectedColor = 'bg-blue-300';
        this.state = {
            buttonColor: this.defaultColor,
            border: 'border-transparent'
        }
    }

    selectTool() {
        // this.buttonColor = this.selectedColor;
        this.setState({
            buttonColor: this.selectedColor,
            border: 'border-blue-400'
        });
    }

    deselectTool() {
        this.setState({
            buttonColor: this.defaultColor,
            border: 'border-transparent'
        });
    }

    render() {
        return (
            <>
                <button onClick={this.onClick} className={this.state.buttonColor + " " + this.state.border + " hover:bg-gray-400 rounded-lg active:bg-gray-500 border-solid border-[3px] " + this.className}>
                    <img src={this.image} width={this.size} height={this.size} />
                </button>
            </>
        );
    }
}

class MainButton extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <>
                <button className={'block mx-auto bg-gray-400 px-[20px] py-[10px] rounded-lg border-[2px] border-black border-solid text-l font-bold hover:bg-gray-500 active:bg-gray-600 ' + this.props.styles} {...this.props}>
                    {this.props.children}
                </button>
            </>
        );
    }
}

class XButton extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <button {...this.props}>
                <img className='w-[30px]' src={xImg} />
            </button>
        );
    }
}

export { LogicGateButton, MainButton, XButton };