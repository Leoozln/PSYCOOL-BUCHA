import Card from '../Card/Card';
import Header from '../Header/Header';
import './DocumentoProvisorio.css';

function DocumentoProvisorio({ titulo }) {
    return (
        <div className="documento textura-pontilhada">
            <div className="documento__topo">
                <Header />
            </div>

            <main className="documento__conteudo">
                <Card className="documento__card">
                    <h1 className="documento__titulo">{titulo}</h1>
                    <p>Documento em elaboração.</p>
                </Card>
            </main>
        </div>
    );
}

export default DocumentoProvisorio;
