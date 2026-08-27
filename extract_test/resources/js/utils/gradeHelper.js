export const getCourseTypeName = (courseType) => {
    let type = typeof courseType === 'object' ? courseType?.value ?? courseType?.description : courseType;
    if (type === 0 || type === '0' || type === 'Regular') return 'Regular';
    if (type === 1 || type === '1' || type === 'Short_Course' || type === 'Short Course') return 'Short Course';
    if (type === 2 || type === '2' || type === 'Diploma') return 'Diploma';
    return type || 'N/A';
};

export const getGradeLimit = (courseType) => {
    let type = typeof courseType === 'object' ? courseType?.value ?? courseType?.description : courseType;
    
    // Check by integer value or string name
    if (type === 0 || type === '0' || type === 'Regular') return 100;
    if (type === 1 || type === '1' || type === 'Short_Course' || type === 'Short Course') return 1200;
    if (type === 2 || type === '2' || type === 'Diploma') return 4800;
    
    return 100; // Default fallback
};

export const calculateGrade = (totalMarksObtained, courseType) => {
    const limit = getGradeLimit(courseType);
    const marks = parseInt(totalMarksObtained || 0);
    const percentage = (marks / limit) * 100;

    if (percentage >= 80) return "A+";
    if (percentage >= 75) return "A";
    if (percentage >= 70) return "A-";
    if (percentage >= 65) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 55) return "B-";
    if (percentage >= 50) return "C+";
    if (percentage >= 45) return "C";
    if (percentage >= 40) return "D";
    if (percentage >= 0) return "F";
    
    return "Invalid";
};

export const calculateGPA = (totalMarksObtained, courseType) => {
    const limit = getGradeLimit(courseType);
    const marks = parseInt(totalMarksObtained || 0);
    const percentage = (marks / limit) * 100;

    if (percentage >= 80) return "4.00";
    if (percentage >= 75) return "3.75";
    if (percentage >= 70) return "3.50";
    if (percentage >= 65) return "3.25";
    if (percentage >= 60) return "3.00";
    if (percentage >= 55) return "2.75";
    if (percentage >= 50) return "2.50";
    if (percentage >= 45) return "2.25";
    if (percentage >= 40) return "2.00";
    
    if (percentage >= 0) return "0.00";
    
    return "Invalid";
};
