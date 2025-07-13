import React from 'react';

const EyeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block align-text-bottom mr-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const PencilIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block align-text-bottom mr-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.25H3.75v-3.75L16.862 4.487z" />
  </svg>
);
const TrashIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block align-text-bottom mr-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PasswordList = ({ passwords, onView, onEdit, onDelete }) => {
  if (!passwords.length) return <div className="text-gray-500">No passwords saved yet.</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {passwords.map(pw => (
        <div
          key={pw._id}
          className="bg-white rounded-xl shadow-lg p-5 flex flex-col gap-2 transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-lg text-blue-700 dark:text-blue-200">{pw.title}</div>
            <div className="text-gray-400 text-xs">{pw.username}</div>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => onView(pw)} className="flex-1 px-3 py-1 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 shadow-md" title="View">{EyeIcon}View</button>
            <button onClick={() => onEdit(pw)} className="flex-1 px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 shadow-md" title="Edit">{PencilIcon}Edit</button>
            <button onClick={() => onDelete(pw._id, pw.title)} className="flex-1 px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors duration-200 shadow-md" title="Delete">{TrashIcon}Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PasswordList; 