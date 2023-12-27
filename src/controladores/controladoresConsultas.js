const dados = require("../bancodedados");
const { consultorio, laudos } = dados;
let { consultas } = dados;
let ultimoLaudo = 0

const listarConsultas = (req, res) => {
    const { cnes_consultorio, senha_consultorio } = req.query;

    if (cnes_consultorio !== consultorio.cnes || senha_consultorio !== consultorio.senha) {
        return res.status(401).json({ mensagem: "Cnes ou senha inválidos!" });
    }
    else {
        if (consultas.length === 0) {
            return res.status(204).send();
        }
        return res.status(200).json({ mensagem: `${consultas.length} consulta(s) encontrada(s)`, consultas });
    };
}

const marcarConsulta = (req, res) => {
    const corpo = req.body;

    const cpfExistente = consultas.find((cpfExistente) => {
        return cpfExistente.paciente.cpf === corpo.paciente.cpf;
    });

    const emailExistente = consultas.find((emailExistente) => {
        return emailExistente.paciente.email === corpo.paciente.email;
    });

    if (cpfExistente || emailExistente) {
        return res.status(400).json({ mensagem: "Já existe uma consulta em andamento com o cpf ou e-mail informado!" });
    };

    const medico = consultorio.medicos.find((medico) => {
        return medico.especialidade === corpo.tipoConsulta;
    });

    if (!medico) {
        return res.status(404).json({ mensagem: "Não há atendimento para o tipo de consulta solicitado" });
    };

    let ultimaConsulta = 0
    for (let i = 0; i < consultas.length; i++) {

        if (ultimaConsulta < consultas[i].identificador) {
            ultimaConsulta = consultas[i].identificador;
        };
    };

    consultas.push({
        identificador: ultimaConsulta + 1,
        tipoConsulta: corpo.tipoConsulta,
        identificadorMedico: medico.identificador,
        finalizada: false,
        valorConsulta: Number(corpo.valorConsulta),
        paciente: {
            nome: corpo.paciente.nome,
            cpf: corpo.paciente.cpf,
            dataNascimento: corpo.paciente.dataNascimento,
            celular: corpo.paciente.celular,
            email: corpo.paciente.email,
            senha: corpo.paciente.senha
        }
    });

    return res.status(204).send();
};

const atualizarConsulta = (req, res) => {
    const { identificadorConsulta } = req.params;

    const consulta = consultas.find((consulta) => {
        return consulta.identificador === Number(identificadorConsulta);
    });

    if (!consulta) {
        return res.status(404).json({ mensagem: "Consulta inexistente" });
    };

    const corpo = req.body

    const cpfExistente = consultas.find((cpfExistente) => {
        return cpfExistente.paciente.cpf === corpo.cpf;
    });

    const emailExistente = consultas.find((cpfExistente) => {
        return cpfExistente.paciente.email === corpo.email;
    });

    const camposObrigatorios = [
        "nome",
        "cpf",
        "dataNascimento",
        "celular",
        "email",
        "senha"];

    const camposPendentes = [];

    for (let campo of camposObrigatorios) {
        if (!(campo in corpo)) {
            camposPendentes.push(campo);
        };
    };

    if (camposPendentes.length > 0) {
        return res.status(400).json({ mensagem: "Preencha todos os campos.", camposPendentes })
    };

    if (cpfExistente || emailExistente) {
        return res.status(400).json({ mensagem: "Já existe uma consulta em andamento com o cpf ou e-mail informado!" });
    };

    console.log()
    if (consulta.finalizada === true) {
        return res.status(400).json({ mensagem: "Consulta está finalizada" })
    }

    const { nome, cpf, dataNascimento, celular, email, senha } = corpo;
    consulta.paciente.nome = nome;
    consulta.paciente.cpf = cpf;
    consulta.paciente.dataNascimento = dataNascimento;
    consulta.paciente.celular = celular;
    consulta.paciente.email = email;
    consulta.paciente.senha = senha;

    return res.status(204).send();
};

