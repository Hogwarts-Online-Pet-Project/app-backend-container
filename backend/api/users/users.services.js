import bcrypt from 'bcrypt';
import { db } from '../../utils/db.js';

async function findStudentsCourses(ID_User) {

  let temp = await db.student_course.findMany({
    where: {
      studentId: ID_User,
    },
    include: {
      course: true,
    },
  });

  let mutated = []
  for (let eachCourse of temp) {
    let temp_tests = (await db.tests.findMany({
      where: {
        courseId: eachCourse.courseId,
      },
      include: {
        test_question: {
          select: {
            questions: true
          },
        }
      }
    }))
      .map(t => {
        t.test_question = t.test_question.map(tq => {
          delete tq.questions.Answer_Question
          return tq
        })
        return t
      })
    let temp_lections = await db.lection.findMany({
      where: {
        courseId: eachCourse.courseId
      },
    });
    mutated.push({ ...eachCourse, tests: temp_tests, lections: temp_lections })
  }
  return mutated

}

async function findAnswersByTestId(testId) {
  let temp = await db.test_question.findMany({
    where: {
      testId: testId
    },
    include: {
      questions: true
    }
  })
  return temp
}

function createPassedTest(testId, ID_User, score) {
  return db.passed_test.create({
    data: {
      Score_Passed_Test: String(score),
      User_Passed_Test: Number(ID_User),
      Test_Passed_Test: Number(testId)
    }
  })
}

function createTeachersQuestion(question, answer, teacherId) {
  return db.questions.create({
    data: {
      Answer_Question: answer,
      Text_Question: question,
      teacherId
    }
  })
}

async function findUsersAnswers(testId, ID_User) {
  let temp = await db.passed_test.findFirst({
    where: {
      Test_Passed_Test: Number(testId),
      User_Passed_Test: Number(ID_User)
    }
  })
  return temp
}

async function changeUserPassword(ID_User, password) {
  let hash = await bcrypt.hash(password, 10)
  let temp = db.users.update({
    where: { ID_User },
    data: {
      Password_User: hash
    }
  })
  return temp
}

async function getTeachersProfile(ID_User) {
  let Courses = await db.course.findMany({
    where: {
      Teacher_Course: ID_User
    },
  })
  let Questions = await db.questions.findMany({
    where: {
      teacherId: ID_User
    }
  })
  let Tests = await db.tests.findMany({
    where: {
      teacherId: ID_User
    }
  })
  let Lections = await db.lection.findMany({
    where: {
      teacherId: ID_User
    }
  })
  let Results = []
  for (let test of Tests) {
    let tempResultData = await db.passed_test.findMany({
      where: {
        Test_Passed_Test: test.ID_Test
      }
    })
    if (tempResultData.length > 0) {
      for (let result of tempResultData) {
        let student = await db.users.findFirst({ where: { ID_User: result.User_Passed_Test } })
        result.test_title = test.Tittle_test
        result.student_name = `${student.Last_name_User} ${student.First_name_User} ${student.Last_name_User}`
      }

      Results = [...Results, ...tempResultData]
    }
  }

  return { Courses, Questions, Tests, Lections, Results }
}

function findUserByEmail(Email_User) {
  return db.users.findUnique({
    where: {
      Email_User
    },
  });
}

async function createUserByEmailAndPassword(user) {
  user.Password_User = await bcrypt.hash(user.Password_User, 10);
  return db.users.create({
    data: user,
  });
}

async function findUserById(ID_User) {
  let user = await db.users.findUnique({
    where: {
      ID_User
    },
  });
  let contract = await db.contract.findFirst({
    where: {
      userId: ID_User
    }
  })
  return { ...user, contract }
}

async function createTest(teacherId, Deadline_test, Tittle_test, courseId) {
  return db.tests.create({
    data: {
      teacherId,
      Deadline_test,
      Tittle_test,
      courseId,
    }
  })
}

async function createLection(Tittle_Lection, Theme_Lection, Format_Lection, Text_Lection, teacherId, courseId) {
  return db.lection.create({
    data: {
      Tittle_Lection,
      Theme_Lection,
      Format_Lection,
      Text_Lection,
      teacherId,
      courseId
    }
  })
}

async function createTestQuestion(testId, questionId) {
  return db.test_question.create({
    data: {
      testId,
      questionId
    }
  })
}

async function createLogPWDChange(pass_old, pass_new, userId) {
  let hash = await bcrypt.hash(pass_new, 10)

  return db.log_user_change_password.create({
    data: {
      pass_old,
      pass_new: hash,
      userId
    }
  })
}

async function createLogStudentAnswer(userId, data) {
  return db.log_student_reply.create({
    data: {
      userId,
      data,
    }
  })
}

function getTeachersQuestions(teacherId) {
  return db.questions.findMany({
    where: {
      teacherId
    }
  })
}

export {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
  findStudentsCourses,
  createPassedTest,
  findUsersAnswers,
  changeUserPassword,
  getTeachersProfile,
  findAnswersByTestId,
  createLection,
  createTest,
  createTestQuestion,
  createLogPWDChange,
  createLogStudentAnswer,
  createTeachersQuestion,
  getTeachersQuestions
};