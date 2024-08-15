require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const { Lesson, User } = require('./models');
const curriculumData = require('./corrected_curriculum_final.json');

async function uploadData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Lesson.deleteMany({});
        await User.deleteMany({});
        console.log('Existing data cleared');

        // Upload curriculum data
        const lessons = curriculumData.map(item => ({
            code: item.Code,
            date: new Date(item.DATE),
            hrs: item.HRS,
            dow: item.DOW,
            type: item.Type,
            phases: item.Phases,
            moduleName: item['Module Name'],
            lessonName: item['Lesson Name'],
            conceptsCovered: item['Concepts Covered'],
            purpose: item.Purpose,
            preReqs: item['Pre-Reqs'],
            moderator: item.Moderator,
            lecturerType: item['Lecturer Type'],
            requests: [],
            confirmedLecturer: null
        }));

        await Lesson.insertMany(lessons);
        console.log('Curriculum data uploaded');

        // Try to upload user data from CSV if it exists
        if (fs.existsSync('sample_users.csv')) {
            const users = [];
            await new Promise((resolve, reject) => {
                fs.createReadStream('sample_users.csv')
                    .pipe(csv())
                    .on('data', (data) => users.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            });

            await User.insertMany(users);
            console.log('User data uploaded');
        } else {
            console.log('sample_users.csv not found. Skipping user data upload.');
        }

        console.log('All data uploaded successfully');
    } catch (error) {
        console.error('Error uploading data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

uploadData();