const { body } = require('express-validator');

const VALIDATION_LIMITS = {
    CONDITION_NAME: {
        MIN: 2,
        MAX: 255
    },
    TEXT_FIELD: {
        LONG: 1000,
        MEDIUM: 500
    }
};

const ERROR_MESSAGES = {
    REQUIRED: 'حقل مطلوب',
    LENGTH: (min, max) => `يجب أن يكون الطول بين ${min} و ${max} حرف`,
    MAX_LENGTH: (max) => `يجب أن لا يتجاوز الطول ${max} حرف`,
    INVALID_DATE: 'يجب أن يكون التاريخ صحيحاً',
    FUTURE_DATE: 'لا يمكن أن يكون التاريخ في المستقبل'
};

const createTextValidator = (fieldName, maxLength, isRequired = false) => {
    const chain = body(fieldName)
        .trim()
        .isLength({ max: maxLength })
        .withMessage(ERROR_MESSAGES.MAX_LENGTH(maxLength));

    return isRequired ? 
        chain.notEmpty().withMessage(ERROR_MESSAGES.REQUIRED) : 
        chain.optional();
};

const validateFutureDate = (value) => {
    const date = new Date(value);
    const now = new Date();
    if (date > now) {
        throw new Error(ERROR_MESSAGES.FUTURE_DATE);
    }
    return true;
};

const validateMedicalHistory = [
    // Required Fields
    body('condition_name')
        .notEmpty()
        .withMessage(ERROR_MESSAGES.REQUIRED)
        .trim()
        .isLength(VALIDATION_LIMITS.CONDITION_NAME)
        .withMessage(ERROR_MESSAGES.LENGTH(
            VALIDATION_LIMITS.CONDITION_NAME.MIN,
            VALIDATION_LIMITS.CONDITION_NAME.MAX
        )),

    // Date Fields
    body('diagnosis_date')
        .optional()
        .isISO8601()
        .withMessage(ERROR_MESSAGES.INVALID_DATE)
        .custom(validateFutureDate),

    // Long Text Fields (1000 chars)
    createTextValidator('treatment_description', VALIDATION_LIMITS.TEXT_FIELD.LONG),
    createTextValidator('medications', VALIDATION_LIMITS.TEXT_FIELD.LONG),
    createTextValidator('surgery_history', VALIDATION_LIMITS.TEXT_FIELD.LONG),
    createTextValidator('notes', VALIDATION_LIMITS.TEXT_FIELD.LONG),

    // Medium Text Fields (500 chars)
    createTextValidator('allergies', VALIDATION_LIMITS.TEXT_FIELD.MEDIUM),
    createTextValidator('chronic_diseases', VALIDATION_LIMITS.TEXT_FIELD.MEDIUM)
];

module.exports = {
    validateMedicalHistory,
    VALIDATION_LIMITS,
    ERROR_MESSAGES
};