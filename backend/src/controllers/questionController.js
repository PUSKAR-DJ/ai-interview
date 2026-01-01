import Question from "../models/Question.js";
import Department from "../models/Department.js";

// @desc    Get all questions (Admin gets all, HR gets department-specific)
// @route   GET /api/questions
export const getQuestions = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'hr') {
            if (!req.user.departmentId) {
                return res.status(400).json({ message: "HR user has no assigned department" });
            }
            query = { departmentId: req.user.departmentId };
        }

        // If admin has a departmentId filter in query
        if (req.user.role === 'admin' && req.query.departmentId) {
            query.departmentId = req.query.departmentId;
        }

        const questions = await Question.find(query)
            .populate('departmentId', 'name')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new question
// @route   POST /api/questions
export const createQuestion = async (req, res) => {
    try {
        const { text, departmentId } = req.body;

        if (!text || !departmentId) {
            return res.status(400).json({ message: "Text and Department ID are required" });
        }

        // Role check: HR can only add to their own department
        const userDeptId = req.user.departmentId?._id?.toString() || req.user.departmentId?.toString();
        if (req.user.role === 'hr' && userDeptId !== departmentId) {
            return res.status(403).json({ message: "HR can only add questions to their own department" });
        }

        const question = await Question.create({
            text,
            departmentId,
            createdBy: req.user.id
        });

        const populatedQuestion = await Question.findById(question._id)
            .populate('departmentId', 'name')
            .populate('createdBy', 'name');

        res.status(201).json(populatedQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
export const updateQuestion = async (req, res) => {
    try {
        const { text, departmentId } = req.body;
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Role check
        const userDeptId = req.user.departmentId?._id?.toString() || req.user.departmentId?.toString();
        if (req.user.role === 'hr' && question.departmentId.toString() !== userDeptId) {
            return res.status(403).json({ message: "Unauthorized to update this question" });
        }

        // If HR is trying to change the department
        if (req.user.role === 'hr' && departmentId && departmentId !== userDeptId) {
            return res.status(403).json({ message: "HR cannot change the department of a question" });
        }

        question.text = text || question.text;
        if (req.user.role === 'admin' && departmentId) {
            question.departmentId = departmentId;
        }

        await question.save();

        const updatedQuestion = await Question.findById(question._id)
            .populate('departmentId', 'name')
            .populate('createdBy', 'name');

        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
export const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Role check
        const userDeptId = req.user.departmentId?._id?.toString() || req.user.departmentId?.toString();
        if (req.user.role === 'hr' && question.departmentId.toString() !== userDeptId) {
            return res.status(403).json({ message: "Unauthorized to delete this question" });
        }

        await question.deleteOne();
        res.json({ message: "Question removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
