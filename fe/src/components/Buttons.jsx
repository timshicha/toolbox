
function LogicGateButton({ image, size="50px", onClick }) {
    
    return(
        <>
            <button onClick={onClick} className="bg-gray-300 hover:bg-gray-400 rounded-lg mx-2">
                <img src={image} width={size} height={size} />
            </button>
        </>
    );
}

export { LogicGateButton };