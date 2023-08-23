import { Schema, model } from 'mongoose';
import { handleSaveError, runValidateAtUpdate } from './hooks.js';

const quizSchema = new Schema({}, { versionKey: false, timestamps: true });

quizSchema.pre('findOneAndUpdate', runValidateAtUpdate);

quizSchema.post('save', handleSaveError);

quizSchema.post('findOneAndUpdate', handleSaveError);

const Todo = model('todo', quizSchema);

export default Todo;
