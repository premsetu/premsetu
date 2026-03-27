const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Message = require("../models/Message");
const { runtimeConfig } = require("./runtime");

const demoUsers = [
  {
    fullName: "Rohan Mehta",
    email: "rohan@premsetu.demo",
    phone: "9876500001",
    gender: "male",
    dateOfBirth: "1994-05-10",
    religion: "Hindu",
    caste: "Brahmin",
    gotra: "Kashyap",
    motherTongue: "Hindi",
    city: "Pune",
    state: "Maharashtra",
    education: "B.Tech",
    profession: "Software Engineer",
    annualIncome: "18 LPA",
    height: "5ft 10in",
    maritalStatus: "never married",
    bio: "Family-oriented, calm, and looking for a thoughtful life partner who values kindness and growth.",
    isProfileComplete: true
  },
  {
    fullName: "Aditi Sharma",
    email: "aditi@premsetu.demo",
    phone: "9876500002",
    gender: "female",
    dateOfBirth: "1996-03-18",
    religion: "Hindu",
    caste: "Brahmin",
    gotra: "Vashishtha",
    motherTongue: "Hindi",
    city: "Bengaluru",
    state: "Karnataka",
    education: "MBA",
    profession: "Product Manager",
    annualIncome: "22 LPA",
    height: "5ft 5in",
    maritalStatus: "never married",
    bio: "Warm, ambitious, and grounded. I appreciate honest communication and strong family values.",
    isProfileComplete: true
  },
  {
    fullName: "Arjun Verma",
    email: "arjun@premsetu.demo",
    phone: "9876500003",
    gender: "male",
    dateOfBirth: "1993-11-02",
    religion: "Hindu",
    caste: "Kshatriya",
    gotra: "Bharadwaj",
    motherTongue: "Hindi",
    city: "Jaipur",
    state: "Rajasthan",
    education: "M.Com",
    profession: "Business Owner",
    annualIncome: "20 LPA",
    height: "5ft 9in",
    maritalStatus: "never married",
    bio: "Entrepreneurial mindset with a simple lifestyle. Looking for a caring and balanced partner.",
    isProfileComplete: true
  },
  {
    fullName: "Sneha Iyer",
    email: "sneha@premsetu.demo",
    phone: "9876500004",
    gender: "female",
    dateOfBirth: "1995-09-27",
    religion: "Hindu",
    caste: "Iyer",
    gotra: "Atreya",
    motherTongue: "Tamil",
    city: "Chennai",
    state: "Tamil Nadu",
    education: "M.Sc",
    profession: "Data Analyst",
    annualIncome: "14 LPA",
    height: "5ft 4in",
    maritalStatus: "never married",
    bio: "Creative, spiritual, and deeply family-focused. I enjoy meaningful conversations and a peaceful routine.",
    isProfileComplete: true
  },
  {
    fullName: "Karan Singh",
    email: "karan@premsetu.demo",
    phone: "9876500005",
    gender: "male",
    dateOfBirth: "1992-01-14",
    religion: "Sikh",
    caste: "Khatri",
    gotra: "",
    motherTongue: "Punjabi",
    city: "Delhi",
    state: "Delhi",
    education: "BBA",
    profession: "Operations Lead",
    annualIncome: "16 LPA",
    height: "6ft 0in",
    maritalStatus: "never married",
    bio: "Respectful, practical, and close to my family. Looking for companionship built on trust and understanding.",
    isProfileComplete: true
  },
  {
    fullName: "Priya Nair",
    email: "priya@premsetu.demo",
    phone: "9876500006",
    gender: "female",
    dateOfBirth: "1997-07-08",
    religion: "Hindu",
    caste: "Nair",
    gotra: "",
    motherTongue: "Malayalam",
    city: "Kochi",
    state: "Kerala",
    education: "BDS",
    profession: "Dentist",
    annualIncome: "12 LPA",
    height: "5ft 3in",
    maritalStatus: "never married",
    bio: "Easygoing, optimistic, and family-loving. Hoping to build a partnership filled with support and laughter.",
    isProfileComplete: true
  }
];

const seedDemoData = async () => {
  if (!runtimeConfig.enableDemoSeed) {
    return;
  }

  const existingUsers = await User.countDocuments();

  if (existingUsers > 0) {
    return;
  }

  const hashedPassword = await bcrypt.hash("PremSetu@123", 10);

  const createdUsers = await User.insertMany(
    demoUsers.map((user) => ({
      ...user,
      password: hashedPassword
    }))
  );

  const [rohan, aditi, arjun, sneha] = createdUsers;

  rohan.interestedIn = [aditi._id];
  rohan.interestedBy = [aditi._id];
  rohan.matches = [aditi._id];
  aditi.interestedIn = [rohan._id];
  aditi.interestedBy = [rohan._id];
  aditi.matches = [rohan._id];

  arjun.interestedIn = [sneha._id];
  arjun.interestedBy = [sneha._id];
  arjun.matches = [sneha._id];
  sneha.interestedIn = [arjun._id];
  sneha.interestedBy = [arjun._id];
  sneha.matches = [arjun._id];

  await Promise.all([rohan.save(), aditi.save(), arjun.save(), sneha.save()]);

  await Message.insertMany([
    {
      sender: rohan._id,
      receiver: aditi._id,
      message: "Hi Aditi, your profile felt very genuine. Would love to know more about you.",
      isRead: true
    },
    {
      sender: aditi._id,
      receiver: rohan._id,
      message: "Hi Rohan, thank you. I liked your profile too, especially the way you wrote about family.",
      isRead: true
    }
  ]);

  console.log("Seeded demo users with password: PremSetu@123");
};

module.exports = {
  seedDemoData
};
