import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatepickerCustom.css';

interface CustomDatepickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

const NewDatePicker: React.FC<CustomDatepickerProps> = ({
  selected,
  onChange,
  placeholder = 'dd/mm/aaaa',
  required = false,
  id = 'custom-datepicker',
  name = 'custom-datepicker',
  className = '',
}) => {
  return (
    <DatePicker
      id={id}
      name={name}
      selected={selected}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholder}
      className={`w-full px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-sm ${className}`}
      calendarClassName="w-full"
      popperClassName="datepicker-popper"
      required={required}
      popperPlacement="bottom-start"
    />
  );
};

export default NewDatePicker;
