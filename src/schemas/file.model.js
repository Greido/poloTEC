import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: String,
    filepath: String
});

export const File = mongoose.model('File', fileSchema);