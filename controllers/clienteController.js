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

        const cliente = await Cliente.findByPk(req.params.id);

        res.json(cliente);

    }catch(erro){

        res.status(500).json({erro:erro.message});

    }

}

async function inserir(req,res){

    try{

        const cliente = await Cliente.create({

            cli_nome:req.body.cli_nome

        });

        res.status(201).json(cliente);

    }catch(erro){

        res.status(500).json({erro:erro.message});

    }

}

async function atualizar(req,res){

    try{

        const cliente = await Cliente.findByPk(req.params.id);

        await cliente.update({

            cli_nome:req.body.cli_nome

        });

        res.json(cliente);

    }catch(erro){

        res.status(500).json({erro:erro.message});

    }

}

async function excluir(req,res){

    try{

        const cliente = await Cliente.findByPk(req.params.id);

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