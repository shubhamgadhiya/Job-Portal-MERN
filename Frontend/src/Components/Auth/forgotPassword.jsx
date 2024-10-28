// ForgotPassword.jsx
import React, { useState } from 'react';
import ForgotPasswordRequest from './ForgotPassportRequest';
import EnterOtp from './Otp';
import SetNewPassword from './NewPassword';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const handleNext = (data) => {
    if (step === 1) {
      setEmail(data);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {step === 1 && <ForgotPasswordRequest onNext={handleNext} />}
      {step === 2 && <EnterOtp email={email} onNext={handleNext} />}
      {step === 3 && <SetNewPassword email={email} />}
    </div>
  );
};

export default ForgotPassword;
