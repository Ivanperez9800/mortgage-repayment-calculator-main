const btn_submit = document.querySelector('.calculate-button');
const radioGroups = document.querySelectorAll('.radio-btn-group');

const fields = [

    {
        element: document.querySelector("#mortgage_amount"),
        validation: (value) => !isNaN(value) && value >= 1,
        errorMessage: "El campo está vacío o se ingresaron valores incorrectos."
    },
    {
        element: document.querySelector("#mortgage_term"),
        validation: (value) => !isNaN(value) && value >= 1,
        errorMessage: "El campo está vacío o se ingresaron valores incorrectos."
    },
    {
        element: document.querySelector("#interest_rate"),
        validation: (value) => {
            return !isNaN(value) && value >= 1 && value <= 100;
        },
        errorMessage: "El campo está vacío o se ingresaron valores incorrectos."
    }
];

fields.forEach(({ element }) => {

    const inputGroup = element.closest('.input-group');
    element.addEventListener('focus', () => {


        inputGroup.style.color = 'green';
        inputGroup.classList.add('input_group_focus');

        const icon = inputGroup.querySelector('.icon');

        icon.classList.add('icon_focus');

    })

    element.addEventListener('blur', () => {
        inputGroup.classList.remove('input_group_focus');
        inputGroup.style.color = 'black';
        const icon = inputGroup.querySelector('.icon');
        icon.classList.remove('icon_focus');
    })

})

radioGroups.forEach(group => {
    const input = group.querySelector('input[type="radio"]');

    input.addEventListener('change', () => {
        // Quita la clase "selected" de todos los grupos
        radioGroups.forEach(g => g.classList.remove('selected'));

        // Añade la clase "selected" al grupo seleccionado
        if (input.checked) {
            group.classList.add('selected');
        }
    });
});

btn_submit.addEventListener('click', function () {

    let isValidForm = true;

    // Validar cada campo de entrada
    fields.forEach(({ element, validation, errorMessage }) => {
        const elementError = element.parentNode.nextElementSibling;
        const isValid = validation(parseFloat(element.value));

        const inputGroup = element.closest('.input-group');
        const iconElement = inputGroup.querySelector('.icon');

        if (!isValid) {
            elementError.style.display = 'block';
            elementError.innerHTML = errorMessage;

            inputGroup.classList.add('input_group_error');

            iconElement.style.backgroundColor = '#d73329';
            iconElement.style.color = '#d79e9a';

            isValidForm = false;

        } else {
            elementError.style.display = 'none';
            inputGroup.classList.remove('input_group_error');

            iconElement.style.backgroundColor = '#e4f3ff';
            iconElement.style.color = '#445d67';
        }
    });

    const mortgageTypeError = document.querySelector('.mortgage-type-options .error');
    const mortgageTypeSelected = document.querySelector('input[name="mortgage_type"]:checked');
    if (!mortgageTypeSelected) {
        mortgageTypeError.style.display = 'block';

        isValidForm = false;
    } else {
        mortgageTypeError.style.display = 'none';
    }


    if (isValidForm) {
        const mortageAmount = parseFloat(fields[0].element.value);
        const mortgageTerm = parseFloat(fields[1].element.value);
        const interestRate = parseFloat(fields[2].element.value);
        const selected = document.querySelector('input[name="mortgage_type"]:checked').value;

        const result = calculateMortage(mortageAmount, mortgageTerm, interestRate, selected);
        const monthly_total = document.querySelector('.monthly-total');
        const total = document.querySelector('.total-amount');
        monthly_total.innerHTML = `$${result.pagoMensual}`;
        total.innerHTML = `$${result.pagoTotal}`;

        toggleResultsDisplay(true);

    } else {

        const results_empty = document.querySelector('.results-empty');
        const results_completed = document.querySelector('.results-completed');
        results_empty.style.display = 'flex';
        results_completed.style.display = 'none';

        toggleResultsDisplay(false);
    }
});

const toggleResultsDisplay = (showCompleted) => {
    const results_empty = document.querySelector('.results-empty');
    const results_completed = document.querySelector('.results-completed');

    if (showCompleted) {
        results_empty.style.display = 'none';
        results_completed.style.display = 'flex';
    } else {
        results_empty.style.display = 'flex';
        results_completed.style.display = 'none';
    }
};

const calculateMortage = (monto, plazo, tasaInteres, tipoHipoteca) => {
    const tasaMensual = tasaInteres / 12 / 100;
    const plazoEnMeses = plazo * 12;

    if (tipoHipoteca === 'repayment') {
        // Cálculo para hipoteca con amortización (repayment)
        const pagoMensual = (monto * tasaMensual * Math.pow(1 + tasaMensual, plazoEnMeses)) /
            (Math.pow(1 + tasaMensual, plazoEnMeses) - 1);
        const pagoTotal = pagoMensual * plazoEnMeses;

        return {
            pagoMensual: pagoMensual.toLocaleString("es-MX"),
            pagoTotal: pagoTotal.toLocaleString('es-MX'),
        };
    } else if (tipoHipoteca === 'interest') {
        // Cálculo para hipoteca solo intereses
        const pagoMensual = monto * tasaMensual;
        const pagoTotal = pagoMensual * plazoEnMeses;

        return {
            pagoMensual: pagoMensual.toLocaleString('es-MX'),
            pagoTotal: pagoTotal.toLocaleString('es-MX'),
            // saldoFinal: monto, // El saldo final es igual al monto inicial
        };
    } else {
        return {
            error: 'Tipo de hipoteca no válido',
        };
    }
}

const clearAll = document.querySelector('.clear-all');
clearAll.addEventListener('click', () => {
    radioGroups.forEach(group => group.classList.remove('selected'));
    fields.forEach(({ element: input }) => input.value = '');

    const results_empty = document.querySelector('.results-empty');
    const results_completed = document.querySelector('.results-completed');

    results_empty.style.display = 'flex';
    results_completed.style.display = 'none';
})