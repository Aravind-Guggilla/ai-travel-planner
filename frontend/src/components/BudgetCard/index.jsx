import React from 'react';
import { Plane, Bed, Utensils, Ticket, Train, Wallet } from 'lucide-react';
import './index.css';

const BudgetCard = ({ estimatedBudget }) => {
  // Ensure we have a default structure in case some keys are missing
  const budget = estimatedBudget || {};
  
  // Extract values, converting strings or numbers safely
  const parseVal = (val) => {
    if (val === undefined || val === null) return 0;
    const num = Number(String(val).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const flights = parseVal(budget.flights || budget.Flights);
  const accommodation = parseVal(budget.accommodation || budget.Accommodation || budget.hotels || budget.Hotels);
  const food = parseVal(budget.food || budget.Food);
  const activities = parseVal(budget.activities || budget.Activities);
  const transportation = parseVal(budget.transportation || budget.Transportation || budget.transit || budget.Transit);
  
  // Total can be provided directly or computed
  const total = parseVal(budget.total || budget.Total) || (flights + accommodation + food + activities + transportation);

  const budgetItems = [
    { label: 'Flights', value: flights, icon: <Plane size={18} />, color: 'blue' },
    { label: 'Accommodation', value: accommodation, icon: <Bed size={18} />, color: 'purple' },
    { label: 'Food', value: food, icon: <Utensils size={18} />, color: 'orange' },
    { label: 'Activities', value: activities, icon: <Ticket size={18} />, color: 'teal' },
    { label: 'Transportation', value: transportation, icon: <Train size={18} />, color: 'slate' },
  ];

  return (
    <div className="budget-card-container">
      <div className="budget-card-header">
        <h4 className="budget-title">Estimated Budget</h4>
        <div className="budget-total-pill">
          <Wallet size={14} />
          <span>Total: ${total.toLocaleString()}</span>
        </div>
      </div>

      <div className="budget-card-body">
        <div className="budget-items-grid">
          {budgetItems.map((item, idx) => (
            <div key={idx} className="budget-item-card">
              <div className={`budget-item-icon-wrapper ${item.color}`}>
                {item.icon}
              </div>
              <div className="budget-item-info">
                <span className="budget-item-label">{item.label}</span>
                <span className="budget-item-value">${item.value.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="budget-grand-total">
          <span className="grand-total-label">Grand Total</span>
          <span className="grand-total-value">${total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
