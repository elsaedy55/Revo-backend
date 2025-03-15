const { validationResult } = require('express-validator');
const MedicalHistory = require('../models/medicalHistory.model.js');

const ResponseStatus = {
    SUCCESS: 'success',
    ERROR: 'error'
};

function handleValidationErrors(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return {
            نجاح: false,
            أخطاء: errors.array().map(err => ({
                حقل: err.param,
                رسالة: err.msg
            }))
        };
    }
    return null;
}

function createSuccessResponse(message, data) {
    return {
        نجاح: true,
        رسالة: message,
        ...(data && { بيانات: data })
    };
}

function createErrorResponse(message, error) {
    return {
        نجاح: false,
        رسالة: message,
        ...(error && { خطأ: error })
    };
}

async function createMedicalHistory(req, res) {
    try {
        const validationErrors = handleValidationErrors(req);
        if (validationErrors) {
            return res.status(400).json(validationErrors);
        }

        const medicalHistoryData = {
            user_id: req.userId,
            ...req.body
        };

        const medicalHistory = new MedicalHistory(medicalHistoryData);
        const newRecord = await medicalHistory.create();

        res.status(201).json(
            createSuccessResponse('تم حفظ السجل الطبي بنجاح', newRecord)
        );
    } catch (error) {
        res.status(500).json(
            createErrorResponse('حدث خطأ أثناء حفظ السجل الطبي', error.message)
        );
    }
}

async function getUserMedicalHistory(req, res) {
    try {
        const records = await MedicalHistory.findByUserId(req.userId);
        res.json(createSuccessResponse(null, records));
    } catch (error) {
        res.status(500).json(
            createErrorResponse('حدث خطأ أثناء جلب السجل الطبي', error.message)
        );
    }
}

async function updateMedicalHistory(req, res) {
    try {
        const validationErrors = handleValidationErrors(req);
        if (validationErrors) {
            return res.status(400).json(validationErrors);
        }

        const medicalHistoryData = {
            user_id: req.userId,
            ...req.body
        };

        const medicalHistory = new MedicalHistory(medicalHistoryData);
        const updatedRecord = await medicalHistory.update(req.params.id);

        if (!updatedRecord) {
            return res.status(404).json(
                createErrorResponse('لم يتم العثور على السجل الطبي')
            );
        }

        res.json(
            createSuccessResponse('تم تحديث السجل الطبي بنجاح', updatedRecord)
        );
    } catch (error) {
        res.status(500).json(
            createErrorResponse('حدث خطأ أثناء تحديث السجل الطبي', error.message)
        );
    }
}

module.exports = {
    createMedicalHistory,
    getUserMedicalHistory,
    updateMedicalHistory
};