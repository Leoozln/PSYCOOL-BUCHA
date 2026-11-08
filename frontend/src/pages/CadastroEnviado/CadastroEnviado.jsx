import Button from '../../components/Button/Button';
import LayoutCadastro from '../../components/LayoutCadastro/LayoutCadastro';
import './CadastroEnviado.css';

function CadastroEnviado() {
    return (
        <LayoutCadastro titulo="Cadastro enviado com sucesso!" etapaAtual={3}>
            <svg className="cadastro-enviado__check" viewBox="0 0 80 80" aria-hidden="true" focusable="false">
                <circle cx="40" cy="40" r="37" />
                <polyline points="27,41 36,50 54,31" />
            </svg>
            <p className="cadastro-enviado__mensagem">
                Nossa equipe vai analisar seus dados e o seu CRP.<br />
                Você vai receber a resposta por e-mail
            </p>
            <Button to="/" className="cadastro-enviado__botao">Entendi</Button>
        </LayoutCadastro>
    );
}

export default CadastroEnviado;
