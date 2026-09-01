import React from 'react';
import { PrecedentStatus as BasePrecedentStatus } from '../case/PrecedentStatus';

export const PrecedentStatus = ({ status, className = '' }) => {
  return <BasePrecedentStatus status={status} className={className} />;
};

export default PrecedentStatus;
