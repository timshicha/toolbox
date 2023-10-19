import React, { useEffect } from 'react';

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
            buttonColor: this.defaultColor
        }
    }

    selectTool() {
        // this.buttonColor = this.selectedColor;
        this.setState({
            buttonColor: this.selectedColor
        });
    }

    deselectTool() {
        this.setState({
            buttonColor: this.defaultColor
        });
    }

    render() {
        return (
            <>
                <button onClick={this.onClick} className={this.state.buttonColor + " hover:bg-gray-400 rounded-lg " + this.className}>
                    <img src={this.image} width={this.size} height={this.size} />
                </button>
            </>
        );
    }
}

export { LogicGateButton };