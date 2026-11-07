export const API_URL = 'http://localhost:3000';

export function api(caminho, opcoes){
    return(
        fetch(API_URL + caminho, { ...opcoes, credentials: 'include'})
    );
}
