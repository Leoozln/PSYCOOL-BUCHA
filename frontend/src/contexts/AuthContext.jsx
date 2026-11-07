import { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    // caixinha para guardar a resposta do /auth/me (começa vazia: null)
    const [usuario, setUsuario] = useState(null);

    // buscar uma vez quando o app abre
    useEffect(() => {
        async function carregarUsuario() {
            const resposta = await api('/auth/me');      // chamar o /auth/me com a sua função
            if (resposta.ok) {
                const dados = await resposta.json();
                setUsuario(dados);                          // guardar os dados na caixinha
            }
        }
        carregarUsuario();
    }, []);                                  // a lista: rodar só uma vez

    return (
        <AuthContext.Provider value={usuario}>
            {children}
        </AuthContext.Provider>
    );
}