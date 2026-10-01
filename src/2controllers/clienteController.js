const Cliente = require('../1models/Cliente');

async function listar(req,res){

    try{

        const cliente = await Cliente.findAll();

        res.json(cliente);

    }catch(erro){

        res.status(500).json({erro:erro.message});

    }

}

async function buscar(req,res){

    try{

        const cliente = await Cliente.findByPk(req.params.id_cliente);

        res.json(cliente);

    }catch(erro){

        res.status(500).json({erro:erro.message});

    }

}

async function inserir(req,res){
    try{
        const cliente = await Cliente.create(req.body);
        res.status(201).json(cliente);
    }catch(erro){
        res.status(500).json({erro:erro.message});
    }
}

async function atualizar(req,res){
    try{
        const cliente = await Cliente.findByPk(req.params.id_cliente);
        await cliente.update(req.body);
        res.json(cliente);
    }catch(erro){
        res.status(500).json({erro:erro.message});
    }
}

async function excluir(req,res){

    try{

        const cliente = await Cliente.findByPk(req.params.id_cliente);

        await cliente.destroy();

        res.json({
            mensagem:"Cliente removido."
        });

    }catch(erro){

        res.status(500).json({erro:erro.message});

    }

}

module.exports = {
    listar,
    buscar,
    inserir,
    atualizar,
    excluir
};