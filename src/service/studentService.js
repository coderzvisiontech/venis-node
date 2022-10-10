const studentdbService = require('../dbservice/studentdbService')

module.exports = {

    checkExistance: async (params) => {
        try {
            const result = await studentdbService.checkExistance(params)
            return result
        } catch (error) {
            return error
        }
    },

    checkExistanceById: async (params) => {
        try {
            const result = await studentdbService.checkExistanceById(params)
            return result
        } catch (error) {
            return error
        }
    },

    addStudent: async (params) => {
        try {
            const result = await studentdbService.addStudent(params)
            return result
        } catch (error) {
            return error
        }
    },

    listStudents: async (params) => {
        try {
            const result = await studentdbService.listStudents(params)
            return result
        } catch (error) {
            return error
        }
    },

    deleteStudents: async () => {
        try {
            const result = await studentdbService.deleteStudents()
            return result
        } catch (error) {
            return error
        }
    }
}