import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: String,
    filepath: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
});

export const File = mongoose.model('File', fileSchema);