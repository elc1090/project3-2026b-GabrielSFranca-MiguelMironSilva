import styles from "./Footer.module.css";

export function Footer(){
    return(
        <footer className={styles.rodape}>
            <div className={styles.copy}>&copy; 2026 MeuSite. Todos os direitos reservados.</div>
        </footer>
    )
}