import React from 'react';
import BankForm from './BankForm';

function Balance() {
  function handle(data) {
    console.log('Checking balance for:', data);
    return true;
  }

  const fields = [];

  return (
    <BankForm
      bgcolor="primary"
      label="Check Balance"
      fields={fields}
      handle={handle}
      successButton="Check Another Account"
    />
  );
}

export default Balance;
