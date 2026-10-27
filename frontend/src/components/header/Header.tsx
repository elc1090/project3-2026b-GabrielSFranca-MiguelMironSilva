import styles from "./Header.module.css"

interface Props{
    titulo: string;
}
export function Header({ titulo }: Props){
    return(
        <header className={styles.header}>
            <h1 className={styles.titulo}>{titulo}</h1>
        </header>
    );
}

//export function funct(num: number, texto: string, usuario: Usuario[]): string{
//     return texto;
// }