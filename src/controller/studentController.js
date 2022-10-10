const studentService = require('../service/studentService');
const { v4: uuidv4 } = require('uuid')
const moment = require('moment')

exports.addStudent = async (req, res, next) => {

    try {
        let params = {};
        params.username = req.body.username
        const checkExistance = await studentService.checkExistance(params)
        if (checkExistance.length > 0) {
            res.status(400).json({ status: 'Failure', message: 'Username already exist', data: null }); return
        }

        let createdTime = Date.now()
        let expiredTime = moment(createdTime).add(60, 'days')
        let expiredInMilli = new Date(moment(expiredTime).format())

        params.password = req.body.password
        params.createdDate = moment().format('L')
        params.createdAt = createdTime
        params.expiredDate = moment(expiredTime).format('L')
        params.expiredAt = expiredInMilli.getTime()

        let result = await studentService.addStudent(params)
        res.status(200).json({ status: 'Success', message: 'Student added successfully', data: result })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'Failure', message: 'Internal Server Error', data: null })
    }

}

exports.checkExistanceById = async (req, res, next) => {

    try {
        let params = {};
        params._id = req.params.id
        const result = await studentService.checkExistanceById(params)
        if (result) { res.status(200).json({ status: 'Success', message: '', data: result }) }
        else { res.status(400).json({ status: 'Failure', message: 'No user found', data: null }) }
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'Failure', message: 'Internal Server Error', data: null })
    }

}

exports.listStudents = async (req, res, next) => {

    try {

        const deleteStudents = await studentService.deleteStudents()
        let params = {
            sort: req.body.sort,
            filter: req.body.filter,
            start_index: req.body.start_index ? req.body.start_index : 0,
            record_count: req.body.record_count ? req.body.record_count : 10,
            global_search: req.body.global_search
        }
        let result = await studentService.listStudents(params)
        res.status(200).json({ status: 'Success', message: 'Student List', data: result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'Failure', message: 'Internal Server Error', data: null })
    }

}
