#### MIT xPRO Fullstack Development
## MITMERN Bank App
### Create Account, Deposit, Withdraw, Transfer Funds

## Description 
The MITMERN Bank app provides users with a seamless and secure platform to manage their finances. Users can create accounts, log in securely, and perform transactions such as deposits, withdrawals, and fund transfers. The app features real-time balance updates and transaction validation, ensuring accuracy and efficiency. With a sleek, intuitive interface crafted using React, CSS, and Bootstrap, users enjoy a user-friendly experience for all their banking needs.

###

### Features
	- Account Management: Users can create accounts, log in securely, and manage their profiles.
	- Transactions: Perform deposits, withdrawals, and transfers with real-time balance updates.
	- Admin Dashboard: Admins can view all users, accounts, and transactions with scrolling enabled for easy management.
	- User Dashboard: Users can view their account details and recent transactions in a clear, organized layout.
	- Responsive Design: The app is fully responsive, offering an optimal experience across devices.
	- Security: JWT-based authentication ensures secure access to user accounts.

### Improvements
Recent updates to enhance user experience and functionality include: 

	- Navigation: Improved navbar with clear indicators and professional dropdowns.
	- Feedback: Success and error messages for user actions, improving clarity.
	- UI Consistency: Uniform Bootstrap card styles across all pages, with added splashes of color for visual appeal.
	- Transfer Funds: A dedicated section for transferring funds between accounts.
	- Admin Dashboard: Scrollable interface for easier management of data.

## How to Run
To run the MITMERN Bank App on your machine, follow these steps:

Clone the repository:
   
	git clone https://github.com/marialee222/mitmern.git

Navigate to the directory:
   
	cd bank

Install the necessary dependencies for both the front-end and back-end:

Navigate to the frontend directory and install dependencies:

   	cd frontend
	npm install

Then, do the same for the backend:

   	cd ./backend
	npm install

Set up environment variables:

Ensure that you have all the necessary environment variables set up for both the front-end and back-end.

For the backend, create a .env file in the backend directory and add the required environment variables:

	JWT_SECRET=your_jwt_secret
	MONGO_URI=your_mongo_connection_string

For the frontend, you might also need to configure environment variables if applicable.

Run the back-end server:

From the backend directory:

   	npm run dev

The back-end server should now be running on http://localhost:5001.

Run the front-end server:

Open a new terminal, navigate to the frontend directory, and start the front-end server:

   	npm start

The front-end server should now be running on http://localhost:3000.

Open your preferred browser and navigate to:

	http://localhost:3000

You should now see the MITMERN Bank App running locally.

## Roadmap of Future Improvements
Planned future enhancements for the MITMERN Bank App include:

	- Two-Factor Authentication (2FA): Adding an extra layer of security.
	- Detailed User Dashboard: Providing more insights and features.
	- Transaction Categories & Budgeting Tools: Helping users manage their finances better.
	- Mobile App Development: Expanding accessibility to mobile users.
	- Personalization & Notifications: Enhancing user engagement with personalized features.
   
:star: Feel free to contribute ideas or collaborate on these enhancements!
