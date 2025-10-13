import { ObjectValueFactory, defaultValidationRules } from 'binding';
import { ComboBox } from 'ui-components';

const cbCountries = document.querySelector('#cbCountries') as ComboBox;

const countryCodes = [
    'be',
    'fr',
    'br',
    'es',
    'de',
    'it',
    'nl'
]

cbCountries.factory = new ObjectValueFactory(
    {
        name: {
            validation: {
                validateable: defaultValidationRules.isString,
                errorMessage: 'Name should be a string'
            }
        },
        code: {
            /*
            validation: {
                validateable: (value) => countryCodes.includes(value as string),
                errorMessage: `Code should be a know country, known countries: ${countryCodes.join(', ')}`
            }
            */
        }
    },
    {
        toString: function () {
            return `name: ${this.name}, code: ${this.code}`;
        }
    }
);

cbCountries.addItems(
    {
        label: 'netherlands', 
        attributes: {
            name: 'the netherlands',
            code: 'nl'
        }
    },
    {
        label: 'colombia', 
        attributes: {
            name: 'colombia',
            code: 'cl'
        }
    }
);

cbCountries.addEventListener('change', function () {
    console.log(cbCountries.getValue()?.toString());
})