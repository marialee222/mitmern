const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// Console log to verify that the models are being imported correctly
console.log('Account Model:', Account);
console.log('Transaction Model:', Transaction);

// Create a transaction (deposit or withdraw)
exports.createTransaction = async (req, res) => {
  const { accountId, amount, transactionType } = req.body;

  try {
    console.log('Received request to create transaction:', req.body);

    const account = await Account.findById(accountId);
    if (!account) {
      console.log('Account not found:', accountId);
      return res.status(404).json({ msg: 'Account not found' });
    }

    // Convert balance and amount to numbers
    const currentBalance = Number(account.balance);
    const transactionAmount = Number(amount);

    const transaction = new Transaction({
      account: accountId,
      amount: transactionAmount,
      transactionType,
    });

    await transaction.save();
    console.log('Transaction saved:', transaction);

    if (transactionType === 'deposit') {
      account.balance = currentBalance + transactionAmount;
    } else if (transactionType === 'withdraw') {
      if (transactionAmount > currentBalance) {
        console.log('Insufficient balance for withdrawal:', currentBalance, transactionAmount);
        return res.status(400).json({ msg: 'Insufficient balance' });
      }
      account.balance = currentBalance - transactionAmount;
    }

    await account.save();
    console.log('Account balance updated:', account.balance);

    res.json({
      msg: `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} successful`,
      transaction,
    });
  } catch (err) {
    console.error('Error creating transaction:', err.message);
    res.status(500).send('Server error');
  }
};

// Get transactions for a specific account
exports.getAccountTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ account: req.params.accountId });
    console.log('Fetched transactions for account:', req.params.accountId, transactions);

    // Return an empty array if no transactions found instead of an error
    if (!transactions || transactions.length === 0) {
      console.log('No transactions found for account:', req.params.accountId);
      return res.json([]); // Return an empty array
    }

    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err.message);
    res.status(500).send('Server error');
  }
};

// Transfer funds between accounts
exports.transferFunds = async (req, res) => {
  const { sourceAccountId, destinationAccountId, amount } = req.body;

  try {
    console.log('Received request to transfer funds:', req.body);

    // Fetch accounts using account numbers
    const sourceAccount = await Account.findOne({ accountNumber: sourceAccountId });
    const destinationAccount = await Account.findOne({ accountNumber: destinationAccountId });

    if (!sourceAccount) {
      console.log('Source account not found:', sourceAccountId);
      return res.status(404).json({ msg: 'Source account not found' });
    }
    if (!destinationAccount) {
      console.log('Destination account not found:', destinationAccountId);
      return res.status(404).json({ msg: 'Destination account not found' });
    }

    // Convert amount and balances to numbers
    const amountToTransfer = Number(amount);
    const sourceBalance = Number(sourceAccount.balance);
    const destinationBalance = Number(destinationAccount.balance);

    // Check if the source account has sufficient balance
    if (sourceBalance < amountToTransfer) {
      console.log('Insufficient balance in source account:', sourceBalance, amountToTransfer);
      return res.status(400).json({ msg: 'Insufficient balance in source account' });
    }

    // Perform the transfer
    sourceAccount.balance = sourceBalance - amountToTransfer;
    destinationAccount.balance = destinationBalance + amountToTransfer;

    // Save the updated accounts
    await sourceAccount.save();
    await destinationAccount.save();
    console.log('Accounts updated after transfer');

    // Log transactions for both accounts
    const sourceTransaction = new Transaction({
      account: sourceAccount._id,
      amount: amountToTransfer,
      transactionType: 'withdraw',
    });

    const destinationTransaction = new Transaction({
      account: destinationAccount._id,
      amount: amountToTransfer,
      transactionType: 'deposit',
    });

    await sourceTransaction.save();
    await destinationTransaction.save();
    console.log('Transactions saved for both accounts:', sourceTransaction, destinationTransaction);

    res.json({ msg: 'Transfer successful' });
  } catch (err) {
    console.error('Error transferring funds:', err.message);
    res.status(500).send({ msg: 'Server error. Please try again later.' });
  }
};
