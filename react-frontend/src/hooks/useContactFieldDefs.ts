import {useEffect, useState} from 'react';
import {getCustomVariables} from '../services/ContactCustomVariableService';
import {ContactCustomVariable} from '../interfaces/ContactCustomVariable';

export default function useContactFieldDefs() {
    const [fields, setFields] = useState<ContactCustomVariable[]>([]);
    useEffect(() => {
        getCustomVariables().then(setFields);
    }, []);
    return fields;
}
