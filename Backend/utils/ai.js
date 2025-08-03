const natural = require('natural');
const nlp = require('compromise');

function extractSkillsFromText(text) {
  const skills = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'MongoDB', 'Express', 'SQL', 'C++', 'HTML', 'CSS'];
  const foundSkills = skills.filter(skill => new RegExp(`\\b${skill}\\b`, 'i').test(text));
  return foundSkills;
}

function extractName(text) {
  const doc = nlp(text);
  const people = doc.people().out('array');
  if (people.length > 0) return people[0];
  // fallback: try first line as name
  return text.split('\n')[0].trim();
}

function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : '';
}

function extractDOB(text) {
  const dobMatch = text.match(/(?:DOB|Date of Birth)[:\s]*([0-9]{1,2}[\/\-.][0-9]{1,2}[\/\-.][0-9]{2,4})/i);
  return dobMatch ? dobMatch[1] : '';
}

function extractBTechYear(text) {
  const match = text.match(/B\.?Tech.*?([0-9]{4})/i);
  return match ? match[1] : '';
}

function extractDuration(text) {
  const match = text.match(/(?:from|between)?\s*(\d{4})\s*(?:to|–|-)\s*(\d{4}|present)/i);
  if (match) return `${match[1]} to ${match[2]}`;
  return '';
}

function extractExperience(text) {
  const match = text.match(/(\d+(\.\d+)?)\s*(years|yrs|year|yr)\s+experience/i);
  return match ? match[0] : '';
}

function calculateMatchScore(resumeSkills, jobSkills) {
  if (!resumeSkills || !jobSkills || resumeSkills.length === 0 || jobSkills.length === 0) return 0;
  const matchedSkills = resumeSkills.filter(skill => jobSkills.includes(skill));
  return Math.round((matchedSkills.length / jobSkills.length) * 100);
}

function parseResume(text) {
  const name = extractName(text);
  const email = extractEmail(text);
  const dob = extractDOB(text);
  const btechYear = extractBTechYear(text);
  const duration = extractDuration(text);
  const experience = extractExperience(text);
  const skills = extractSkillsFromText(text);

  return {
    name,
    email,
    dob,
    btechYear,
    duration,
    experience,
    skills,
  };
}

module.exports = {
  extractSkillsFromText,
  calculateMatchScore,
  parseResume,
};
