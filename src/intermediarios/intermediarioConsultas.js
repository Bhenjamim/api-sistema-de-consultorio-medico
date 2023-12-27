const checarSenhaCNES = (req, res, next) => {

    const { cnes_consultorio, senha_consultorio } = req.query;

    if (!cnes_consultorio || !senha_consultorio) {

        return res.status(400).json({ "mensagem": "Insira a cnes e/ou senha" });

    }
    next();
}

const checarCamposObrigatorios = (req, res, next) => {
    const corpo = req.body;
    const checarCamposObrigatorios = ["valorConsulta", "tipoConsulta", "paciente"];
    const camposPendentes = [];

    if (Object.keys(corpo).length === 0) {
        return res.status(400).json({
            mensagem: "Informe os campos obrigatórios: valorConsulta; tipoConsulta; paciente: {nome; cpf;dataNascimento; celular; email; senha}."
        });
    }

    for (let campo of checarCamposObrigatorios) {
        if (!(campo in corpo)) {
            camposPendentes.push(campo);
        }
    }

    if (camposPendentes.length > 0) {
        return res.status(400).json({ mensagem: "Informe os campos obrigatórios: valorConsulta; tipoConsulta; paciente: {nome; cpf;dataNascimento; celular; email; senha}.", camposPendentes });
    }

    next();
};

const checarDadosPaciente = (req, res, next) => {
    const corpo = req.body;
    const camposPendentes = [];
    const paciente = corpo.paciente || corpo;
    const dadosPaciente = [
        "nome",
        "cpf",
        "dataNascimento",
        "celular",
        "email",
        "senha"
    ]

    if (Object.keys(corpo).length === 0) {
        return res.status(400).json({
            mensagem: "Informe os campos obrigatórios: paciente: {nome; cpf;dataNascimento; celular; email; senha}."
        });
    }

    for (let campo of dadosPaciente) {
        if (!(campo in paciente)) {
            camposPendentes.push(`${campo} do paciente.`);
        }
    }

    if (camposPendentes.length > 0) {
        return res.status(400).json({ mensagem: "Preencha todos os campos.", camposPendentes });
    }

    next()
}

const checarValorConsulta = (req, res, next) => {
    const corpo = req.body;
    const { valorConsulta } = corpo;

    if (!Number(valorConsulta)) {
        return res.status(400).json({ mensagem: "Informe valor corretamente" });
    }

    next();
};

const checarIdentificadorMedico = (req, res, next) => {
    const { identificador_medico } = req.query;

    if (!identificador_medico) {
        return res.status(400).json({ mensagem: "Informe o identificador do médico" });
    }
    next();
}

module.exports = {
    checarSenhaCNES,
    checarCamposObrigatorios,
    checarValorConsulta,
    checarDadosPaciente,
    checarIdentificadorMedico
}