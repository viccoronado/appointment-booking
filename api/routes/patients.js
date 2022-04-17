const { Cliente, Mensaje, Precio } = require('../db');
const express = require('express');
const router = express();
const { Op } = require('sequelize');
const uuid4 = require('uuid4')

const horarios = [
    '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
]

router.get("/hoursFree/:dia", async (req, res) => {
    const dia = req.params.dia
    try {
        const turnosLibres = await Cliente.findAll({
            where: {
                dia: {
                    [Op.eq]: dia
                }
            }
        })
        let horariosDeTurnos = []
        turnosLibres.forEach(el => horariosDeTurnos.push(el.turno))
        let respuestaTurnos = horarios.filter(el => !horariosDeTurnos.includes(el))
        res.status(200).send(respuestaTurnos)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/getHours", async (req, res) => {
    res.send(horarios)
})

router.get('/getClients/:fecha', async (req, res) => {
    const { fecha } = req.params
    var clientes = await Cliente.findAll({
        where: {
            dia: {
                [Op.eq]: fecha
            }
        }
    })

    let horariosAAgregar = []

    for (let i = 0; i < horarios.length; i++)
        horariosAAgregar[i] = horarios[i]

    for (let i = 0; i < horarios.length; i++) {
        for (let j = 0; j < clientes.length; j++) {
            if (clientes[j].turno === horarios[i]) {
                horariosAAgregar[i] = clientes[j]
            }
        }
    }

    res.status(200).send(horariosAAgregar)
})

router.get('/allClients', async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            where: {
                ocupado: 'Cliente'
            }
        })
        res.status(200).send(clientes)
    } catch (e) {
        res.status(500).send({ error: e })
    }
})

router.post('/deleteClient/:id', async (req, res) => {
    const { id } = req.params
    try {
        await Cliente.destroy({
            where: {
                id: id
            }
        })
            .then(() => res.status(200).send({ msg: 'El cliente fué removido' }))
    } catch (e) {
        res.status(400).send(e)
    }
})

router.put('/updateClient', async (req, res) => {
    const data = req.body
    try {
        await Cliente.update(data, {
            where: {
                id: data.id
            }
        })

        res.status(200).json({ msg: 'user edited' })
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/adminHours/:fecha', async (req, res) => {
    const { fecha } = req.params
    const clientes = await Cliente.findAll({
        where: {
            dia: {
                [Op.eq]: fecha
            }
        }
    })
    let results = horarios.filter(el => !clientes.some((d => d.turno === el)))
    clientes.forEach(el => {
        results.unshift(el.dataValues)
    })
    res.status(200).send(results)
})

router.post('/ocuparHorario/:dia/:horario', async (req, res) => {
    const { dia, horario } = req.params
    try {
        await Cliente.create({
            id: uuid4(),
            dia,
            turno: horario,
            ocupado: "Ocupado"
        });
        res.status(200).send({ msg: `El turno de las ${horario} fue ocupado` })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/liberarHorario/:dia/:horario', async (req, res) => {
    const { dia, horario } = req.params
    try {
        await Cliente.destroy({
            where: {
                dia: dia,
                turno: horario
            }
        })
            .then(() => res.status(200).send({ msg: `El turno de las ${horario} fue liberado` }))
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/setearMensaje', async (req, res) => {
    const { mensaje } = req.body
    try {
        await Mensaje.destroy({
            where: {},
            truncate: true
        })
        await Mensaje.create({
            mensaje
        })
            .then(() => res.status(200).send({ msg: 'Mensaje guardado' }))
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Error al guardar el mensaje' })
    }
})

router.get('/mensajeWsp', async (req, res) => {
    try {
        let mensaje = await Mensaje.findAll()
        let respuesta = mensaje.pop()
        res.status(200).json(respuesta)
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Error al obtener el mensaje' })
    }
})
router.post('/setearPrecio', async (req, res) => {
    const { precio } = req.body
    try {
        await Precio.destroy({
            where: {},
            truncate: true
        })
        await Precio.create({
            precio: precio
        })
            .then(() => res.status(200).send({ msg: 'Precio guardado' }))
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Error al guardar el precio' })
    }
})

router.get('/precio', async (req, res) => {
    try {
        let precio = await Precio.findAll()
        let respuesta = precio.pop()
        res.status(200).json(respuesta)
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Error al obtener el precio' })
    }
})

router.get('/statics', async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            where: {
                ocupado: 'Cliente'
            }
        })
        let array = []
        for (let i = 1; i <= 12; i++) {
            array[i - 1] = clientes.filter(el => Number(el.dia.split("-")[1]) === i && Number(el.dia.split("-")[2]) === new Date().getFullYear()).length
        }
        res.status(200).send(array)
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: e })
    }
})

router.get('/semana/:dia', async (req, res) => {
    let { dia } = req.params
    let semana = []
    let array = []
    let filtrado = []
    dia = dia.split("-")
    for (let i = 0; i < 6; i++) {
        semana.push(`${Number(dia[0]) + i}-${dia[1]}-20${dia[2]}`)
    }
    try {
        const clientes = await Cliente.findAll({
            where: {
                ocupado: 'Cliente',
                dia: { [Op.or]: [semana] }
            }
        })
        for (let i = 0; i < 6; i++) {
            filtrado = clientes.filter(el => el.dia === semana[i])
            array[i] = { dia: semana[i], cantidad: filtrado.length }
        }
        res.status(200).send(array)
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: e })
    }
})

module.exports = router;