import styles from "./Footer.module.css";

export function Footer(){
    return(
        <footer className={styles.rodape}>
            <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            <p>This project is academic and non-commercial.</p>
            <p>&copy; 2026 FilmsBR. Todos os direitos reservados.</p>
        </footer>
    )
}