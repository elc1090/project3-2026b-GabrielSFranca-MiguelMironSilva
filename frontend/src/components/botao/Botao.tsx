"use client";

import {ButtonHTMLAttributes, ReactNode} from "react";
import styles from "./Botao.module.css";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode;
    // onClick?: ()=>void;
}

export function Botao({
    children, 
    ...props}: 
    BtnProps){
    return(
        <button
            {...props}
            className={styles.botao}
            >
            {children}
        </button>
    );
}