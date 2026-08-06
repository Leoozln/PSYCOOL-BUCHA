async function listar(req,res){

    try{

        const cargos = await Cargo.findAll();

        res.json(cargos);

    }catch(erro){

        res.status(500).json({erro:erro.message});

    }

}

async function buscar(req,res){

    try{

        const cargo = await Cargos.findByPk(req.params.id);

        res.json(cargos);

    }catch(erro){

        res.status(500).json({erro:erro.message});

    }

}

async function inserir(req,res){

    try{

        const cargos = await Cargos.create({

            car_nome:req.body.car_nome

        });

        res.status(201).json(cargos);

    }catch(erro){

        res.status(500).json({erro:erro.message});

    }

}

async function atualizar(req,res){

    try{

        const cargos = await Cargos.findByPk(req.params.id);

        await cargos.update({

            car_nome:req.body.car_nome

        });

        res.json(cargos);

    }catch(erro){

        res.status(500).json({erro:erro.message});

    }

}

async function excluir(req,res){

    try{

        const cargos = await Cargos.findByPk(req.params.id);

        await cargos.destroy();

        res.json({
            mensagem:"Cargo removido."
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