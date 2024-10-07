const mongoose = require('mongoose');
const User = require('./models/users'); // Adjust the path as necessary
const dotenv = require('dotenv/config.js');
const Notification = require('./models/notifications');
const Room = require('./models/rooms'); // Adjust the path to where your Room model is located
const Video = require('./models/videos');

const updateRooms = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const roomsToUpdate = await Room.find({
            lastUpdated: { $type: "date" } // Checking for incorrect value types
        });

        if (roomsToUpdate.length > 0) {
            console.log(`Found ${roomsToUpdate.length} rooms with invalid lastUpdated field.`);

            // Update each room's lastUpdated to the correct value
            for (const room of roomsToUpdate) {
                room.lastUpdated = Date.now(); // Set to the current timestamp
                await room.save();
                console.log(`Updated room ${room._id} with the correct lastUpdated.`);
            }
        } else {
            console.log('No rooms found with invalid lastUpdated field.');
        }

        // Sync indexes with the updated schema
        await Room.syncIndexes();
        console.log('Indexes synchronized successfully.');
    } catch (error) {
        console.error('Error updating rooms:', error);
    } finally {
        // Close the connection after the update
        mongoose.connection.close();
    }
};

// Run the update script
updateRooms();

// const updateRooms = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         })

//         // Update all existing rooms to add the `isPlaying` field with a default value of false
//         const result = await Room.updateMany({}, { $set: { lastUpdated: new Date() } });
        
//         console.log(`${result.nModified} rooms updated successfully.`);
//     } catch (error) {
//         console.error('Error updating rooms:', error);
//     } finally {
//         // Close the connection after the update
//         mongoose.connection.close();
//     }
// };

// // Run the update script
// updateRooms();

// const updateRoomsSchema = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         // Sync indexes with the updated schema
//         await Video.syncIndexes();
//         console.log('Indexes synchronized successfully.');

//     } catch (err) {
//         console.error('Error updating rooms schema:', err);
//     } finally {
//         await mongoose.disconnect();
//     }
// };

// const updateRoomsSchema = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         // Update all existing rooms to add the 'privacy' field with a default value of 'public'
//         await Room.updateMany(
//             { privacy: { $exists: false } },  // Only update rooms that don't have the 'privacy' field
//             { $set: { privacy: 'public' } }   // Set the default value for 'privacy'
//         );

//         console.log('Existing rooms updated successfully.');

//         // Sync indexes with the updated schema
//         await Room.syncIndexes();
//         console.log('Indexes synchronized successfully.');

//     } catch (err) {
//         console.error('Error updating rooms schema:', err);
//     } finally {
//         await mongoose.disconnect();
//     }
// };

// const updateRoomsSchema = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         // Update all existing rooms to add the 'privacy' field with a default value of 'public'
//         await Room.updateMany(
//             { privacy: { $exists: false } },  // Only update rooms that don't have the 'privacy' field
//             { $set: { privacy: 'public' } }   // Set the default value for 'privacy'
//         );

//         console.log('Existing rooms updated successfully.');

//         // Sync indexes with the updated schema
//         await Room.syncIndexes();
//         console.log('Indexes synchronized successfully.');

//     } catch (err) {
//         console.error('Error updating rooms schema:', err);
//     } finally {
//         await mongoose.disconnect();
//     }
// };

// updateRoomsSchema();


// async function syncIndexes() {
//     try {
//         await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         await Notification.syncIndexes();
//         console.log('Indexes are synced.');

//         mongoose.connection.close();
//     } catch (error) {
//         console.error('Error syncing indexes:', error);
//     }
// }

// syncIndexes();


// async function syncIndexesAndServe() {
//     try {
//         // Connect to your MongoDB database
//         await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         // Ensure indexes are synced
//         await User.syncIndexes();  // This will sync the indexes with the database

//         console.log('Indexes are synced.');

//         // Now proceed with your schema update
//         await User.updateMany(
//             { receivedRoomInvites: { $exists: false } }, // Check if the field does not exist
//             { $set: { receivedRoomInvites: [] } } // Set the field as an empty array
//         );

//         console.log('All users have been updated with the new receivedRoomInvites field.');

//         // Close the connection after updating
//         mongoose.connection.close();
//     } catch (error) {
//         console.error('Error syncing indexes or updating users:', error);
//     }
// }

// // Run the sync and update script
// syncIndexesAndServe();


// const addSavedAndDownloadedVideosField = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

//         await User.syncIndexes();

//         await User.updateMany({}, { $set: { savedVideos: [], downloads: [] } });
//         console.log('video fields added to all users');
//     } catch (error) {
//         console.error('Error adding video fields', error);
//     }
// };

// addSavedAndDownloadedVideosField();


// const migrateFriendsField = async () => {
//     await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         console.log("Creating indexes...");
//         await Notification.syncIndexes();

//         await session.commitTransaction();
//         session.endSession();
//         console.log("Migration completed successfully.");
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         console.error("Migration failed:", error);
//     } finally {
//         mongoose.connection.close();
//     }
// };

// migrateFriendsField();

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
