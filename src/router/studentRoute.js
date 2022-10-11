const studentController = require('../controller/studentController');
const router = require('express').Router();

router.post('/', studentController.addStudent)
router.post('/list', studentController.listStudents)
router.get('/:id', studentController.checkExistanceById)
router.post('/login', studentController.login)

module.exports = router