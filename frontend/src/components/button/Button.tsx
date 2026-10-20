import React from "react";

interface BtnProps{
    texto: string;
    onClick?: ()=>void;
}

export function Button({texto, onClick}: BtnProps){
    return(
        <button
            onClick={onClick}
            className="botao"
            >
            {texto}
        </button>
    );
}