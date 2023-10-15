// import { Schema, Document, model } from 'mongoose';
// import { User } from '../../types/index.js';

// export interface UserDocument extends User, Document {createdAt: Date, updatedAt: Date}

// const userSchema = new Schema({
//   name: {
//     type: String,
//     minlength: [5, 'Min length for name path is 1'],
//     maxlength: [15, 'Max length for name path is 15'],
//     required: true,
//   },
//   mail: {
//     type: String,
//     unique: true,
//     match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
//     required: true,
//   },
//   avatar: String,
//   userType: {
//     type: String,
//     required: true,
//   },
// }, {timestamps: true});

// export const UserModel = model<UserDocument>('User', userSchema);