const cancelarConsulta = (req, res) => {
    const { identificadorConsulta } = req.params;

    if (Object.keys(identificadorConsulta).length === 0) {
        return res.status(400).json({ mensagem: "Informe identificador da consulta." });
    };

    const consulta = consultas.find((consulta) => {
        return consulta.identificador === Number(identificadorConsulta);
    });

    if (!consulta) {
        return res.status(404).json({ mensagem: "Consulta inexistente" });
    };

    if (consulta.finalizada === true) {
        return res.status(400).json({ mensagem: "A consulta só pode ser removida se a mesma não estiver finalizada" })
    }

    consultas = consultas.filter((consulta) => {
        return consulta.identificador !== Number(identificadorConsulta);
    });

    return res.status(204).send();
}

const finalizarConsulta = (req, res) => {
    const corpo = req.body;

    const camposObrigatorios = [
        "identificadorConsulta",
        "textoMedico"];

    const camposPendentes = [];

    for (let campo of camposObrigatorios) {
        if (!(campo in corpo)) {
            camposPendentes.push(campo);
        }
    }

    if (Object.keys(corpo).length === 0) {
        return res.status(400).json({ mensagem: "Informe os campos obrigatórios" });
    }

    if (camposPendentes.length > 0) {
        return res.status(400).json({ mensagem: "Preencha todos campos", camposPendentes });
    };

    let consulta = consultas.find((consulta) => {
        return consulta.identificador === corpo.identificadorConsulta;
    });

    if (!consulta) {
        return res.status(404).json({ mensagem: "Consulta inexistente" });
    };

    if (consulta.finalizada === true) {
        return res.status(403).json({ mensagem: "Consulta já está finalizada" });
    }

    const { textoMedico } = corpo;

    if (textoMedico.length === 0 || textoMedico.length > 200) {
        return res.status(400).json({ mensagem: "O tamanho do textoMedico não está dentro do esperado" });
    }

    const { paciente } = consulta

    consulta = {
        identificador: consulta.identificador,
        tipoConsulta: consulta.tipoConsulta,
        identificadorMedico: consulta.identificadorMedico,
        finalizada: true,
        identificadorLaudo: ultimoLaudo + 1,
        valorConsulta: consulta.valorConsulta,
        paciente: {
            nome: paciente.nome,
            cpf: paciente.cpf,
            dataNascimento: paciente.dataNascimento,
            celular: paciente.celular,
            email: paciente.email,
            senha: paciente.senha
        }
    }
    ultimoLaudo += 1

    for (let consultaReg of consultas) {
        if (consultaReg.identificador === consulta.identificador) {
            consultas.pop(consultaReg)
        }
    }

    consultas.push(consulta);

    laudos.push({
        identificador: consulta.identificadorLaudo,
        identificadorConsulta: consulta.identificador,
        identificadorMedico: consulta.identificadorMedico,
        textoMedico,
        paciente: {
            nome: paciente.nome,
            cpf: paciente.cpf,
            dataNascimento: paciente.dataNascimento,
            celular: paciente.celular,
            email: paciente.email,
            senha: paciente.senha
        }
    });

    return res.status(204).send();
}

const obterLaudo = (req, res) => {
    const { identificador_consulta, senha } = req.query

    if (!identificador_consulta || !senha) {
        return res.status(400).json({ mensagem: "Identificador da consulta e/ou senha não informados" });
    };

    const consulta = consultas.find((consulta) => {
        return consulta.identificador === Number(identificador_consulta);
    });

    if (!consulta) {
        res.status(404).json({ mensagem: "Consulta inexistente" });
    }
    const laudo = laudos.find((laudo) => {
        return laudo.identificadorConsulta === Number(identificador_consulta);
    });

    if (!laudo) {
        return res.status(404).json({ mensagem: "Laudo inexistente" });
    };


    if (laudo.paciente.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha incorreta." });
    }

    return res.status(200).json(laudo)
}

const buscarMedico = (req, res) => {
    const { identificador_medico } = req.query;

    const medico = consultorio.medicos.find((medico) => {
        return medico.identificador === Number(identificador_medico);
    });

    if (!medico) {
        return res.status(404).json({ mensagem: "O médico informado não existe na base!" });
    }

    let minhasConsultas = [];

    consultas.find((consulta) => {
        if (consulta.identificadorMedico === Number(identificador_medico)) {
            minhasConsultas.push(consulta)
        }
    })



    return res.status(200).json(minhasConsultas);
}

module.exports = {
    listarConsultas,
    marcarConsulta,
    atualizarConsulta,
    cancelarConsulta,
    finalizarConsulta,
    obterLaudo,
    buscarMedico
}
