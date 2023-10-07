
function LogicGateButton({ image, size="50px", onClick }) {
    
    return(
        <>
            <button onClick={onClick}>
                <img src={image} width={size} height={size} />
            </button>
        </>
    );
}

export { LogicGateButton };