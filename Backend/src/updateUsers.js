const mongoose = require('mongoose');
const User = require('./models/users'); // Adjust the path as necessary
const dotenv = require('dotenv/config.js');
const Notification = require('./models/notifications');

const migrateFriendsField = async () => {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("Creating indexes...");
        await Notification.syncIndexes();

        await session.commitTransaction();
        session.endSession();
        console.log("Migration completed successfully.");
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Migration failed:", error);
    } finally {
        mongoose.connection.close();
    }
};

migrateFriendsField();

// const migrateData = async () => {
//     try {
//         console.log("Starting migration...");

//         // Connect to the database
//         await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

//         // Ensure indexes are created
//         console.log("Creating indexes...");
//         await User.syncIndexes();

//         // Update existing users to add new fields, rename old fields, and adjust the friends field to the new schema
//         await User.updateMany(
//             {},
//             {
//                 $set: {
//                     sentFriendRequests: [],
//                     receivedFriendRequests: [],
//                     friends: [], // Initialize friends with the new schema format
//                 },
//                 $unset: {
//                     friendRequests: "" // Remove the old friendRequests field
//                 }
//             }
//         );

//         console.log("Migration completed successfully.");
//     } catch (err) {
//         console.error("Migration failed", err);
//     } finally {
//         mongoose.connection.close();
//     }
// }

// // Execute migration
// migrateData();

// const addFriendRequestsField = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

//         await User.updateMany({}, { $set: { friendRequests: [] } });
//         console.log('Friend requests field added to all users');
//     } catch (error) {
//         console.error('Error adding friend requests field', error);
//     }
// };

// addFriendRequestsField();

// const updateUsers = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

//         // Update all users to include an empty notifications array if not present
//         await User.updateMany(
//             { notifications: { $exists: false } },
//             { $set: { notifications: [] } }
//         );

//         console.log('Users updated successfully');
//         mongoose.connection.close();
//     } catch (error) {
//         console.error('Error updating users:', error);
//         mongoose.connection.close();
//     }
// };

// updateUsers();
