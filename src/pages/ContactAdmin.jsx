import React from "react";

const ContactAdmin = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-white text-gray-800 shadow rounded-xl mt-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">📩 Contact Admin</h1>

      <p className="mb-4">If you're having trouble logging in or need support, please use the form below or contact us directly.</p>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Your Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            rows="5"
            placeholder="Describe your issue..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Send Message
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-6">
        Or reach us at <strong>support@ticxnova.com</strong>
      </p>
    </div>
  );
};

export default ContactAdmin;
