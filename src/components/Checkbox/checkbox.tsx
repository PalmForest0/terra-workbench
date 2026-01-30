import { useEffect } from 'react';
import './checkbox-styles.scss';

import { Check } from 'lucide-react';

function Checkbox({ value, valueChanged }: { value: boolean, valueChanged: (value: boolean) => void }) {
  
  useEffect(() => {
    valueChanged(value);
  }, [value]);

  return (
    <button 
        className={value ? "checkbox checkbox-checked" : "checkbox"} 
        onClick={() => {valueChanged(!value)}}>
          <Check className='checkmark-icon' />
    </button>
  )
}

export default Checkbox