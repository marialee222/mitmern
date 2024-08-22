import React, { useState, useEffect } from 'react';

function BankForm({
  label,
  fields,
  handle,
  submitButtonLabel,
  formData,
  setFormData,
  widthClass,
  isFormFilled,
  setIsFormFilled,
}) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const checkIfFormFilled = () => {
      const isFilled = fields.every(field => {
        const value = formData[field];
        return value && value.toString().trim() !== '';
      });
      setIsFormFilled(isFilled);
    };
    checkIfFormFilled();
  }, [formData, fields, setIsFormFilled]);

  const handleInputChange = (field, value) => {
    if (field === 'accountType') {
      setFormData(prevData => ({
        ...prevData,
        [field]: value,
      }));
    } else {
      setFormData(prevData => ({ ...prevData, [field]: value }));
    }
    setStatus('');
  };

  const handleSubmit = () => {
    const areFieldsValid = validateForm(formData);
    if (areFieldsValid) {
      handle(formData);
    }
  };

  const validateForm = formData => {
    let isValid = true;
    const validationStatus = fields.reduce((status, field) => {
      if (field === 'name' && (!formData.name || !formData.name.trim())) {
        status = 'Please enter your name.';
        isValid = false;
      } else if (field === 'email') {
        if (!formData.email) {
          status = 'Please enter your email address.';
          isValid = false;
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
            status = 'Please enter a valid email address.';
            isValid = false;
          }
        }
      } else if (field === 'password' && (!formData.password || formData.password.length < 8)) {
        status = 'Password must be at least 8 characters long.';
        isValid = false;
      }
      return status;
    }, '');

    setStatus(validationStatus);
    return isValid;
  };

  const getFieldName = field => {
    const fieldNames = {
      role: 'Choose Role ▼',
      accountType: 'Choose Account Type ▼',
    };
    return fieldNames[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  return (
    <div className={`col-md-6 ${widthClass}`}>
      <div className="card bg-light">
        <div className="card-body">
          <h5 className="card-title">{label}</h5>
          {status && <div className="alert alert-danger">{status}</div>}
          <form>
            {fields.map(field => (
              <div key={field} className="form-group">
                {field === 'role' ? (
                  <select
                    className="form-select"
                    value={formData[field] || 'customer'}
                    onChange={e => handleInputChange(field, e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="employee">Employee</option>
                  </select>
                ) : field === 'accountType' ? (
                  <select
                    className="form-select"
                    value={formData[field] || ''}
                    onChange={e => handleInputChange(field, e.target.value)}
                  >
                    <option value="">{getFieldName(field)}</option>
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
                ) : (
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    className="form-control"
                    placeholder={getFieldName(field)}
                    value={formData[field] || ''}
                    onChange={e => handleInputChange(field, e.target.value)}
                  />
                )}
              </div>
            ))}
            <div className="text-right">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!isFormFilled}
              >
                {submitButtonLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BankForm;
