import type {UserCreate} from "../types/user";
import {FormEvent, useState} from "react";
import Link from "next/link";

function Header(){
    return(
        <header>
            <h1>Crie sua conta</h1>
        </header>
    )
}

export default function RegisterFormPage(){

    const [formData, setFormData]=useState<UserCreate>({
        username:"",
        email:"",
        password:""
    })
    const [message, setMessage]=useState<string>('')
    const [loading, setLoading]=useState(false)

    function handleChange(){

    }

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        setLoading(true)
        // try{

        // }

    }
    
    return(
        <section>
            <Header />
            <p>Crie sua conta para salvar e organizar
          seus filmes.</p>
            <form onSubmit={handleSubmit}>
                    <div>
                        {/* rotulo-entrada nome de usuario */}
                        <label htmlFor="username">Nome de usuário </label>

                        <input id="username" name="username" type="text" value={formData.username} minLength={4} maxLength={20} required placeholder="Como devemos chamar você?"/>

                        {/* email - falta o onChange()*/}
                        <label htmlFor="email">E-mail</label>

                        <input id="email" name="email" type="email" value={formData.email} autoComplete="email" required placeholder="Seu email exemplo@mail.com"/>

                        <label htmlFor="username">Senha</label>

                        <input id="password" name="password" type="password" value={formData.password} minLength={8} required placeholder="Crie uma senha com pelo menos 8 caracteres"/>

                        <button 
                            type="submit"
                            disabled={loading}
                        >
                            {loading? "Criando conta..." : "Criar conta"}
                            </button>
                    </div>
                </form>

                <p>Já tem uma conta? <Link href="/login">Entrar</Link></p>
        </section>
    )
}