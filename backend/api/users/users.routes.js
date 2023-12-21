import express from 'express';
import { isAuthenticated } from '../middlewares.js';
import { findUserById, findStudentsCourses, findAnswersByTestId, createPassedTest, findUsersAnswers, changeUserPassword, getTeachersProfile, createTest, createTestQuestion, createLection, createLogPWDChange, createLogStudentAnswer, createTeachersQuestion, getTeachersQuestions } from './users.services.js';
import bcrypt from 'bcrypt';
import { exec } from 'child_process'
import { join } from 'path'

const router = express.Router();

router.get('/profile', isAuthenticated, async (req, res, next) => {
    try {
        const { userId } = req.payload;
        const user = await findUserById(userId);
        delete user.Password_User;
        res.json(user);
    } catch (err) {
        next(err);
    }
});

router.post('/change_password', isAuthenticated, async (req, res, next) => {
    try {
        const { ID_User, old_password, new_password, new_password_confirmation } = req.body;
        if (
            !ID_User || !old_password || !new_password || !new_password_confirmation
            || new_password !== new_password_confirmation
        ) {
            res.status(400)
            throw new Error('Заполнены не все поля или отправлен некорректный запрос')
        }

        const existingUser = await findUserById(ID_User);
        const validPassword = bcrypt.compareSync(old_password, existingUser.Password_User);
        if (!validPassword) {
            res.status(400);
            throw new Error('Указаны неверные данные.');
        }
        const data = await changeUserPassword(ID_User, new_password)

        const log_data = await createLogPWDChange(existingUser.Password_User, new_password, ID_User)

        delete data.Password_User
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.get('/student_courses', isAuthenticated, async (req, res, next) => {
    try {
        const { ID_User } = req.query;
        if (!ID_User) {
            res.status(400);
            throw new Error('Некорректный запрос или нет подходящих данных.');
        }
        const data = await findStudentsCourses(Number(ID_User));
        if (data.length == 0) {
            res.status(400);
            throw new Error('Вы еще не закреплены ни за одним курсом или произошла ошибка.');
        }
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.post('/student_answer', isAuthenticated, async (req, res, next) => {
    try {
        const { ID_User, ID_test, answers } = req.body;
        if (!ID_User || !ID_test || !answers || answers.length == 0) {
            res.status(400);
            throw new Error('Некорректный запрос или нет подходящих данных.');
        }
        let already_done = await findUsersAnswers(ID_test, ID_User)
        if (already_done !== null) { res.status(400); throw new Error("Вы уже сдавали этот тест") }
        const answers_data = await findAnswersByTestId(Number(ID_test));
        if (answers_data.length == 0 || answers_data.length !== answers.length) {
            res.status(400);
            throw new Error('Некорректный запрос или нет подходящих данных.');
        }
        let answerArray = []
        let score = 0
        answers_data.forEach(x => answerArray.push(x.questions.Answer_Question))
        for (let [index, answer] of answerArray.entries()) { if (answers[index] == answer) { score++ } }
        const data = await createPassedTest(ID_test, ID_User, score)

        let dataString = `Тест: ${ID_test}. Баллы: ${score}. Ответы: ${answers}`
        let data_log = await createLogStudentAnswer(ID_User, dataString)

        res.json(data);
    } catch (err) {
        next(err);
    }
})

router.get('/teacher_profile', isAuthenticated, async (req, res, next) => {
    try {
        const { ID_User } = req.query;
        if (!ID_User) {
            res.status(400);
            throw new Error('Некорректный запрос или нет подходящих данных.');
        }
        const data = await getTeachersProfile(Number(ID_User))
        if (data.length == 0) {
            res.status(400);
            throw new Error('Некорректный запрос или нет подходящих данных.');
        }
        res.json(data);
    } catch (err) {
        next(err);
    }
})

router.post('/teacher_test', isAuthenticated, async (req, res, next) => {
    try {
        let { teacherId, Deadline_test, Tittle_test, courseId, questions } = req.body;
        if (!teacherId || !Deadline_test || !Tittle_test || !courseId || questions?.length == 0 || Deadline_test == 'default') {
            res.status(400);
            throw new Error('Некорректный запрос или нет подходящих данных.');
        }
        Deadline_test = new Date(Date.parse(Deadline_test)).toISOString()

        // TODO: check mb?
        // let already_added = await findUsersAnswers(ID_test, ID_User)
        // if (already_added !== null) { res.status(400); throw new Error("Вы уже создавали тест") }

        let test = await createTest(teacherId, Deadline_test, Tittle_test, courseId)
        let temp_test_questions = []

        for (let question_id of questions) {
            let t_q_response = await createTestQuestion(test.ID_Test, question_id)
            temp_test_questions.push(t_q_response)
        }

        res.json({ test, test_question: temp_test_questions });
    } catch (err) {
        next(err);
    }
})

router.post('/teacher_lection', isAuthenticated, async (req, res, next) => {
    try {
        let { Tittle_Lection, Theme_Lection, Format_Lection, Text_Lection, teacherId, courseId } = req.body;
        // OBJECT DECONSTRUCTURE
        if (!Tittle_Lection || !Theme_Lection || !Format_Lection || !Text_Lection || !teacherId || !courseId) {
            res.status(400);
            throw new Error('Некорректный запрос или нет подходящих данных.');
        }
        let test = await createLection(Tittle_Lection, Theme_Lection, Format_Lection, Text_Lection, teacherId, courseId)
        res.json(test);
    } catch (err) {
        next(err);
    }
})

// TODO: ADD ADMIN ROLE PROTECTION
router.get('/admin_dump', isAuthenticated, async (req, res, next) => {
    try {
        let filename = `${process.env.DATABASE_DB}_${Date.now()}.sql`
        let dumpFile = join(process.env.APP_ROOT, 'uploads', filename);
        let exportFrom = {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DB
        }
        let pwd = "";
        if (exportFrom.password.length > 0) { pwd = ` -p${exportFrom.password}` }
        exec(`${process.env.MYSQL_DUMP_TOOL_PATH} -u${exportFrom.user}${pwd} -h${exportFrom.host} --compact ${exportFrom.database} > ${dumpFile}`, (error, stdout, stdin) => {
            if (error) { throw error }
            res.sendFile(dumpFile)
        })
    } catch (err) {
        next(err);
    }
})

router.post('/teacher_import_questions', isAuthenticated, async (req, res, next) => {
    try {
        let sampleFile;

        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400)
            throw new Error("Не приложен файл");
        }
        sampleFile = req.files.teacher_import_file;
        if (sampleFile.mimetype !== 'text/csv') {
            res.status(400)
            throw new Error("Запрещённый формат");
        }
        let dataArray = sampleFile.data.toString().trim().replaceAll("\r", "").split('\n').slice(1)
        let counter = 0;
        for (let data_line of dataArray) {
            let [question, answer] = data_line.split('|')
            try {
                let ctq_data = await createTeachersQuestion(question, answer, req.payload?.userId)
                if (ctq_data.Text_Question) { counter++ }
            } catch (_) {
                continue
            }
        }

        res.json({ message: `Добавлено ${counter} из ${dataArray.length} вопросов` })

    } catch (error) {
        next(error)
    }
})

router.get('/teacher_export_questions', isAuthenticated, async (req, res, next) => {
    try {
        let questions = await getTeachersQuestions(req.payload.userId)
        if (questions.length == 0) { res.status(400); throw new Error("Некорретный запрос или нет подходящих данных") }
        let dataString = "Вопрос|Ответ"
        for (let { Answer_Question: answer, Text_Question: question } of questions) {
            dataString += `\n${question}|${answer}`
        }
        res.json(dataString)
    } catch (err) {
        next(err);
    }
})



export default router;