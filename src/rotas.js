
const {
    listarConsultas,
    marcarConsulta,
    atualizarConsulta,
    cancelarConsulta,
    finalizarConsulta,
    obterLaudo,
    buscarMedico
} = require("./controladores/controladoresConsultas");

const {
    checarSenhaCNES,
    checarCamposObrigatorios,
    checarValorConsulta,
    checarDadosPaciente,
    checarIdentificadorMedico
} = require("./intermediarios/intermediarioConsultas");

const express = require("express");

const rotas = express();

rotas.use(express.json());

rotas.get("/consultas", checarSenhaCNES, listarConsultas);
rotas.post("/consultas", checarCamposObrigatorios, checarValorConsulta, marcarConsulta);
rotas.put("/consulta/:identificadorConsulta/paciente", checarDadosPaciente, atualizarConsulta);
rotas.delete("/consulta/:identificadorConsulta", cancelarConsulta);
rotas.post("/consulta/finalizar", finalizarConsulta);
rotas.get("/consulta/laudo", obterLaudo);
rotas.get("/consultas/medico", checarIdentificadorMedico, buscarMedico);

module.exports = rotas