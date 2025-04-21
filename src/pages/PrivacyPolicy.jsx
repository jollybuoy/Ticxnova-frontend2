// src/pages/PrivacyPolicy.jsx
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 text-gray-800 bg-white rounded-xl shadow">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">🔐 Privacy Policy</h1>

      <p className="mb-4">
        At <strong>Ticxnova</strong>, we respect your privacy and are committed to protecting your
        personal data. This Privacy Policy outlines how we collect, use, and safeguard the
        information you provide when using our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Name, Email, Department (for login & ticketing)</li>
        <li>Tickets created and assigned</li>
        <li>Authentication tokens (stored securely)</li>
        <li>Optional files or notes added to tickets</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use This Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To authenticate users (via Microsoft or manual login)</li>
        <li>To display organization-specific and personal tickets</li>
        <li>To improve support, accountability, and analytics</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Data Storage & Security</h2>
      <p className="mb-4">
        All user data is stored securely in encrypted Azure SQL databases. We follow
        best practices for role-based access control and Microsoft Identity protection.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Third-Party Access</h2>
      <p className="mb-4">
        We do <strong>not</strong> share your personal information with third parties without
        explicit consent. Microsoft Graph API is used only to fetch user details with
        your permission.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>You can request to view or delete your data</li>
        <li>You may opt-out of Microsoft integration anytime</li>
        <li>We retain data only as long as needed for support</li>
      </ul>

      <p className="mt-8 text-sm text-gray-600">
        For any questions about this Privacy Policy, contact us at <strong>support@ticxnova.com</strong>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
