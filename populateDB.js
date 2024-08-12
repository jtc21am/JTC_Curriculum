require('dotenv').config();
const dbConnect = require('./dbConnect');
const { Lesson } = require('./models');
const curriculumData = require('./corrected_curriculum_final.json');

async function populateDatabase() {
    await dbConnect();

    try {
        // Clear existing lessons
        await Lesson.deleteMany({});

        // Insert new lessons
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
        console.log('Database populated successfully');
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        process.exit();
    }
}

populateDatabase();