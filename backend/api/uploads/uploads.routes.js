import express from 'express';

import { existsSync } from 'fs'
import { join } from 'path'

const router = express.Router();


router.post("/", async (req, res, next) => {
    try {
        let sampleFile;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400)
            throw new Error("Не приложен файл");
        }
        sampleFile = req.files.admin_file_upload;
        uploadPath = join(process.env.APP_ROOT, 'uploads', sampleFile.name);
        if (existsSync(uploadPath)) {
            res.status(400)
            throw new Error("Такой файл уже существует")
        }
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                res.status(500)
                throw err
            }

            res.json({
                uploadPath,
                message: "Файл успешно добавлен"
            })
        });
    } catch (error) {
        next(error)
    }
})

router.get("/:name", (req, res, next) => {
    try {
        let path = `${process.env.APP_ROOT + '/uploads/' + req?.params?.name}`
        if (!existsSync(path)) {
            res.status(400)
            throw new Error("Файл не найден")
        }
        res.sendFile(path)
    } catch (error) {
        next(error)
    }
})

export default router;